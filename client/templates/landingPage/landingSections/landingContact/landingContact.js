Template.landingContact.helpers({
    //add you helpers here
});

Template.landingContact.events({
    //add your events here
    "click [openLink]": function (event, instance) {
        if(Meteor.isCordova){
            let href= event.currentTarget.getAttribute("href")
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            //
            function onDeviceReady() {
                // external url
                window.open(encodeURI(href), '_system');

            }
        }


    },
});

Template.landingContact.onCreated(function () {
    //add your statement here
});

Template.landingContact.onRendered(function () {
    //add your statement here
});

Template.landingContact.onDestroyed(function () {
    //add your statement here
});

