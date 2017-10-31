import Project from '/imports/classes/Project'

Template.clearInvitationProject.helpers({
    //add you helpers here
});

Template.clearInvitationProject.events({
    //methode de suppression d'une invitation
    'click [clearInvitation]': function (event, instance) {
        event.preventDefault();
        //on recupere l'invitation et le projet courant
        let invitation = instance.data.invitation;
        let currentProject = instance.data.project;
        //puis on appele la methode de déletion d'une invitation
        currentProject.callMethod(
            'deleteInvitation',
            invitation,
            (error, result) => {
                //et on renvoie un feed-back a l'utilisateur
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

