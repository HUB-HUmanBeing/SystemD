Template.menu.helpers({
    //add you helpers here
    menuItems : [
        {
            id: "user",
            name : "Marc",
            // name : function () {
            //     return Meteor.user().username;
            // },
            color:"green",
            image: "user_icon.png",
            subMenu:[
                {
                    id : "logout",
                    name : "déconnexion",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
            ]
        },
        {
            id: "message",
            name : "Messagerie",
            color:"orange",
            image: "message_icon.png",
            subMenu:[
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
            ]
        },
        {
            id: "Agenda",
            name :"Agenda",
            color:"blue",
            image: "agenda_icon.png",
            subMenu:[
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
            ]
        },
        {
            id: "projects",
            name :"Mes Projets",
            color:"red",
            image: "project_icon.png",
            subMenu:[
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
            ]
        },
        {
            id: "sharing",
            name : "Partage",
            color:"purple",
            image: "sharing_icon.png",
            subMenu:[
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
            ]
        },
        {
            id: "moderation",
            name : "Modération",
            color:"yellow",
            image: "moderation_icon.png",
            subMenu:[
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
                {
                    id : "lorem",
                    name : "lorem",
                },
            ]
        }
    ]


});

Template.menu.events({
    //add your events here
    'click [logout]' : function () {
        Accounts.logout();
    }
});

Template.menu.onCreated(function () {
    //add your statement here
});

Template.menu.onRendered(function () {
    //add your statement here
    $('.collapsible').collapsible();
});

Template.menu.onDestroyed(function () {
    //add your statement here
});

