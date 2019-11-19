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
    //when we change the language button
    'change [changeLanguage]': function (event, instance) {
        // we store the value of new language, for example: fr-FR, in localStorage
        let newLang = event.target.value;
        let user= User.findOne(Meteor.userId());
        console.log(user)
        if(user){
            console.log('test2: '+user)
            user.callMethod("changeLang", newLang, (err,res)=>{
                if(err){console.log(err);}
            });
        }
        localStorage.setItem('lang', newLang);
        i18n.setLocale(newLang);
        moment.locale(newLang);
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
