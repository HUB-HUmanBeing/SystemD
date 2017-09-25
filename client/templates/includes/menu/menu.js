Template.menu.helpers({
    //add you helpers here
    menuItems : [
        {
            id: "user",
            name : function () {
              return Meteor.user().username;
            },
            color:"green",
            image: "user_icon.png",
            subMenu:[

                {
                    id : "userSelfProfile",
                    name : "Mon profil",
                    path : "userSelfProfile",
                    icon: "person"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
                },
                {
                    id : "logout",
                    name : "Déconnexion",
                    path: "home",
                    icon: "exit_to_app"
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
                path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
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
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
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
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
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
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
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
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
                },
                {
                    id : "lorem",
                    name : "lorem",
                    path: "workInProgress"
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

