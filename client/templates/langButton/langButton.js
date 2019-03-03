import i18n from 'meteor/universe:i18n';

Template.langButton.helpers({
    

});

Template.langButton.events({
    // add your events here

    // when we change the language button 
    'change select':(function(event) {
        // we store the value of new language, for example: fr-FR, in localStorage
        localStorage.setItem('lang', $("select option:selected").val());
        // and we set the new language in i18n retrieving the value in localStorage(newLang)
        let newLang = localStorage.getItem('lang');
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
