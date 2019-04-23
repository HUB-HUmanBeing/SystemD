import memberPosition from "../../../../../lib/controllers/markers/memberPosition";
import projectController from "../../../../../lib/controllers/projectController";
import mapController from "../../../../../lib/controllers/mapController";
import MapMarker from "../../../../../../imports/classes/MapMarker";

Template.detailMemberPosition.helpers({
    //add you helpers here
    isEditable: function () {
    }
});

Template.detailMemberPosition.events({
    //add your events here
    'click [updtateUserPosition]': function (event, instance) {
        event.preventDefault()
        memberPosition.editUserPosition()
    },
    'click [deleteMarker]': function (event, instance) {
        event.preventDefault()
        let marker = instance.data.marker
        console.log(marker)
        marker.callMethod(
            "delete",
            projectController.getAuthInfo(marker.projectId),
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    mapController.removeMarker(instance.data.marker)
                    FlowRouter.go("/project/" + marker.projectId + "/maps")

                }
            })
    },
});

Template.detailMemberPosition.onCreated(function () {
    //add your statement here
});

Template.detailMemberPosition.onRendered(function () {
    //add your statement here
});

Template.detailMemberPosition.onDestroyed(function () {
    //add your statement here
});

