// Client entry point, imports all client code
Session.set('userAvatars', {})

// test of translation
import i18n from 'meteor/universe:i18n';

// somewhere in the page layout (or possibly in the router?)
function getLang () {
    return (
        navigator.languages && navigator.languages[0] ||
        navigator.language ||
        navigator.browserLanguage ||
        navigator.userLanguage ||
        'fr-FR'
    );
}

i18n.setLocale(getLang()).then(() => {
    console.log(i18n.getLocale());
}).catch((err) => {
    console.log(err);
});


// Set namespace of templates

if (i18n.getLocale() === 'fr-FR'){
    console.log('lang ok');
    Template.landingHead.bindI18nNamespace('landingHeadFr');

}else{
    console.log('encore US');
    Template.landingHead.bindI18nNamespace('landingHeadEn');

    
}