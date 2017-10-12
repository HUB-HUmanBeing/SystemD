import Projects from '/lib/collections/Projects'
Meteor.methods({
    isProjectExists : function (projectName) {
        check(projectName, String)
        return Projects.find({name : projectName}).count() === 0
    }
})