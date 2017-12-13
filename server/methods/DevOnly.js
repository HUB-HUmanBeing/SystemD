import Project from '/imports/classes/Project'
import User from '/imports/classes/User'
import Fixtures from '/imports/Fixtures/Fixtures'
import Projects from '/lib/collections/Projects'
import Posts from '/lib/collections/Posts'
import Post from '/imports/classes/Post'
import PostComments from '/lib/collections/PostComments'
import PostComment from '/imports/classes/PostComment'
import Competences from "../../lib/collections/Competences";
import CollaboratorAdverts from "../../lib/collections/CollaboratorAdverts";
import CollaboratorAdvert from '/imports/classes/CollaboratorAdvert'


/****************************************
 * Toutes les méthodes ci dessous sont utiles pour la création et le renouvellement de jeux de données de test
 */
//todo : MEGA FAILLE DE SECU, a enlever dès qu'on passe en prod!!!!
if (Meteor.isDevelopment || Meteor.user().username=== "admin") {
Meteor.methods({
    /**********************************
     * Nettoyage de la base de donnée
     */
    clearDb: function () {
        Meteor.users.remove({}, function () {
            console.log("collection users reset")
        })
        Projects.remove({}, function () {
            console.log("collection projets reset")
        })
        Posts.remove({}, function () {
            console.log("collection posts reset")
        })
        PostComments.remove({}, function () {
            console.log("collection postComments reset")
        })
        CollaboratorAdverts.remove({}, function () {
            console.log("collection CollaboratorAdverts reset")
        })
    },
    /******************************
     * Création des utilisateurs et de leurs Projets
     */
    launchUsersAndProjectsFixtures: function (UserAsymKeys, brunchOfKeys) {
        check(UserAsymKeys, Object)
        check(brunchOfKeys, Object)
        Fixtures.usernames.forEach((username) => {
            //on crée des utilisateurs
            Meteor.call('createNewUser', {
                username: username,
                password: Fixtures.password
                //dans le callBack
            },{
                asymPublicKey: UserAsymKeys.asymPublicKey,
                encryptedAsymPrivateKey: UserAsymKeys.encryptedAsymPrivateKey
            }, function (err, createdUserId) {
                if (err) {
                    console.log("erreur", err)
                }
                //on récupere leur id
                let createdUser = User.findOne({_id: createdUserId});
                //on ajoute image, texte de description, position géographique
                createdUser.profile.imgUrl = Fixtures.getRandom("imgUrls");
                createdUser.profile.description = Fixtures.getRandom("lorems");
                createdUser.profile.location = Fixtures.getRandom("locations");
                //chaque user receoit entre 0 et 10 categories aléatoires
                let nbOfCategories = Math.floor(Math.random() * 9) + 2
                //ajout d'un nombre aléatoire de centre d'interet
                let categories = [];
                for (let i = 0; i < nbOfCategories; i++) {
                    let newCategory = Math.floor(Math.random() * 20)
                    if (!categories.includes(newCategory)) {
                        categories.push(newCategory)
                    }
                }
                createdUser.profile.categories = categories;
                //ajout d'un nombre aléatoire de compétences
                let nbOfCompetences = Math.floor(Math.random() * 10)
                let competences = [];
                let totalCompetences = Competences.find({}).count()
                for (let i = 0; i < nbOfCompetences; i++) {
                    let newCompetence = Math.floor(Math.random() * totalCompetences)
                    competences.push(newCompetence)
                }
                createdUser.profile.competences = competences;

                //on sauvegarde,
                createdUser.save(function (err) {
                    //dans le callback
                    if (err) {
                        console.log("erreur", err)
                    }
                    //on crée un nouveau projet
                    let createdProject = new Project
                    //on lui attribue un nom, une image, une description, une position
                    createdProject.name = "projet de " + username;
                    createdProject.publicInfo.imgUrl = Fixtures.getRandom("imgUrls");
                    createdProject.publicInfo.description = Fixtures.getRandom("lorems");
                    createdProject.publicInfo.location = Fixtures.getRandom("locations")
                    //chaque Projet receoit entre 0 et 10 categories aléatoires
                    let nbOhCategories = Math.floor(Math.random() * 10)
                    let categories = [];
                    for (let i = 0; i < nbOhCategories; i++) {
                        let newCategory = Math.floor(Math.random() * 20)
                        if (!categories.includes(newCategory)) {
                            categories.push(newCategory)
                        }

                    }
                    createdProject.publicInfo.categories = categories;
                    createdProject.encryptedAsymPrivateKey = brunchOfKeys.encryptedAsymPrivateKey
                    createdProject.publicInfo.asymPublicKey = brunchOfKeys.projectAsymPublicKey
                    //on rajoute l'utilisateur courant comme admin du projet
                    createdProject.members.push({
                        user_id: createdUserId,
                        username: username,
                        roles: ['member', 'admin']
                    })
                    //on sauvegarde
                    createdProject.save((err, projectId) => {
                        if (err) {
                            console.log("erreur", err)
                        }
                        //dans le callback, on rajoute le projet dans la liste des projets de l'utilisateur
                        createdUser.profile.projects.push({
                            project_id: projectId,
                            name: createdProject.name,
                            encryptedProjectKey : brunchOfKeys.encryptedProjectKey ,
                            roles: ['member', 'admin']
                        });
                        //et on sauvegarde
                        createdUser.save((err) => {
                            if (err) {
                                console.log("erreur", err)
                            }
                        })
                    })
                })
            });
        })
    },
    /*************************
     * action de remplissage des projets avec des utilisateurs et des invitations
     * @constructor
     */
    LaunchMembersAndInvitFixtures: function (brunchOfKeys) {
        check(brunchOfKeys, Object)
        //on récupere tout les projets et utilisateurs qu'on trie par date de création pour les avoir dans le meme ordre
        let Projects = Project.find({}, {sort: {createdAt: 1}}).fetch()
        let Users = User.find({}, {sort: {createdAt: 1}}).fetch()
        //pour chaque projet
        Projects.forEach((project, i) => {
            //les utilisateurs et les projets sont comme "mis en rond" par l'utilisation de la fonction loopId
            //on invite les deux utilisateurs situés a 1 et 2 crans sur la droite
            project.invitations.push({

                    adminUsername: Users[i].username,
                    invitationMessage: Fixtures.getRandom("lorems"),
                    user_id: Users[Fixtures.loopId(i + 1)]._id
                },
                {
                    adminUsername: Users[i].username,
                    invitationMessage: Fixtures.getRandom("lorems"),
                    user_id: Users[Fixtures.loopId(i + 2)]._id
                }
            );
            //on ajoute les utilisateurs situées a 4,3,2, et 1 crans sur la gauche
            project.members.push(
                {user_id: Users[Fixtures.loopId(i - 4)]._id},
                {user_id: Users[Fixtures.loopId(i - 3)]._id},
                {user_id: Users[Fixtures.loopId(i - 2)]._id},
                {user_id: Users[Fixtures.loopId(i - 1)]._id})
            //on sauvegarde
            project.save((err) => {
                if (err) {
                    console.log("erreur", err)
                }
            })
        })

        //maintenant, pour chaque utilisateur
        Users.forEach((user, j) => {
            //l'utilisateur est donc l'invité des projets situés a un et deux crans sur sa gauche
            // (dessinez un cercle avec 6 points si c'est pas clair)
            //en remplissant son tableau de notifications avec ce message
            user.profile.notifications.push({
                content: 'Invitation du projet "' + Projects[Fixtures.loopId(j - 1)].name + '"',
                type: "project",
                path: Router.path("userSelfProjects")
            }, {
                content: 'Invitation du projet "' + Projects[Fixtures.loopId(j - 2)].name + '"',
                type: "project",
                path: Router.path("userSelfProjects")
            });
            user.profile.invitations.push(
                {
                    project_id: Projects[Fixtures.loopId(j - 1)]._id,
                    invitationMessage: Fixtures.getRandom("lorems"),
                    encryptedProjectKey : brunchOfKeys.encryptedProjectKey
                },
                {
                    project_id: Projects[Fixtures.loopId(j - 2)]._id,
                    invitationMessage: Fixtures.getRandom("lorems"),
                    encryptedProjectKey : brunchOfKeys.encryptedProjectKey
                });

            //l'utilisateur est donc membre des projets situés a 1,2 et 3  crans sur sa droite
            // (dessinez un cercle avec 6 points si c'est pas clair)
            user.profile.projects.push(
                {
                    project_id: Projects[Fixtures.loopId(j + 1)]._id,
                    name: Projects[Fixtures.loopId(j + 1)].name,
                    encryptedProjectKey : brunchOfKeys.encryptedProjectKey
                },
                {
                    project_id: Projects[Fixtures.loopId(j + 2)]._id,
                    name: Projects[Fixtures.loopId(j + 2)].name,
                    encryptedProjectKey : brunchOfKeys.encryptedProjectKey
                },
                {
                    project_id: Projects[Fixtures.loopId(j + 3)]._id,
                    name: Projects[Fixtures.loopId(j + 3)].name,
                    encryptedProjectKey : brunchOfKeys.encryptedProjectKey
                }
            );
            //on sauvegarde
            user.save((err) => {
                if (err) {
                    console.log("erreur", err)
                }
            })

        })
    },
    /*************************
     * action de creation d'une grosse volée de post
     * @constructor
     */
    LaunchBlogPostsFixtures: function () {
        //on récupere tout les projets et utilisateurs qu'on trie par date de création pour les avoir dans le meme ordre
        let Projects = Project.find({}).fetch()
        let Users = User.find({}).fetch()
        //pour chaque projet
        Projects.forEach((project) => {
            for (let k = 0; k < 5; k++) {
                let post = new Post
                post.isProject = true;
                post.author_id = project._id;
                post.lonLat = project.publicInfo.location.lonLat;
                post.title = 'Article du projet "' + project.name + '" n°' + k;
                post.content = Fixtures.getRandom("postLorems");
                post.isImageWide = k % 2 === 0;
                post.imageUrl = k % 2 === 0 ? Fixtures.getRandom("wideImgUrls") : Fixtures.getRandom("imgUrls");
                post.save()
            }
        })
        //maintenant, pour chaque utilisateur
        Users.forEach((user) => {
            for (let k = 0; k < 5; k++) {
                let post = new Post

                post.isProject = false;

                post.author_id = user._id;
                post.lonLat = user.profile.location.lonLat;
                post.title = 'Article de ' + user.username + ' n°' + k;
                post.content = Fixtures.getRandom("postLorems");
                post.isImageWide = k % 2 === 0;//on en met un sur deux en imageWide
                post.imageUrl = k % 2 === 0 ? Fixtures.getRandom("wideImgUrls") : Fixtures.getRandom("imgUrls");
                post.save()
            }
        })
    },
    /*************************
     * action de creation d'une grosse volée de commentaires
     * @constructor
     */
    LaunchCommentsFixtures: function () {
        //on récupere tout les projets et utilisateurs qu'on trie par date de création pour les avoir dans le meme ordre
        let Posts = Post.find({}).fetch()
        let Users = User.find({}).fetch()
        //pour chaque post
        Posts.forEach((post) => {
            //on définit un nombre aléatoire de commentaires entre 0 et 25
            let nbOfComments = Math.floor(Math.random() * 25)
            //pour chacuns
            for (let k = 0; k < nbOfComments; k++) {
                //on randomise le tableau des users
                Fixtures.shuffle(Users)
                //on crée un nouveau commmentaire
                let comment = new PostComment
                //on lui assigne les bonnes valeurs
                comment.post_id = post._id;
                comment.user_id = Users[0]._id;
                comment.username = Users[0].username;
                comment.content = Fixtures.getRandom('commentLorems')
                //et on le sauvegarde
                comment.save()
            }
            //puis on sauvegarde le nombre de commentaires associés dans l'objet post
            post.nbOfComments = nbOfComments
            post.save()
        })
    },
    /*************************
     * action de creation d'une grosse volée de commentaires
     * @constructor
     */
    LaunchAdvertsFixtures: function () {
        //on récupere tout les projets
        let projects = Project.find({}).fetch()
        //pour chaque post
        projects.forEach((project) => {
            //on définit un nombre aléatoire de commentaires entre 0 et 25
            let nbOfAdverts = Math.floor(Math.random() * 4)
            //pour chacuns
            for (let k = 0; k < nbOfAdverts ; k++) {
                //on crée un nouveau commmentaire
                let advert = new CollaboratorAdvert
                //on lui assigne les bonnes valeurs
                advert.title = "annonce du projet \"" + project.name +'" n°' +k
                advert.content = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto atque blanditiis corporis distinctio doloribus ducimus eos impedit magni modi obcaecati optio perspiciatis, quia quidem, repellat tempore totam vel voluptates voluptatum!"
                advert.location = project.publicInfo.location
                advert.project_id = project._id
                advert.range = 30
                //et on le sauvegarde
                advert.save()
            }
        })
    }
})
}