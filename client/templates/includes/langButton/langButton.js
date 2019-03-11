import i18n from 'meteor/universe:i18n';
import moment from "../../../lib/i18nMoment";
import User from "../../../../imports/classes/User";

Template.langButton.helpers({
    // tableau different lang
    languages: function () {
        // we store the language in variable
        let actualLang = localStorage.getItem('lang');
        // we define the selected language(actualLang) in the language button
        return [
            {
                name: "Français",
                langFormat: 'fr-FR',
                langIso639: 'FR',
                selected: actualLang === 'fr-FR'
            },
            {
                name: "English",
                langFormat: 'en-US',
                langIso639: 'EN',
                selected: actualLang === 'en-US'
            }
        ]
    }

});

Template.langButton.events({
    'click [changeLanguage]':function (event, instance) {
      console.log("ok")
    },
    //when we change the language button
    'change [changeLanguage]': function (event, instance) {
        // we store the value of new language, for example: fr-FR, in localStorage
        let newLang = event.target.value
        localStorage.setItem('lang', newLang);
        moment.locale(newLang)
        // and we set the new language in i18n retrieving the value in localStorage(newLang)
        i18n.setLocale(newLang);

    },


});

Template.langButton.onCreated(() => {
    // add your statement here

});

Template.langButton.onRendered(() => {
    // add your statement here


    $('#langButton').material_select();

});

Template.langButton.onDestroyed(() => {
    // add your statement here
  //  $('#langButton').material_select('destroy');
});
