// Client entry point, imports all client code
Session.set('userAvatars', {})

// test of translation


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
console.log(getLang());
