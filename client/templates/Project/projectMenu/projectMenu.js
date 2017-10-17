import User from '/imports/classes/Project';

Template.projectMenu.helpers({
    //add you helpers here
    title : function () {
        return Template.instance().data.project.name
    },
    color : 'orange',
    imgUrl : function () {
        return  Template.instance().data.project.publicInfo.imgUrl
    },
    icon : function () {
        icon =""
       Meteor.user().profile.projects.forEach(function (userProject) {
           if(userProject.project_id){
               if(_.contains(userProject.roles, "admin")){
                   icon= 'verified_user'
               }else if(_.contains(userProject.roles, "member")){
                    icon = 'perm_identity'
               }
           }
       })
        return icon
    },
    path :function () {
        return "projectMainPage"
    } ,

    pathData : function(){
        return Template.instance().data.project._id
    }


});

Template.projectMenu.events({
    //add your events here

});

Template.projectMenu.onCreated(function () {


});

Template.projectMenu.onRendered(function () {
    //add your statement here
});

Template.projectMenu.onDestroyed(function () {
    //add your statement here
});



