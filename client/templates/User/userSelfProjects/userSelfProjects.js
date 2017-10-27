Template.userSelfProjects.helpers({
    //renvoie les projets administrés par l'utilisateur
    adminProjects: function () {
        return Template.instance().adminProjects.get()
    },
    //renvoie les projets ou l'utilisateur n'est pas membre
    memberProjects: function () {
        return Template.instance().memberProjects.get()
    },
    //renvoie les invitations en attente de l'utilisateur ou false
    waitingInvitations: function () {
        let invitations = Meteor.user().profile.invitations
        let waitingInvitations = []
        //on parcours ses invitations
        invitations.forEach((invitation) => {
            if (invitation.status === "waiting") {
                //et on les insere dans le tableau réponse si elles valident la condition
                waitingInvitations.push(invitation)
            }
        })
        return waitingInvitations.length !== 0 ? waitingInvitations : false

    },
    //renvoie les invitations déclinées par l'utilisateur
    declinedInvitations: function () {
        let invitations = Meteor.user().profile.invitations
        let declinedInvitations = []
        //on parcours ses invitations
        invitations.forEach((invitation) => {
            //et on les insere dans le tableau réponse si elles valident la condition
            if (invitation.status === "declined") {
                invitation.date = invitation.sendAt.toLocaleDateString()
                declinedInvitations.push(invitation)
            }
        })
        //on active l'accordéon avec un peu de latence pour etre sur qu'ils soient dans le dom
        Meteor.setTimeout(function () {
            $('.collapsible').collapsible()
        }, 100)
        return declinedInvitations.length !== 0 ? declinedInvitations : false
    }
});

Template.userSelfProjects.events({
    //add your events here
});

//a la création du template
Template.userSelfProjects.onCreated(function () {
    //séparations des projets entre projets où l'on
    // est administrateur et ceux ou l'on est simple membre

    //on récupere les projets de l'utilisateur
    let projects = Meteor.user().profile.projects
    let adminProjects = []
    let memberProjects = []
    //on parcours les projets de l'utilisateur courant
    projects.forEach(function (project) {
        //et on les trie
        if (project.roles.includes("admin")) {
            adminProjects.push(project)
        } else {
            memberProjects.push(project)
        }
    })
    //enfin, on les insere dans les réactive-var
    this.adminProjects = new ReactiveVar(adminProjects)
    this.memberProjects = new ReactiveVar(memberProjects)
});

Template.userSelfProjects.onRendered(function () {
    //add your statement here

});

Template.userSelfProjects.onDestroyed(function () {
    //add your statement here
});

