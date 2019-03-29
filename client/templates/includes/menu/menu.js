import hubCrypto from "/client/lib/hubCrypto";
//https://www.npmjs.com/package/beautify-scrollbar
import BeautifyScrollbar from 'beautify-scrollbar';
import pushController from "../../../lib/controllers/pushController";
import ProjectNotification from "../../../../imports/classes/ProjectNotification";

Template.menu.helpers({
    //tableau de tout ce qu'il y a dans le menu, permettant de pas trop repeter de html en bouclant dessus
    showProjects: function () {
        return !!Session.get("projects") && !!Session.get("projects").length
    },
    showInfo: function () {
        return Template.instance().showInfo.get()
    }
});

Template.menu.events({
    //gestion du bouton logout
    'click [logout]': function () {


        Accounts.logout(() => {
            Meteor.setTimeout(() => {
                hubCrypto.destroyCryptoSession(() => {
                    Object.keys(Session.keys).forEach(function (key) {
                        Session.set(key, undefined);
                    })
                    Session.keys = {}
                    window.location.reload()
                }, 50)

            }, );
        })


    },

});

Template.menu.onCreated(function () {
    this.showInfo = new ReactiveVar()
    this.autorun(() => {
        let totalNotifCount = ProjectNotification.find().count()
        let title = "System-D"
        if (totalNotifCount) {
            title += ' (' + totalNotifCount + ')'

        }
        document.title = title

    })
});

Template.menu.onRendered(function () {
    //initialisation des accordéons
    Meteor.setTimeout(() => {
        $("#userOptionsBtn").dropdown({
            belowOrigin: true
        });
    }, 1000)
    Meteor.setTimeout(() => {
        this.showInfo.set(true)
    }, 2500)

});

Template.menu.onDestroyed(function () {
    //add your statement here
});

