Template.landingAim.helpers({
    //add you helpers here
});

Template.landingAim.events({
    //add your events here
});

Template.landingAim.onCreated(function () {
    //add your statement here
});

Template.landingAim.onRendered(function () {
    $('.collapsible').collapsible();
    let options = [
        {selector: '.collapsible li', offset: 200, callback: (el)=> {
                $('.collapsible li').css('opacity', 1)
            } },
        {selector: '.card-content p', offset: 100, callback: function() {
                $('.card-content p').css('opacity', 1)
            } },
    ];
    Materialize.scrollFire(options);
});

Template.landingAim.onDestroyed(function () {
    //add your statement here
});

