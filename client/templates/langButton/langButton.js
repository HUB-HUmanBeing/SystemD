import i18n from 'meteor/universe:i18n';
// import {getLang} from '../../main';

Template.langButton.helpers({
    

});

Template.langButton.events({
    // add your events here
    'change select':(function(event) {
        console.log('thats changed', $("select option:selected").val()),
        i18n.setLocale($("select option:selected").val()),
        console.log("getLocale: ", i18n.getLocale());
      })
});

Template.langButton.onCreated(() => {
    // add your statement here
    
});

Template.langButton.onRendered(() => {
    // add your statement here
    let actualLang = i18n.getLocale().split('-')[0];
    $("select [value=" + actualLang + "]").prop("selected", true)
    
    console.log(i18n.getLocale());
    
});

Template.langButton.onDestroyed(() => {
    // add your statement here
});
