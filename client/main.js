// Client entry point, imports all client code
import {Meteor} from "meteor/meteor";
import i18n from 'meteor/universe:i18n';

Session.set('userAvatars', {})
Session.set('projectAvatars', {})


//fonction de récuperation de la locale à utiliser pour i18n
function getLang() {
    let locale = (
        navigator.languages && navigator.languages[0] ||
        navigator.language ||
        navigator.browserLanguage ||
        navigator.userLanguage ||
        'fr-FR'
    );
    //nos traductions listées ici
    let aviableLanguages = ['fr-FR', 'en-US']
    //on initialise avec en-US
    let localeResult = 'en-US'
    //si les 2 premières lettres avant le tiret correspondrent a nos locales, on les prends, sinon ca reste en-US
    aviableLanguages.forEach(lang => {
        if (locale.split("-")[0] == lang.split("-")[0]) {
            localeResult = lang
        }
    })
    return localeResult
}

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

