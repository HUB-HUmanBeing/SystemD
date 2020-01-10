Template.mainLayout.helpers({
    //add you helpers here
});

Template.mainLayout.events({
    //add your events here
});

Template.mainLayout.onCreated(function () {
    //add your statement here
    let  isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if(isSafari){
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
});

