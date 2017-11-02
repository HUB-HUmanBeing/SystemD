import Project from '/imports/classes/Project'
import User from '/imports/classes/User'
import Fixtures from '/imports/Fixtures/Fixtures'

if (Meteor.isDevelopment) {
    Meteor.methods({
        clearDb: function () {
            console.log("ok")
            User.find().fetch().forEach((user) => {
                user.remove()
            })
            Project.find().fetch().forEach((project) => {
                project.remove()
            })
        },
        launchUsersAndProjectsFixtures: function () {
            Fixtures.usernames.forEach((username) => {
                Meteor.call('createNewUser', {
                    username: username,
                    password: Fixtures.password
                }, function (err, createdUserId) {
                    let createdUser = User.findOne({_id: createdUserId});
                    createdUser.profile.imgUrl = Fixtures.getRandom("imgUrls");
                    createdUser.profile.description = Fixtures.getRandom("lorems");
                    createdUser.profile.location = Fixtures.getRandom("locations")
                    createdUser.save(function () {
                        let createdProject = new Project
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
                        createdProject.save((err, projectId) => {
                            createdUser.profile.projects.push({
                                project_id: projectId,
                                name: createdProject.name,
                                roles: ['member', 'admin']
                            });
                            //et on sauvegarde
                            createdUser.save()
                        })
                    })
                });
            })
        },
        SendInvitations : function(){
            Project.find.fetch().forEach((project)=>{
            })
        }
    })
}