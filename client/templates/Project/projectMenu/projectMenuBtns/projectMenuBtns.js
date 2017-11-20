import User from '/imports/classes/User'

Template.projectMenuBtns.helpers({
    isFollowedAuthor : function () {
        return Meteor.user().profile.followedAuthors.includes(Template.currentData().projectId)
    }
});

Template.projectMenuBtns.events({
    'click [follow]' : function (event, instance) {
        //on récupère l'utilisateur courant
        resetTooltips()
        let user = User.findOne({_id: Meteor.userId})
        //et on applique la méthode
        user.callMethod('followAuthor', instance.data.projectId, (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("Vous êtes désormais abonné aux articles de cet auteur", 2000, 'green')
                $('#interactionBtn').click()
            }
        })
    },
    'click [unFollow]' : function (event, instance) {
        resetTooltips()
        //on récupère l'utilisateur courant
        let user = User.findOne({_id: Meteor.userId})
        //et on applique la méthode
        user.callMethod('unFollowAuthor', instance.data.projectId, (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("Vous n'êtes plus abonné aux articles de cet auteur", 2000, 'orange')
                $('#interactionBtn').click()
            }
        })
    }
});

Template.projectMenuBtns.onCreated(function () {
    //add your statement here
});

Template.projectMenuBtns.onRendered(function () {
    //add your statement here
});

Template.projectMenuBtns.onDestroyed(function () {
    //add your statement here
});

