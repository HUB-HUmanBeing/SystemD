import User from '/imports/classes/Project';

Template.projectMenu.helpers({
    //add you helpers here
    title: function () {
        return Template.instance().data.project.name
    },
    contextualHomepage : function () {
        return 'projectMainPage'
    },
    color: function () {
        return 'orange'
    },
    imgUrl: function () {
        let url = Template.instance().data.project.publicInfo.imgUrl;
        if (url !== "/images/icon/project_icon.png") {
            return Imgur.toThumbnail(url, Imgur.SMALL_THUMBNAIL)
        } else {
            return url
        }
    },
    icon: function () {
        icon = "";
        tooltip = "";
        Meteor.user().profile.projects.forEach(function (userProject) {
            if (userProject.project_id) {
                if (_.contains(userProject.roles, "admin")) {
                    icon = 'verified_user';
                    Template.instance().tooltip.set("vous etes administrateur de ce projet");

                } else if (_.contains(userProject.roles, "member")) {
                    icon = 'perm_identity';
                    Template.instance().tooltip.set("vous etes membre de ce projet");
                }
            }
        });
        return icon
    },
    tooltip: function () {
        return Template.instance().tooltip.get()
    },
    path: function () {
        return Router.path("projectMainPage", {_id: Template.instance().data.project._id})
    },
    navBarItems: function () {
        let projectId = Template.instance().data.project._id
        let navBarItems = [
            {
                title: "Admin",
                color : "orange",
                routeName : "adminProject",
                path: function () {
                    return Router.path("adminProject", {_id: projectId})
                }
            },
            {
                title: "Membres",
                color: "orange",
                routeName : 'membersProject',
                path: function () {
                    return Router.path('membersProject', {_id: projectId})
                }
            }

        ]
        return navBarItems
    }


});

Template.projectMenu.events({
    //add your events here

});

Template.projectMenu.onCreated(function () {
    this.tooltip = new ReactiveVar()

});

Template.projectMenu.onRendered(function () {
    //add your statement here
});

Template.projectMenu.onDestroyed(function () {
    //add your statement here
});



