import hubCrypto from "/client/lib/hubCrypto";
//https://www.npmjs.com/package/beautify-scrollbar
import BeautifyScrollbar from 'beautify-scrollbar';
import pushController from "../../../lib/controllers/pushController";
import ProjectNotification from "../../../../imports/classes/ProjectNotification";
import i18n from "meteor/universe:i18n";

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
    function changeFavicon(src) {
        let link = document.createElement('link'),
            oldLink = document.getElementById('dynamic-favicon');
        link.id = 'dynamic-favicon';
        link.rel = 'shortcut icon';
        link.href = src;
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
        document.head.appendChild(link);
    }
    this.showInfo = new ReactiveVar()
    this.autorun(() => {

        let totalNotifCount = ProjectNotification.find().count()
        let title = "System-D"
        if (totalNotifCount) {
            title += ' (' + totalNotifCount + ')'
            changeFavicon('/images/icon/systemd-notif.png');
        }else{
            changeFavicon('/favicon.ico');
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
    }, 1500)
    Meteor.setTimeout(() => {
        this.showInfo.set(true)
        $("#userOptionsBtn").dropdown({
            belowOrigin: true
        });
    }, 2500)


});

Template.menu.onDestroyed(function () {
    //add your statement here
});

