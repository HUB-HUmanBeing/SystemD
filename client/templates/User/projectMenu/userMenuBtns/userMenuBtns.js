Template.userMenuBtns.helpers({
    //add you helpers here
    adminProjects: function () {
        let currentUserProjects = Meteor.user().profile.projects
        let adminProjects = []
        currentUserProjects.forEach(project => {
            if(project.roles.includes("admin")){
                //project.imgUrl = Project.findOne({_id : project.project_id}).publicInfo.imgUrll
                adminProjects.push(project)
            }
        })
        return adminProjects
    }
});

Template.userMenuBtns.events({
    //add your events here
    "click [inviteToProjects]": function (event, instance) {
        $('.modal').modal();
        $('.invite-to-projects-modal').modal('open');
        Meteor.setTimeout(function () {
            $('.collapsible').collapsible();
        }, 150)
    }
});

Template.userMenuBtns.onCreated(function () {
    //add your statement here
});

Template.userMenuBtns.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
});

Template.userMenuBtns.onDestroyed(function () {
    //add your statement here
});

