//fonction de récuperation de la locale à utiliser pour i18n
 const getLang = function() {
    let locale = (
        navigator.languages && navigator.languages[0] ||
        navigator.language ||
        navigator.browserLanguage ||
        navigator.userLanguage ||
        'fr-FR'
    );
    //nos traductions listées ici
    let aviableLanguages = ['fr-FR', 'en-US', 'es-ES','de-DE','it-IT']
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
export default getLang
