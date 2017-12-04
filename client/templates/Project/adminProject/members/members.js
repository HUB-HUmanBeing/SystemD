import CollaboratorAdverts from "../../../../../lib/collections/CollaboratorAdverts";

Template.members.helpers({

    //booléen , renvoie true si l'utilisaateur est admin du projet
    isAdmin : function () {
      return Template.currentData().isAdmin(Meteor.userId())
    },
    //renvoie le projet courant
    currentProject : function () {
      let currentProject = Template.currentData()
        currentProject.project_id = currentProject._id
        return currentProject
    },
    //add you helpers here
    //renvoie les admins du projet
    projectAdmins: function () {
        //on récupere les projets de l'utilisateur

      let members = Template.currentData().members

        let projectAdmins = [];
        //on parcours les membres du projet
        members.forEach(function (member) {
            //et on choisi ceux ou le membre est admin
            if (member.roles.includes("admin")) {
                projectAdmins.push(member)
            }
        });
        return projectAdmins
    },
    //renvoie les simples membres du projet
    projectMembers: function () {
        //on récupere les membres du projet
      let members = Template.currentData().members
        let projectMembers = [];
        //on parcours les membres du projet
        members.forEach(function (member) {
            //et on choisit ceux ou l'utilisateur n'est pas admin
            if (!member.roles.includes("admin")) {
                projectMembers.push(member)
            }
        });
        return projectMembers
    },
    //renvoie les invitations en attente
    waitingInvitations: function () {
        //on récupere les invitations du projet
      let invitations = Template.currentData().invitations
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
        //on récupere les invitations du projet
      let invitations = Template.currentData().invitations
        let declinedInvitations = [];
        //on parcours ses invitations
        invitations.forEach((invitation) => {
            //et on les insere dans le tableau réponse si elles valident la condition(en bidouillant la date)
            if (invitation.status === "declined") {
                declinedInvitations.push(invitation)
            }
        });
        //on active l'accordéon avec un peu de latence pour etre sur qu'ils soient dans le dom
        Meteor.setTimeout(function () {
            $('.collapsible').collapsible()
        }, 100);
        return declinedInvitations.length !== 0 ? declinedInvitations : false
    },
    // liste des invitations accéptées par les utilisateurs
    acceptedInvitations: function () {
      let invitations = Template.currentData().invitations
        let acceptedInvitations = []
        //on parcours les invitations du projet
        invitations.forEach((invitation) => {
            //et on les insere dans le tableau réponse si elles valident la condition
            if (invitation.status === "accepted") {
                acceptedInvitations.push(invitation)
            }
        })
        //on active l'accordéon avec un peu de latence pour etre sur qu'ils soient dans le dom
        Meteor.setTimeout(function () {
            $('.collapsible').collapsible()
        }, 100)
        return acceptedInvitations.length !== 0 ? acceptedInvitations : false
    },
    collaboratorAdverts : function () {
        return CollaboratorAdverts.find({project_id: Template.currentData()._id}, {sort : {createdAt : -1}}).fetch()
    }
});

Template.members.events({
    //add your events here
});

Template.members.onCreated(function () {
    //add your statement here
    Meteor.subscribe('advertsByProject', this.data._id)
});

Template.members.onRendered(function () {
    //add your statement here
});

Template.members.onDestroyed(function () {
    //add your statement here
});

