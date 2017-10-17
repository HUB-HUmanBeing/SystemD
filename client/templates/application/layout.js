Template.layout.helpers({
    //add you helpers here
    contextualData : function () {
        let currentRouteArray = document.location.href.split("/");
        let contextualData = {}
        arborescenceStructure().forEach(function (item) {
            if (currentRouteArray[3] === item.id) {
                contextualData = item
            }
        })
        if (contextualData.id = "project") {
            Meteor.call('projectToolbarData', currentRouteArray[4], function (error, result) {
                if (!error) {
                    dump(result)

                    return result
                }
            })
        } else {
            return {}
        }
    }
});

Template.layout.events({
    //add your events here
});

Template.layout.onCreated(function () {
    //add your statement here
});

Template.layout.onRendered(function () {
    //add your statement here
});

Template.layout.onDestroyed(function () {
    //add your statement here
});

