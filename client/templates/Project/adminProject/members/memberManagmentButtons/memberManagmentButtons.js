Template.memberManagmentButtons.helpers({
    //add you helpers here
});

Template.memberManagmentButtons.events({
    //actions du boutton "faire passer admin"
    'click [giveAdminRights]': function (event, instance) {
        //on recupere le membre concerné et le projet courant
        let memberId = instance.data.member.user_id;

        let project = instance.data.currentProject;
        //et on appele la mathode pour donner les droits d'administration
        project.callMethod('giveAdminRights', memberId, (err)=>{
            //si ca marche pas, on renvoie l'erreur par toast
            if (err) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                resetTooltips()
                Materialize.toast("l'utilisateur est désormais administrateur du projet", 6000, 'green')
            }
        })

    },
    //actions du bouton retirer (son) membre
    'click [kickMember]': function (event, instance) {
        //on recupere le membre concerné et le projet courant
        let memberId = instance.data.member.user_id;
        let project = instance.data.currentProject;
        //et on appele la mathode pour donner lretirer le membre
        project.callMethod('kickMember', memberId, (err)=>{
            //si ca marche pas, on renvoie l'erreur par toast
            if (err) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                resetTooltips()
                Materialize.toast("l'utilisateur à été retiré du projet", 6000, 'green')
            }
        })

    }
});

Template.memberManagmentButtons.onCreated(function () {

});

Template.memberManagmentButtons.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
});

Template.memberManagmentButtons.onDestroyed(function () {
    //add your statement here
});

