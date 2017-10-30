import Project from '/imports/classes/Project'

Template.clearInvitationProject.helpers({
    //add you helpers here
});

Template.clearInvitationProject.events({
    'click [clearInvitation]': function (event, instance) {
        event.preventDefault();
        let invitation = instance.data.invitation;
        let currentProject = instance.data.project;
        currentProject.callMethod(
            'deleteInvitation',
            invitation,
            (error, result) => {
                if (!error) {
                    if (error) {
                        Materialize.toast("une erreur s'est produite", 4000, 'red')
                    } else {
                        Materialize.toast("l'ivitation a été supprimée", 3000, 'green')
                    }
                }
            })
    }
});

Template.clearInvitationProject.onCreated(function () {
    //add your statement here
});

Template.clearInvitationProject.onRendered(function () {
    //add your statement here
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 50});
});

Template.clearInvitationProject.onDestroyed(function () {
    //add your statement here
});

