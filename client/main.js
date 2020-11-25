// Client entry point, imports all client code
import {Meteor} from "meteor/meteor";
import i18n from 'meteor/universe:i18n';
import getLang from "./lib/getLang";
import moment from "./lib/i18nMoment";
import firebase from "firebase/app";
import "firebase/messaging";

Session.set('userAvatars', {})
Session.set('projectAvatars', {})

let lang = getLang()
let storedLang = window.localStorage.getItem('lang')
// we stock language browser
if (storedLang) {
    i18n.setLocale(storedLang);
    moment.locale(storedLang)
} else {
    i18n.setLocale(lang);
    moment.locale(lang)
    window.localStorage.setItem('lang', lang);
}
// we set language from localStorage


//on recupere la liste de tout les templates de la plate-forme
let TemplatesNames = [];
for (name of Object.keys(Template)) {
    if (Template[name] instanceof Template) TemplatesNames.push(name);
}
//on bind les namespaces i18n de maniere automatique
TemplatesNames.forEach(name => {
    if (name.indexOf('_') == -1) {
        Template[name].bindI18nNamespace(name);
    }
})

// if(Meteor.isDevelopment && !isHTTPS()){
//  console.log("switchHttps")
//     switchHTTPS('3003');
// }
if (!document.getElementById('manifest')) {
    var link = document.createElement('link');
    link.id = 'manifest';
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
}
$(document).ready(() => {
    $('#inject-loader-wrapper').css("display", "none")
})

if (!Meteor.isCordova) {
    var firebaseConfig = {
        apiKey: "AIzaSyAJac4fZ9-AeF11GIXlV5sababxv6R6u1o",
        authDomain: "system-d-9e42a.firebaseapp.com",
        databaseURL: "https://system-d-9e42a.firebaseio.com",
        projectId: "system-d-9e42a",
        storageBucket: "system-d-9e42a.appspot.com",
        messagingSenderId: "785822409291",
        appId: "1:785822409291:web:fff86741f25864af2ea3ce"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    let messaging = firebase.messaging()
    messaging.onMessage((payload) => {
        console.log(payload)
    });

} else {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        cordova.plugins.firebase.messaging.createChannel({
            id: "systemdorg",
            name: "System-D.org",
            importance: 3,
            badge: true,
            sound: "notifsound",
            vibration: [100, 100, 200, 100, 300],
            light: false,
        });
         cordova.plugins.firebase.messaging.clearNotifications(function () {
        });
        cordova.plugins.firebase.messaging.onBackgroundMessage(function(payload) {
            console.log("New background FCM message: ");
            console.log(JSON.parse(payload));
        });
    }

}
