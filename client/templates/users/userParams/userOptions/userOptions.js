import User from "../../../../../imports/classes/User";
import i18n from "meteor/universe:i18n";
import moment from "../../../../lib/i18nMoment";

Template.userOptions.helpers({
    //add you helpers here
    languages: function () {
        return [
            {
                name: "Français",
                langFormat: 'fr-FR',
                langIso639: 'FR',
                selected: i18n.getLocale()==='fr-FR'
            },
            {
                name: "English",
                langFormat: 'en-US',
                langIso639: 'EN',
                selected: i18n.getLocale()==='en-US'
            }
        ]
    }
});

Template.userOptions.events({
    //add your events here
    "change [selectLanguage]": function (event, instance) {
        let user= User.findOne(Meteor.userId())
        let language= event.target.value
        user.callMethod("changeLang", language, (err,res)=>{
            if(err){
                console.log(err)
            }else{
                i18n.setLocale(language)
                localStorage.setItem('lang', language);
                moment.locale(language)
            }
        })
    }
});

Template.userOptions.onCreated(function () {
    //add your statement here
});

Template.userOptions.onRendered(function () {
    //add your statement here
    $('#selectLanguage').material_select();
});

Template.userOptions.onDestroyed(function () {
    //add your statement here
    $('#selectLanguage').material_select('destroy');
});

