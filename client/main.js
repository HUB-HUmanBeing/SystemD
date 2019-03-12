// Client entry point, imports all client code
import {Meteor} from "meteor/meteor";
import i18n from 'meteor/universe:i18n';
import getLang from "./lib/getLang";
import moment from "./lib/i18nMoment";
import cryptoTools from "./lib/cryptoTools";

Session.set('userAvatars', {})
Session.set('projectAvatars', {})

let lang =getLang()
let storedLang = window.localStorage.getItem('lang')
// we stock language browser
if (storedLang) {
    i18n.setLocale(storedLang);
    moment.locale(storedLang)
}else{
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
