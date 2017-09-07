Template.header.helpers({
});

//permet l'animation du header
var myElement = document.querySelector(".general-header");
var headroom = new Headroom(myElement);
headroom.init();