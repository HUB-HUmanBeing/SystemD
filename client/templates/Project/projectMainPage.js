Template.projectMainPage.helpers({
    //add you helpers here
    project: function () {
        return Template.currentData();
    },
    relativeDistance: function () {
        let distance = Template.instance().data.relativeDistance()
        return ( distance || distance ===0) ? "( " + distance + " km )" : "" ;


    },
    numberOfMembers: function () {
        let numberOfMembers = Template.instance().numberOfMembers.get();
        return (numberOfMembers >1)? numberOfMembers + " membres" : numberOfMembers + " membre"

    }
});

Template.projectMainPage.events({
    //add your events here
});

Template.projectMainPage.onCreated(function () {
    //add your statement here
    this.numberOfMembers = new ReactiveVar(1);
    let project = Template.currentData();
    project.callMethod('numberOfMembers', (err, result)=>{
        this.numberOfMembers.set(result)
    })
});

Template.projectMainPage.onRendered(function () {
    //add your statement here
    $(Template.instance().firstNode).css('opacity', '1');
});

Template.projectMainPage.onDestroyed(function () {
    //add your statement here
});

