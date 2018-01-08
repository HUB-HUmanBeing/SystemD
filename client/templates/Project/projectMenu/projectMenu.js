/********************************
 * ensemble des helpers permettant de renvoyer des
 * valeurs particulières au menu contextuel
 */
Template.projectMenu.helpers({
    //titre affiché
    title: function () {
        return Template.currentData().project.name
    },
    //nom de la page pour pouvoir utiliser le "is active path"
    contextualHomepage: function () {
        return 'projectMainPage'
    },
    //couleur du sous menu
    color: function () {
        return 'orange'
    },
    //image a faire afficher
    imgUrl: function () {
      let url = Template.currentData().project.publicInfo.imgUrl
        //si c'est pas l'image par défault, on fais une requete de miniature vers l'api d'imgur
        if (url !== "/images/icon/project_icon.png") {
            return Imgur.toThumbnail(url, Imgur.SMALL_THUMBNAIL)
        } else {
            return url
        }
    },
    //icone a afficher apres le nom de projet, indiquant le role de l'utilisateur
    icon: function () {
      let project = Template.currentData()
        let icon = "";
      const currentUser = Meteor.user()
        if (currentUser) {
            //on boucle sur les projets de l'utilisateur courant
            currentUser.profile.projects.forEach(function (userProject) {
                //si il est dedans

                if (userProject.project_id === project.project._id) {

                    //et que le tableau des roles coontiens admin
                    if (_.contains(userProject.roles, "admin")) {
                        //on choisi l'icone correspondante et on passe l'info a une réactive var
                        icon = 'verified_user';
                        Template.instance().tooltip.set("vous etes administrateur de ce projet");
                        //si il est membre
                    } else if (_.contains(userProject.roles, "member")) {
                        //on choisi l'icone correspondante et on passe l'info a une réactive var
                        icon = 'perm_identity';
                        Template.instance().tooltip.set("vous etes membre de ce projet");
                    }
                }
            });
        }
        return icon
    },
    //on viens renvoyer a la réactive var définie au dessus
    tooltip: function () {
        return Template.instance().tooltip.get()
    },
    //on transmet le path  vers lequel ça doir renvoyer
    path: function () {
      return Router.path('projectMainPage', {_id: Template.currentData().project._id})
    },
    //tableau des elements a renvoyer a la barre de navigation
    navBarItems: function () {

        let project = Template.currentData().project
        let navBarItems = [
            {
                title: "Gestion",
                color: "orange",
                routeName: "adminProject",
                path: function () {
                    return Router.path("adminProject", {_id: project._id})
                }
            },
            {
                title: "Organisation",
                color: "orange",
                routeName: 'orgProject',
                path: function () {
                    return Router.path('orgProject', {_id: project._id})
                }
            },
            {
                title: "Ressources",
                color: "orange",
                routeName: 'resourcesProject',
                path: function () {
                    return Router.path('resourcesProject', {_id: project._id})
                }
            },
            {
                title: "Messagerie",
                color: "orange",
                routeName: 'messagesProject',
                path: function () {
                    return Router.path('messagesProject', {_id: project._id})
                },
                notif: {
                    value : ()=>{
                        let counter = 0
                        project.conversations.forEach((conversation)=>{
                            counter += conversation.unreadMessage
                        })
                        return counter
                    },
                    text : "le projet a reçu de nouveaux messages"
                }
            }

        ];
        return navBarItems
    },
    //true si l'utilisateur est membre du projet
    isMember: function () {
        //on le crée a false
        let isMember = false;

      const currentUser = Meteor.user()
        if (currentUser) {
            //on parcoure les projets de l'utilisateur
            currentUser.profile.projects.forEach((project) => {
                //si le projet est dedans
                if (project.project_id === Template.currentData().project._id) {
                    //on la passe a true
                    isMember = true;
                }
            });
        }

        return isMember;
    }


});

Template.projectMenu.events({
    //add your events here

});

Template.projectMenu.onCreated(function () {
    this.tooltip = new ReactiveVar();


});

Template.projectMenu.onRendered(function () {
    //add your statement here
});

Template.projectMenu.onDestroyed(function () {
    //add your statement here
});



