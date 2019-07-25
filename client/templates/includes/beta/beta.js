Template.beta.helpers({
    //add you helpers here
});

Template.beta.events({
    //add your events here
});

Template.beta.onCreated(function () {
    //add your statement here
});

Template.beta.onRendered(function () {
    //add your statement here
    $('#modalbeta').modal({
        startingTop: '10%', // Starting top style attribute
        endingTop: '10%',
    })
    resetTooltips()
});

Template.beta.onDestroyed(function () {
    //add your statement here
});

