import i18n from 'meteor/universe:i18n';

Template.langButton.helpers({
    // tableau different lang
    languages: function () {
        return [
            {
                name: "Français",
                langFormat: 'fr-FR',
                langIso639: 'FR'
            },
            {
                name: "English",
                langFormat: 'en-US',
                langIso639: 'EN'
            },
            {
                name: "Espanol",
                langFormat: 'es-ES',
                langIso639: 'ES'
            }
        ]
    }

});

Template.langButton.events({
    // add your events here

    // when we change the language button 
    'change [changeLanguage]':(function(event) {
        // we store the value of new language, for example: fr-FR, in localStorage
        let newLang = event.target.value
        localStorage.setItem('lang', newLang);
        // and we set the new language in i18n retrieving the value in localStorage(newLang)
        localStorage.getItem('lang', newLang);
        i18n.setLocale(newLang);
        
      })

});

Template.langButton.onCreated(() => {
    // add your statement here
    
});

Template.langButton.onRendered(() => {
    // add your statement here

    // we store the language in variable
    let actualLang = localStorage.getItem('lang');
    // we define the selected language(actualLang) in the language button
    $("select [value=" + actualLang + "]").prop("selected", true);

});

Template.langButton.onDestroyed(() => {
    // add your statement here
});
