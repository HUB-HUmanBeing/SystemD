Template.resourcesProject.helpers({
    //pour renvoyer vers l'enfant les infos du projet courant
    project : function(){
        return Template.instance().data.fetch()[0]
    },
    //permet de savoir quelle page doit etre affichée, afin d'eviter d'avoir a charger tout le html des 3 tabs
    currentTab : function () {
        return Template.instance().currentTab.get()
    },
});

Template.resourcesProject.events({
    //add your events here
    'click [switchTab]' : function (event, instance) {
        //on recupere le href de la tab cliquée
        let clickedTabHref = event.currentTarget.href
        //on extrait la page demandée (tout les caractères apres le #
        let currentTab = clickedTabHref.substr(clickedTabHref.indexOf("#") + 1)
        //et on passe le résultat dans la réactive var
        instance.currentTab.set(currentTab)


    }
});

Template.resourcesProject.onCreated(function () {
    //add your statement here
    this.currentTab = new ReactiveVar("shared")
});

Template.resourcesProject.onRendered(function () {
    //add your statement here
    $('.swipable').tabs(
        // { 'swipeable': true }
    );
});

Template.resourcesProject.onDestroyed(function () {
    //add your statement here
});

