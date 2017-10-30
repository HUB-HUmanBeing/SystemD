Template.projectMainPage.helpers({
    //add you helpers here
    project: function () {
        return Template.instance().data.fetch()[0]
    },
    relativeDistance: function () {
        let distance = Template.instance().data.fetch()[0].relativeDistance()
        return ( distance || distance ===0) ? "( " + distance + " km )" : "sef " ;

    },
    numberOfMembers: function () {
        let numberOfMembers = Template.instance().numberOfMembers.get()
        return (numberOfMembers >1)? numberOfMembers + " membres" : numberOfMembers + " membre"

    }
});

Template.projectMainPage.events({
    //add your events here
});

Template.projectMainPage.onCreated(function () {
    //add your statement here
    this.numberOfMembers = new ReactiveVar(1);
    let project = Template.instance().data.fetch()[0]
    project.callMethod('numberOfMembers', (err, result)=>{
        this.numberOfMembers.set(result)
    })
});

Template.projectMainPage.onRendered(function () {
    //add your statement here
});

Template.projectMainPage.onDestroyed(function () {
    //add your statement here
});

