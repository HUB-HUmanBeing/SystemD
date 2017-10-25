import Project from '/imports/classes/Project'

Template.inviteProjectForm.helpers({
    //add you helpers here
});

Template.inviteProjectForm.events({
    //add your events here
    "submit form" : function (event,instance) {
        event.preventDefault();
        let invitationMessage = $('#invitationMessage').val();
        let userId = instance.data.userId;
        let project = Project.findOne({_id : instance.data.project.project_id});
        project.callMethod('inviteUser',userId, invitationMessage, (error, result) => {

        })
    }
});

Template.inviteProjectForm.onCreated(function () {
    //add your statement here

});

Template.inviteProjectForm.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
});

Template.inviteProjectForm.onDestroyed(function () {
    //add your statement here
});

