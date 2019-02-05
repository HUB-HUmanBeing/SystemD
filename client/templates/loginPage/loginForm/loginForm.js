Template.loginForm.helpers({
    //add you helpers here
});

Template.loginForm.events({
    //add your events here
    'click [next] , touch [next]' : function (event, instance) {
        $('.carousel').carousel('next');
    }
});

Template.loginForm.onCreated(function () {
    //add your statement here
});

Template.loginForm.onRendered(function () {
    $('ul.tabs').tabs();
    window.setTimeout(()=>{
        Materialize.updateTextFields();
    },1500)
    $('.carousel.carousel-slider').carousel({fullWidth: true});
});

Template.loginForm.onDestroyed(function () {
    //add your statement here
});

