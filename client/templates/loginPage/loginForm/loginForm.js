Template.loginForm.helpers({
    //add you helpers here
});

Template.loginForm.events({
    //add your events here
});

Template.loginForm.onCreated(function () {
    //add your statement here
});

Template.loginForm.onRendered(function () {
    $('ul.tabs').tabs();
    window.setTimeout(()=>{
        Materialize.updateTextFields();
    },1500)

});

Template.loginForm.onDestroyed(function () {
    //add your statement here
});

