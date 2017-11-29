import Projects from '/lib/collections/Projects'

Meteor.methods({
    /**************
     * renvoie true si le nom de projet n'existes pas
     */
    searchTool: function (offsetStep, searchOptions) {
        let limit = 6
        check(offsetStep, Number);
        let offset = limit * offsetStep
        check(searchOptions, Object)
        check(searchOptions.isProject, Boolean)
        check(searchOptions.range, Number)

        let name = {}
        if (searchOptions.name) {
            check(searchOptions.name, String)
            name = {$text: {$search: searchOptions.name}}
        }


        let categories = {}
        if (searchOptions.categories && searchOptions.categories.length) {
            check(searchOptions.categories, [Number])
            categories = {
                [searchOptions.isProject ? "publicInfo.categories" : "profile.categories"]: {
                    "$elemMatch": {"$in": searchOptions.categories}
                }
            }
        }

        let competences = {}
        if (searchOptions.competences && searchOptions.competences.length) {
            check(searchOptions.competences, Array)
            let competenceQueries = []
            searchOptions.competences.forEach((competenceArray) => {
                check(competenceArray, [Number])
                competenceQueries.push({
                    ["profile.competences"]: {
                        "$elemMatch": {"$in": competenceArray}
                    }
                })
            })
            competences = {"$and": competenceQueries}
        }

        let geo = {}
        if (searchOptions.range < 150) { //si le curseur etait au max, on passe le selecteur a tout (vu qu'on l'applique dans un $and)
            geo = {
                [searchOptions.isProject ? "publicInfo.location.lonLat" : "profile.location.lonLat"]: {
                    "$near": {
                        "$geometry": {
                            type: "Point",
                            coordinates: searchOptions.rangeCenter

                        }, $maxDistance: searchOptions.range * 1000
                    }
                }
            }
        }

        let query = {
            "$and": [ //validant simultanément les deux conditions suivantes
                name,//cvalidant la recherche de tyoe text sur le nom

                categories,
                competences,
                geo,//validant les conditions géographiques
            ]
        }
        const currentUserLocation = Meteor.user().profile.location
        let results = []
        if (searchOptions.isProject) {
            let requestResults = Projects.find(
                query,
                {
                    skip: offset,
                    limit: limit,//on limite la requetes a notre limite pour l'infinite scroll
                }).fetch()

            requestResults.forEach((item) => {
                let relativeDistance

                if (item.publicInfo.location.lonLat && currentUserLocation.lonLat) {
                    let distance = new Haversine(
                        item.publicInfo.location.lonLat[1],
                        item.publicInfo.location.lonLat[0],
                        currentUserLocation.lonLat[1],
                        currentUserLocation.lonLat[0]
                    );
                    relativeDistance = parseInt(distance.kilometers)
                }
                results.push({
                    _id: item._id,
                    relativeDistance: relativeDistance
                })
            })
        } else {
            let requestResults = Meteor.users.find(
                query,
                {
                    skip: offset,
                    limit: limit,//on limite la requetes a notre limite pour l'infinite scroll
                }).fetch();
            requestResults.forEach((item) => {
                let relativeDistance
                if (item.profile.location.lonLat && currentUserLocation.lonLat) {
                    let distance = new Haversine(
                        item.profile.location.lonLat[1],
                        item.profile.location.lonLat[0],
                        currentUserLocation.lonLat[1],
                        currentUserLocation.lonLat[0]
                    );
                    relativeDistance = parseInt(distance.kilometers)
                }
                results.push({
                    _id: item._id,
                    relativeDistance: relativeDistance
                })
            })
        }
        return results
    }
})