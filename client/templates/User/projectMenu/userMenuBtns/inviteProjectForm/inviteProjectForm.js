import Project from '/imports/classes/Project'

Template.inviteProjectForm.helpers({
    //on verifie que l'utilisateur peut etre invité
    isInvitable : function () {
        let userId = Template.instance().data.userId;
        let project = Project.findOne({_id : iTemplate.instance().data.project.project_id});
        return project.isInvitableUser(userId)
    }
});

Template.inviteProjectForm.events({
    //à la soumission du formulaire d'invitation
    "submit form" : function (event,instance) {
        event.preventDefault();
        //on récupere le message d'invitation
        let invitationMessage = $('#invitationMessage').val();
        let userId = instance.data.userId;
        //on recupere le projet courant
        let project = Project.findOne({_id : instance.data.project.project_id});
        //on appele la methode d'invitation
        project.callMethod('inviteUser', userId, invitationMessage, (error) => {
                if (error) {
                    Materialize.toast(error, 6000, 'red')
                } else {
                    //si c'est bon, on ferme la modale
                    $('.invite-to-projects-modal').modal('close');
                    //puis on "toast" un feedback à l'utilisateur
                    Materialize.toast(
                        instance.data.username +
                        " a reçu votre invitation à rejoindre le projet " +
                        instance.data.project.name
                        , 6000, 'green')
                }
            }
        )
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

