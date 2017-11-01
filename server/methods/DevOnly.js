import Projects from '/lib/collections/Projects'
import User from '/imports/classes/User'

if (Meteor.isDevelopment) {
    Meteor.methods({
        clearUser: function () {
            User.find().fetch().forEach((user)=>{
            user.remove()
            })
        }
    })
}