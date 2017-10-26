Template.userSelfProjects.helpers({
    //add you helpers here
    adminProjects :function () {
        return Template.instance().adminProjects.get()
    },
    memberProjects :function () {
        return Template.instance().memberProjects.get()
    },
    invitations : function () {
        return Meteor.user().profile.invitations
    }
});

Template.userSelfProjects.events({
    //add your events here
});

Template.userSelfProjects.onCreated(function () {
    //add your statement here
    let projects = Meteor.user().profile.projects
    let adminProjects = []
    let memberProjects = []
    projects.forEach(function (project) {
        if(project.roles.includes("admin")){
            adminProjects.push(project)
        }else{
            memberProjects.push(project)
        }
    })
    this.adminProjects = new ReactiveVar(adminProjects)
    this.memberProjects = new ReactiveVar(memberProjects)
});

Template.userSelfProjects.onRendered(function () {
    //add your statement here
});

Template.userSelfProjects.onDestroyed(function () {
    //add your statement here
});

