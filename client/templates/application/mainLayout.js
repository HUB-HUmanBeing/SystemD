Template.mainLayout.helpers({
    //add you helpers here
});

Template.mainLayout.events({
    //add your events here
});

Template.mainLayout.onCreated(function () {
    //add your statement here
    let  isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    if(!isChrome){
       this.timeout =  Meteor.setTimeout(()=>{
           Materialize.toast(__('general.changNavigator'), 10000, 'infoNavigator')
       },7000)

    }
});

Template.mainLayout.onRendered(function () {
    //add your statement here
});

Template.mainLayout.onDestroyed(function () {
    //add your statement here
    Meteor.clearTimeout(this.timeout)
});

