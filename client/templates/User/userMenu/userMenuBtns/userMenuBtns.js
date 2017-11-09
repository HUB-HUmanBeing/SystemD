Template.userMenuBtns.helpers({
    //renvoie la liste des projets ou l'utilisateur courant est admin
    adminProjects: function () {
        //on recupere tout les projets de l'utilisateur
      const currentUserProjects = Meteor.user().profile.projects
        let adminProjects = []
        //pour chacuns, on check si l'utilisateur est admin
        currentUserProjects.forEach(project => {
            if(project.roles.includes("admin")){
                //et on ajoute au tableau repose a envoyer
                adminProjects.push(project)
            }
        })
        return adminProjects
    }
});

Template.userMenuBtns.events({
    //au click sur le bouton d'invitation
  'click [inviteToProjects]': function () {
        $('.modal').modal();
        //on ouvre la fenetre modale puis on active le menu accordéon
        $('.invite-to-projects-modal').modal('open');
        Meteor.setTimeout(function () {
            $('.collapsible').collapsible();
        }, 150)
    },
    "click [projectName] a" : function (event) {
        event.preventDefault()
    }
});

Template.userMenuBtns.onCreated(function () {
    //add your statement here
});

Template.userMenuBtns.onRendered(function () {
    //on active les infobulles
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
});

Template.userMenuBtns.onDestroyed(function () {
    //add your statement here
});

