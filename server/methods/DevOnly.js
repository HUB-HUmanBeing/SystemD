import Project from '/imports/classes/Project'
import User from '/imports/classes/User'
import Fixtures from '/imports/Fixtures/Fixtures'
import Projects from '/lib/collections/Projects'

/****************************************
 * Toutes les méthodes ci dessous sont utiles pour la création et le renouvellement de jeux de données de test
 */
if (Meteor.isDevelopment) {
    Meteor.methods({
        /**********************************
         * Nettoyage de la base de donnée
         */
        clearDb: function () {
            Meteor.users.remove({},function () {
                console.log("collection users reset")
            })


            Projects.remove({},function () {
                console.log("collection projets reset")
            })


        },
        /******************************
         * Création des utilisateurs et de leurs Projets
         */
        launchUsersAndProjectsFixtures: function () {
            Fixtures.usernames.forEach((username) => {
                //on crée des utilisateurs
                Meteor.call('createNewUser', {
                    username: username,
                    password: Fixtures.password
                    //dans le callBack
                }, function (err, createdUserId) {
                    if(err){
                        console.log("erreur", err)
                    }
                    //on récupere leur id
                    let createdUser = User.findOne({_id: createdUserId});
                    //on ajoute image, texte de description, position géographique
                    createdUser.profile.imgUrl = Fixtures.getRandom("imgUrls");
                    createdUser.profile.description = Fixtures.getRandom("lorems");
                    createdUser.profile.location = Fixtures.getRandom("locations");
                    //on sauvegarde,
                    createdUser.save(function (err) {
                        //dans le callback
                        if(err){
                            console.log("erreur", err)
                        }
                        //on crée un nouveau projet
                        let createdProject = new Project
                        //on lui attribue un nom, une image, une description, une position
                        createdProject.name = "projet de " + username;
                        createdProject.publicInfo.imgUrl = Fixtures.getRandom("imgUrls");
                        createdProject.publicInfo.description = Fixtures.getRandom("lorems");
                        createdProject.publicInfo.location = Fixtures.getRandom("locations")
                        //on rajoute l'utilisateur courant comme admin du projet
                        createdProject.members.push({
                            user_id: createdUserId,
                            username: username,
                            roles: ['member', 'admin']
                        })
                        //on sauvegarde
                        createdProject.save((err, projectId) => {
                            if(err){
                                console.log("erreur", err)
                            }
                            //dans le callback, on rajoute le projet dans la liste des projets de l'utilisateur
                            createdUser.profile.projects.push({
                                project_id: projectId,
                                name: createdProject.name,
                                roles: ['member', 'admin']
                            });
                            //et on sauvegarde
                            createdUser.save((err)=>{
                                if(err){
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
        LaunchMembersAndInvitFixtures: function () {
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
                        user_id: Users[Fixtures.loopId(i +1)]._id
                    },
                    {
                        adminUsername: Users[i].username,
                        invitationMessage: Fixtures.getRandom("lorems"),
                        user_id: Users[Fixtures.loopId(i +2)]._id
                    }
                );
                //on ajoute les utilisateurs situées a 4,3,2, et 1 crans sur la gauche
                project.members.push(
                    {user_id: Users[Fixtures.loopId(i - 4)]._id},
                    {user_id: Users[Fixtures.loopId(i - 3)]._id},
                    {user_id: Users[Fixtures.loopId(i - 2)]._id},
                    {user_id: Users[Fixtures.loopId(i - 1)]._id})
                //on sauvegarde
                project.save((err)=>{
                    if(err){
                        console.log("erreur", err)
                    }
                })
            })

            //maintenant, pour chaque utilisateur
            Users.forEach((user, j) => {
                //l'utilisateur est donc l'invité des projets situés a un et deux crans sur sa gauche
                // (dessinez un cercle avec 6 points si c'est pas clair)
                user.profile.invitations.push(
                    {
                        project_id: Projects[Fixtures.loopId(j - 1)]._id,
                        invitationMessage: Fixtures.getRandom("lorems")
                    },
                    {
                        project_id: Projects[Fixtures.loopId(j - 2)]._id,
                        invitationMessage: Fixtures.getRandom("lorems")
                    });
                //l'utilisateur est donc membre des projets situés a 1,2 et 3  crans sur sa droite
                // (dessinez un cercle avec 6 points si c'est pas clair)
                user.profile.projects.push(
                    {
                        project_id: Projects[Fixtures.loopId(j + 1)]._id,
                        name: Projects[Fixtures.loopId(j + 1)].name
                    },
                    {
                        project_id: Projects[Fixtures.loopId(j + 2)]._id,
                        name: Projects[Fixtures.loopId(j + 2)].name
                    },
                    {
                        project_id: Projects[Fixtures.loopId(j + 3)]._id,
                        name: Projects[Fixtures.loopId(j + 3)].name
                    }
                );
                //on sauvegarde
                user.save((err)=>{
                    if(err){
                        console.log("erreur", err)
                    }
                })

            })
        }
    })
}