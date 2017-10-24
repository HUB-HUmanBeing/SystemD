import User from '/imports/classes/User';

/********************************
 * ensemble des helpers permettant de renvoyer des
 * valeurs particulières au menu contextuel
 */
Template.userMenu.helpers({
    //titre affiché
    userId : function () {
        return Template.instance().data.user._id
    },
    title: function () {

        return Template.instance().data.user.username
    },
    //nom de la page pour pouvoir utiliser le "is active path"
    contextualHomepage : function () {
        return 'userMainPage'
    },
    //couleur du sous menu
    color: function () {
        return 'green'
    },
    //image a faire afficher
    imgUrl: function () {
        let url = Template.instance().data.user.profile.imgUrl;
        //si c'est pas l'image par défault, on fais une requete de miniature vers l'api d'imgur
        if (url !== "/images/icon/user_icon.png") {
            return Imgur.toThumbnail(url, Imgur.SMALL_THUMBNAIL)
        } else {
            return url
        }
    },
    //on transmet le path  vers lequel ca doir renvoyer
    path: function () {
        return Router.path("userMainPage", {_id: Template.instance().data.user._id})
    },
    //tableau des elements a renvoyer a la barre de navigation
    navBarItems: function () {
        if(Template.instance().data.user._id === Meteor.userId()) {

            let navBarItems = [
                {
                    title: "Editer profil",
                    color: "green",
                    routeName: "userSelfProfile",
                    path: function () {
                        return Router.path("userSelfProfile")
                    }
                }

            ]
            return navBarItems
        }
    },
    showNavbar : function () {
        return Meteor.userId() === Template.instance().data.user._id
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



