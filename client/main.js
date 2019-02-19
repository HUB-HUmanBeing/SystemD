// Client entry point, imports all client code
import {Meteor} from "meteor/meteor";

Session.set('userAvatars', {})

// test of translation
import i18n from 'meteor/universe:i18n';
Meteor.startup(() => {
// somewhere in the page layout (or possibly in the router?)
    function getLang() {
        let locale = (
            navigator.languages && navigator.languages[0] ||
            navigator.language ||
            navigator.browserLanguage ||
            navigator.userLanguage ||
            'fr-FR'
        );
        let aviableLanguages = ['fr-FR', 'en-US']
        let localeResult = 'en-US'
        aviableLanguages.forEach(lang=>{
            if(locale.split("-")[0] == lang.split("-")[0]){
                localeResult = lang
            }
        })
        return localeResult
    }

    i18n.setLocale(getLang()).then(() => {
        console.log("i18n.isLoaded('fr')", i18n.isLoaded('fr-FR'));
        console.log("i18n.isLoaded('en')", i18n.isLoaded('en-US'));
    }).catch((err) => {
        console.log(err);
    });


// Set namespace of templates
    Template.landingHead.bindI18nNamespace('landingHead');
})
