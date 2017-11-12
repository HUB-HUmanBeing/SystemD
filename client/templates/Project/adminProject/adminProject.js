Template.adminProject.helpers({
    //pour renvoyer vers l'enfant les infos du projet courant
    project : function(){
        return Template.currentData();
    },
    //
    completed : function () {
        return Template.currentData().completed()

    },
    //permet de savoir quelle page doit etre affichée, afin d'eviter d'avoir a charger tout le html des 3 tabs
    currentTab : function () {
        return Template.instance().currentTab.get()
    },
    isAdmin : function () {
        return Template.instance().isAdmin.get()
    }

});

Template.adminProject.events({
    //add your events here
    'click [switchTab]' : function (event, instance) {
        //on recupere le href de la tab cliquée
        let clickedTabHref = event.currentTarget.href;
        //on extrait la page demandée (tout les caractères apres le #
        let currentTab = clickedTabHref.substr(clickedTabHref.indexOf("#") + 1);
 //et on passe le résultat dans la réactive var
        instance.currentTab.set(currentTab)
    }
});

Template.adminProject.onCreated(function () {
    //add your statement here
    this.currentTab = new ReactiveVar("edit");

    //réactive var ppour savoir si l'utilisateur courant est admin
    this.isAdmin = new ReactiveVar(false);
    //on parcours les projets de l'utilisateur courant
    Meteor.user().profile.projects.forEach((project)=>{
        //lorsqu'on est dans le bon projet et que l'utilisateur est admin
        if(Template.currentData()._id === project.project_id){
            if( project.roles.includes("admin")){
                //on change la réactive var
                Template.instance().currentTab.set("edit");
                Template.instance().isAdmin.set(true);
            }else {
                //sinon, on en profite pour mettre la page sur membres
                Template.instance().currentTab.set("members")
            }
        }

    })

});

Template.adminProject.onRendered(function () {
    //add your statement here
    $('.swipable').tabs(
      // { 'swipeable': true }
        );
});

Template.adminProject.onDestroyed(function () {
    //add your statement here
});

