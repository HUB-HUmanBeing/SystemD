import User from '/imports/classes/User';

Template.userMainPage.helpers({
    //on recupere l'utilisateur courant
    user: function () {
        return Template.currentData();
    },
    isOwner: function () {
       return Template.currentData()._id === Meteor.userId()
    },
    //on met en forme les infos calculés sur l'utilisateur afin qu'elles soient bien présentées
    computedInfo: function () {
        let computedInfo = Template.instance().computedInfo.get();
        //participation a un projet
        if (isNaN(computedInfo.nbOfProjects) || computedInfo.nbOfProjects === 0) {
            computedInfo.projectField = "Ne participe à aucun projet"
        } else if (computedInfo.nbOfProjects === 1) {
            computedInfo.projectField = "Participe à 1 projet"
        } else {
            computedInfo.projectField = "Participe à " + computedInfo.nbOfProjects + " projets"
        }
        //distance relative
        if (!computedInfo.distance && computedInfo.distance !== 0) {
            computedInfo.distance = "position non renseignée"
        } else if (computedInfo.distance <= 1) {
            computedInfo.distance = "à moins de 2 kilometres"
        } else {
            computedInfo.distance = computedInfo.distance + " kilometres"
        }
        return computedInfo
    }

});

Template.userMainPage.events({
    //add your events here
});

Template.userMainPage.onCreated(function () {
    //on donne des valeurs par défault avant de lancer la methode
    this.computedInfo = new ReactiveVar({
        distance : 0,
        nbOfProjects : 0}
    );
    if(Meteor.userId()){
        //on recupere l'utilisateur courant'
        let user = User.findOne(Template.currentData()._id);
        //puis on appele la methode renvoyant les info
        user.callMethod('computedInfo', (error, result) => {
            //et on remplit la reactive var
            this.computedInfo.set(result)
        })
    }
});

Template.userMainPage.onRendered(function () {
    //add your statement here
    Textarea.unformatBySelector("#description .formattedText")
});

Template.userMainPage.onDestroyed(function () {
    //add your statement here
});

