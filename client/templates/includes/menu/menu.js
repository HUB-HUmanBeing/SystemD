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
            subMenuItems:[
                {
                    id : "logout",
                    name : "déconnexion",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
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
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
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
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
            ]
        },
        {
            id: "projects",
            name :"Mes Projets",
            color:"red darken-4",
            image: "project_icon.png",
            subMenu:[
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
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
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
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
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
                {
                    id : "lorem ipsum",
                    name : "lorem ipsum",
                },
            ]
        },
    ]


});

Template.menu.events({
    //add your events here
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

