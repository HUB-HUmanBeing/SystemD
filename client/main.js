// Client entry point, imports all client code
import {Meteor} from "meteor/meteor";
import i18n from 'meteor/universe:i18n';

Session.set('userAvatars', {})
Session.set('projectAvatars', {})

// we stock language browser
if (localStorage.getItem('lang')==false){
localStorage.setItem('lang', getLang());
};

// we get language browser
let myLang = localStorage.getItem('lang');
console.log("myLang ", myLang);

// we set language from localStorage
i18n.setLocale(myLang);

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
