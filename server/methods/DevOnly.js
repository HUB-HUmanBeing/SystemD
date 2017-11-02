import Project from '/imports/classes/Project'
import User from '/imports/classes/User'
import Fixtures from '/imports/Fixtures/Fixtures'

if (Meteor.isDevelopment) {
    Meteor.methods({
        clearDb: function () {
            console.log("ok")
            User.find().fetch().forEach((user) => {
                user.remove(function () {
                    console.log("collection users reset")
                })
            })
            Project.find().fetch().forEach((project) => {
                project.remove(function () {
                    console.log("collection projets reset")
                })
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
        LaunchMembersAndInvitFixtures: function () {
            let Projects = Project.find({}, {sort: {createdAt: 1}}).fetch()
            let Users = User.find({}, {sort: {createdAt: 1}}).fetch()
            Projects.forEach((project, i) => {
                project.invitations.push({

                        adminId: Users[i]._id,
                        invitationMessage: Fixtures.getRandom("lorems"),
                        user_id: Users[Fixtures.loopId(i - 6)]._id
                    },
                    {
                        adminId: Users[i]._id,
                        invitationMessage: Fixtures.getRandom("lorems"),
                        user_id: Users[Fixtures.loopId(i - 5)]._id
                    }
                );
                project.members.push(
                    {user_id: Users[Fixtures.loopId(i - 4)]._id},
                    {user_id: Users[Fixtures.loopId(i - 3)]._id},
                    {user_id: Users[Fixtures.loopId(i - 2)]._id},
                    {user_id: Users[Fixtures.loopId(i - 1)]._id})
                project.save()
            })
            Users.forEach((user, j) => {
                user.profile.invitations.push(
                    {
                        project_id: Projects[Fixtures.loopId(j + 1)]._id,
                        invitationMessage: Fixtures.getRandom("lorems")
                    },
                    {
                        project_id: Projects[Fixtures.loopId(j + 2)]._id,
                        invitationMessage: Fixtures.getRandom("lorems")
                    });
                user.profile.projects.push(
                    {
                        project_id: Projects[Fixtures.loopId(j + 3)]._id,
                        name: Projects[Fixtures.loopId(j + 3)].name
                    },
                    {
                        project_id: Projects[Fixtures.loopId(j + 4)]._id,
                        name: Projects[Fixtures.loopId(j + 4)].name
                    },
                    {
                        project_id: Projects[Fixtures.loopId(j + 5)]._id,
                        name: Projects[Fixtures.loopId(j + 5)].name
                    }
                );
                user.save()

            })
        }
    })
}