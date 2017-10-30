Template.userSelfProjects.helpers({
    //renvoie les projets administrés par l'utilisateur
    adminProjects: function () {
        //on récupere les projets de l'utilisateur
        let projects = Meteor.user().profile.projects;
        let adminProjects = [];
        //on parcours les projets de l'utilisateur courant
        projects.forEach(function (project) {
            //et on choisi ceux ou l'utilisateur est admin
            if (project.roles.includes("admin")) {
                adminProjects.push(project)
            }
        });
        return adminProjects
    },
    //renvoie les projets ou l'utilisateur n'est pas membre
    memberProjects: function () {
        //on récupere les projets de l'utilisateur
        let projects = Meteor.user().profile.projects;
        let memberProjects = [];
        //on parcours les projets de l'utilisateur courant
        projects.forEach(function (project) {
            //et on choisit ceux ou l'utilisateur n'est pas admin
            if (!project.roles.includes("admin")) {
                memberProjects.push(project)
            }
        });
       return memberProjects
    },
    //renvoie les invitations en attente de l'utilisateur ou false
    waitingInvitations: function () {
        let invitations = Meteor.user().profile.invitations;
        let waitingInvitations = [];
        //on parcours ses invitations
        invitations.forEach((invitation) => {
            if (invitation.status === "waiting") {
                //et on les insere dans le tableau réponse si elles valident la condition
                waitingInvitations.push(invitation)
            }
        });
        return waitingInvitations.length !== 0 ? waitingInvitations : false

    },
    //renvoie les invitations déclinées par l'utilisateur
    declinedInvitations: function () {
        let invitations = Meteor.user().profile.invitations;
        let declinedInvitations = [];
        //on parcours ses invitations
        invitations.forEach((invitation) => {
            //et on les insere dans le tableau réponse si elles valident la condition
            if (invitation.status === "declined") {
                invitation.date = invitation.sentAt.toLocaleDateString();
                declinedInvitations.push(invitation)
            }
        });
        //on active l'accordéon avec un peu de latence pour etre sur qu'ils soient dans le dom
        Meteor.setTimeout(function () {
            $('.collapsible').collapsible()
        }, 100);
        return declinedInvitations.length !== 0 ? declinedInvitations : false
    }
});

Template.userSelfProjects.events({
    //add your events here
});

//a la création du template
Template.userSelfProjects.onCreated(function () {

});

Template.userSelfProjects.onRendered(function () {
    //add your statement here

});

Template.userSelfProjects.onDestroyed(function () {
    //add your statement here
});

