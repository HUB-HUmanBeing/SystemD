import Project from '/imports/classes/Project'
import User from '/imports/classes/User'

if (Meteor.isDevelopment) {
    Meteor.methods({
        clearUsers: function () {
            User.find().fetch().forEach((user)=>{
            user.remove()
            })
        },
        clearProjects: function () {
            Project.find().fetch().forEach((project)=>{
                project.remove()
            })
        }
    })
}