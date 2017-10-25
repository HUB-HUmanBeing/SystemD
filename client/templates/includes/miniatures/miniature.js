import User from '/imports/classes/User'
import Project from '/imports/classes/Project'

Template.miniature.helpers({
    //add you helpers here
    color: function () {
        let type = Template.instance().data.type;
        if (type === "project") {
            return "orange"
        } else if (type === "user") {
            return "green"
        }
    },
    imgUrl: function () {
        if (Template.instance().project.get() || Template.instance().user.get()) {
            let type = Template.instance().data.type;
            if (type === "project") {
                let url = Template.instance().project.get().publicInfo.imgUrl;
                //si c'est pas l'image par défault, on fais une requete de miniature vers l'api d'imgur
                if (url !== "/images/icon/project_icon.png") {
                    return Imgur.toThumbnail(url, Imgur.SMALL_THUMBNAIL)
                } else {
                    return url
                }
            } else if (type === "user") {
                let url = Template.instance().user.get().profile.imgUrl()
                //si c'est pas l'image par défault, on fais une requete de miniature vers l'api d'imgur
                if (url !== "/images/icon/user_icon.png") {
                    return Imgur.toThumbnail(url, Imgur.SMALL_THUMBNAIL)
                } else {
                    return url
                }
            }
        }
    },
    name: function () {
        if (Template.instance().project.get() || Template.instance().user.get()) {
            let type = Template.instance().data.type;
            if (type === "project") {
                return Template.instance().project.get().name
            } else if (type === "user") {
                return Template.instance().user.get().username
            }
        }
    },
    path: function () {
        if (Template.instance().project.get() || Template.instance().user.get()) {
            let type = Template.instance().data.type;
            if (type === "project") {
                return Router.path("projectMainPage", {_id: Template.instance().data._id})
            } else if (type === "user") {
                return Router.path("userMainPage", {_id: Template.instance().data._id})
            }
        }
    }
});

Template.miniature.events({
    //add your events here
});

Template.miniature.onCreated(function () {
    //add your statement here
    let type = Template.instance().data.type;
    let id = Template.instance().data._id
    this.project = new ReactiveVar("");
    this.user = new ReactiveVar("");

    if (type === "project") {
        this.autorun(function () {
            let handle = Meteor.subscribe('singleProject', id)
            if (handle.ready()) {
                Template.instance().project.set(Project.findOne({_id: id}))
            }
        })
    } else if (type === "user") {
        this.autorun(function () {
            let handle = Meteor.subscribe('userPublicInfo', id)
            if (handle.ready()) {
                Template.instance().user.set(User.findOne({_id: id}))
            }
        })
    }
});

Template.miniature.onRendered(function () {
    //add your statement here
});

Template.miniature.onDestroyed(function () {
    //add your statement here
});

