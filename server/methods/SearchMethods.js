import Projects from '/lib/collections/Projects'

Meteor.methods({
    /****************************************************
     * Methode permetant d'eefectuer une recherche sur le site en fonction de plusieurs parametres
     * @param offsetStep
     * @param searchOptions
     * @returns {Array}
     */
    searchTool: function (offsetStep, searchOptions) {
        //on initialise la limite
        let limit = 6
        //on check la valeur de l'offset
        check(offsetStep, Number);
        //et on retournera les requetes uniquement après cet offset multiplié par le nombre d'articles renvoyés a chaque fois
        let offset = limit * offsetStep
        check(searchOptions, Object)
        check(searchOptions.isProject, Boolean)
        check(searchOptions.range, Number)
        //pour le nom entré par l'utilisateur
        let name = {}
        if (searchOptions.name) {
            check(searchOptions.name, String)
            //on viendra chercher a partir de notre index en case insensitive
            name = {$text: {$search: searchOptions.name}}

        }
        //pour les categories
        let categories = {}
        //si des categories ont eté ajoutées
        if (searchOptions.categories && searchOptions.categories.length) {
            check(searchOptions.categories, [Number])
            //on crée la query qui nous permetra de les retrouver
            categories = {
                [searchOptions.isProject ? "publicInfo.categories" : "profile.categories"]: {
                    "$elemMatch": {"$in": searchOptions.categories}
                }
            }
        }
        //pour les competences
        let competences = {}
        //si il y en a
        if (searchOptions.competences && searchOptions.competences.length) {
            check(searchOptions.competences, Array)
            let competenceQueries = []
            //on boucle sur les differents criteres de l'utilisateur
            searchOptions.competences.forEach((competenceArray) => {
                check(competenceArray, [Number])
                //et pour chacuns on fait la query necessaire qu'on push dans un tableau
                competenceQueries.push({
                    ["profile.competences"]: {
                        "$elemMatch": {"$in": competenceArray}
                    }
                })
            })
            //on formatte ensuite la query finale devant vérifier tous les criteres de l'utilisateur
            competences = {"$and": competenceQueries}
        }

        //notre requete est désormais composé des trois précedentes requetes avec un ET
        let query = {
            "$and": [
                name,
                competences,
                categories,
            ]
        }
        //si on a ce qu'il faut pour faire une requete géolocalisée
        if (searchOptions.rangeCenter) {
            if (searchOptions.range < 150) { //si l'utilisateur a choisi une distance limite spécifique
                query[searchOptions.isProject ? "publicInfo.location.lonLat" : "profile.location.lonLat"] = {
                    "$near": {
                        "$geometry": {
                            type: "Point",
                            coordinates: searchOptions.rangeCenter
                        }, $maxDistance: searchOptions.range * 1000
                    }
                }
            } else if (!searchOptions.name) { //sinon, on la fait quand meme, mais sans maxDistance, ainsi, ca nous les triera par distance
                query[searchOptions.isProject ? "publicInfo.location.lonLat" : "profile.location.lonLat"] = {
                    "$near": {
                        "$geometry": {
                            type: "Point",
                            coordinates: searchOptions.rangeCenter
                        }
                    }
                }
            }
        }
        let results = []
        //si l'on fait une recherche sur les projets
        if (searchOptions.isProject) {
            //on fait un find mongoDb avec tout nos parametres
            let requestResults = Projects.find(
                query,
                {
                    skip: offset,
                    limit: limit,//on limite la requetes a notre limite pour l'infinite scroll
                }).fetch()
            //pour chacuns des resultats
            requestResults.forEach((item) => {
                //on vient calculer la distance relative entre l'utilisateur et le projet
                let relativeDistance
                if (Meteor.userId()) {
                    const currentUserLocation = Meteor.user().profile.location
                    if (item.publicInfo.location.lonLat && currentUserLocation.lonLat) {
                        let distance = new Haversine(
                            item.publicInfo.location.lonLat[1],
                            item.publicInfo.location.lonLat[0],
                            currentUserLocation.lonLat[1],
                            currentUserLocation.lonLat[0]
                        );
                        relativeDistance = parseInt(distance.kilometers)
                    }
                }
                //et on ajoute au tableau de resultat l'id des projets et leur distance relative, ainsi que les infos
                // nécessaires pour pas avoir a ffaire une nouvelle requete au moment d'aficher leur miniature
                results.push({
                    _id: item._id,
                    name: item.name,
                    imgUrl: item.publicInfo.imgUrl,
                    categories: item.publicInfo.categories,
                    relativeDistance: relativeDistance
                })
            })
        } else { //idem lorsqu'on recherche un utilisateur
            let requestResults = Meteor.users.find(
                query,
                {
                    skip: offset,
                    limit: limit,//on limite la requetes a notre limite pour l'infinite scroll
                }).fetch();
            requestResults.forEach((item) => {
                let relativeDistance
                if (searchOptions.callingFrom === "projectMembers") {

                    if (item.profile.location.lonLat && searchOptions.rangeCenter[1]) { //le calcul se fait coté serveur
                        // pour ne pas livrer au client des coordonnées précises d'autres utilisateurs
                        let distance = new Haversine(
                            item.profile.location.lonLat[1],
                            item.profile.location.lonLat[0],
                            searchOptions.rangeCenter[1],
                            searchOptions.rangeCenter[0]
                        );
                        relativeDistance = parseInt(distance.kilometers)
                    }

                } else {
                    if (Meteor.userId()) {
                        const currentUserLocation = Meteor.user().profile.location
                        if (item.profile.location.lonLat && currentUserLocation.lonLat) { //le calcul se fait coté serveur
                            // pour ne pas livrer au client des coordonnées précises d'autres utilisateurs
                            let distance = new Haversine(
                                item.profile.location.lonLat[1],
                                item.profile.location.lonLat[0],
                                currentUserLocation.lonLat[1],
                                currentUserLocation.lonLat[0]
                            );
                            relativeDistance = parseInt(distance.kilometers)
                        }
                    }
                }

                results.push({
                    _id: item._id,
                    name: item.username,
                    imgUrl: item.profile.imgUrl,
                    categories: item.profile.categories,
                    relativeDistance: relativeDistance
                })
            })
        }
        //on finit par renvoyer les resultats
        return results
    },
    NewConvSearch : function (name) {
        check(name , String)
        const currentUserLocation = Meteor.user().profile.location
        let users = Meteor.users.find({$text: {$search: name}}, {
            //liste des champs non renvoyés
            fields: {
                emails: 0,
                services: 0,
                'profile.projects': 0,
                'profile.description': 0,
                'profile.notifications': 0,
                'profile.invitations': 0,
                'profile.followedAuthors': 0,
                'profile.competences': 0,
                'profile.categories': 0,
                'profile.encryptedAsymPrivateKey': 0,
                'profile.conversations':0
            },
            limit: 5,//on limite la requetes a 5 réponses
            sort: {//en les triant par dates décroissantes
                createdAt: -1,
            }
        }).fetch()

        let usersResults = []
        users.forEach((user)=>{
            let relativeDistance
            if (user.profile.location.lonLat && currentUserLocation.lonLat) { //le calcul se fait coté serveur
                // pour ne pas livrer au client des coordonnées précises d'autres utilisateurs
                let distance = new Haversine(
                    user.profile.location.lonLat[1],
                    user.profile.location.lonLat[0],
                    currentUserLocation.lonLat[1],
                    currentUserLocation.lonLat[0]
                );
                relativeDistance = parseInt(distance.kilometers)
            }
            usersResults.push({
                _id: user._id,
                name: user.username,
                imgUrl: user.profile.imgUrl,
                asymPublicKey: user.profile.asymPublicKey,
                relativeDistance: relativeDistance
            })
        })

        let projects = Projects.find({$text: {$search: name}}, {
            //liste des champs non renvoyés
            fields: {
                createdAt: 0,
                members: 0,
                invitations: 0,
                conversations : 0
            },
            limit: 5,//on limite la requetes a 5 réponse
            sort: {//en les triant par dates décroissantes
                createdAt: -1,
            }
        }).fetch()
        let projectsResults = []
        projects.forEach((project)=>{
            let relativeDistance
            if (project.publicInfo.location.lonLat && currentUserLocation.lonLat) { //le calcul se fait coté serveur
                // pour ne pas livrer au client des coordonnées précises d'autres utilisateurs
                let distance = new Haversine(
                    project.publicInfo.location.lonLat[1],
                    project.publicInfo.location.lonLat[0],
                    currentUserLocation.lonLat[1],
                    currentUserLocation.lonLat[0]
                );
                relativeDistance = parseInt(distance.kilometers)
            }
            projectsResults.push({
                _id: project._id,
                name: project.name,
                imgUrl: project.publicInfo.imgUrl,
                asymPublicKey: project.asymPublicKey,
                relativeDistance: relativeDistance
            })
        })

        return  {
            searched :  name,
            users : usersResults,
            projects : projectsResults
        }

    }
})