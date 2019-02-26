// Client entry point, imports all client code
import {Meteor} from "meteor/meteor";

Session.set('userAvatars', {})
Session.set('projectAvatars', {})
// test of translation
import i18n from 'meteor/universe:i18n';
import getLang from "./lib/getLang";


//on set le language
i18n.setLocale(getLang())
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

