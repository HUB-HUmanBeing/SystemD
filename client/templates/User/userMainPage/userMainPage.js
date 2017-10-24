import User from '/imports/classes/User';
Template.userMainPage.helpers({
    //add you helpers here
    user : function () {
        return Template.instance().data.fetch()[0]
    },
    computedInfo : function () {
        let computedInfo = Template.instance().computedInfo.get()
        if (computedInfo.nbOfProjects === 0){
            computedInfo.projectField = "Ne participe à aucun projet"
        }else if(computedInfo.nbOfProjects === 1){
            computedInfo.projectField = "Participe à 1 projet"
        }else{
            computedInfo.projectField = "Participe à " + computedInfo.nbOfProjects+ " projets"
        }
        if(computedInfo.distance <= 1){
            computedInfo.distanceField = "à moins de 2 kilometres"
        }else{
            computedInfo.distanceField = computedInfo.distance +" kilometres"
        }
        return computedInfo

    }

});

Template.userMainPage.events({
    //add your events here
});

Template.userMainPage.onCreated(function () {
    //add your statement here
    this.computedInfo = new ReactiveVar()
    user = User.findOne(Template.instance().data.fetch()[0]._id)
    user.callMethod('computedInfo',  (error, result) => {
        this.computedInfo.set(result)
    })
});

Template.userMainPage.onRendered(function () {
    //add your statement here
});

Template.userMainPage.onDestroyed(function () {
    //add your statement here
});

