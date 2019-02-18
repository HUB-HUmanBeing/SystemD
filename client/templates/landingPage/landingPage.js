Template.landingPage.helpers({


});

Template.landingPage.events({
    // add your events here

});

Template.landingPage.onCreated(() => {
    // add your statement here

});

Template.landingPage.onRendered(() => {
    // add your statement here
});

Template.landingPage.onDestroyed(() => {
    // add your statement here
});

// test of translation
import i18n from 'meteor/universe:i18n';

console.log(i18n.__('test', {name: "ma gueule!"}));