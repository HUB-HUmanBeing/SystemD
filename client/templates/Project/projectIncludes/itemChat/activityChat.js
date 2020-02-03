import cryptoTools from "../../../../lib/cryptoTools";
import Project from "../../../../../imports/classes/Project";
import ItemComment from "../../../../../imports/classes/ItemComment";
import projectController from "../../../../lib/controllers/projectController";
import preFormatMessage from "../../../../lib/preformatMessages";
import Activity from "../../../../../imports/classes/Activity";
import MapMarker from "../../../../../imports/classes/MapMarker";

Template.projectLayout.helpers({
});

Template.projectLayout.events({
    'submit [newItemCommentForm]': function () {
        event.preventDefault()
        let textContent = preFormatMessage($(".newItemCommentInput").val())
        let itemType,itemId
        if(FlowRouter.current().queryParams.side=="activityDetail"){
            itemType = "Activity"
            itemId = FlowRouter.current().queryParams.activityId
        }else if(FlowRouter.current().queryParams.side=="mapMarkerDetail"){
            itemType = "MapMarker"
            itemId = FlowRouter.current().queryParams.mapMarkerId
        }
        cryptoTools.sim_encrypt_data(textContent, Session.get("currentProjectSimKey"), (symEnc_text) => {
            let itemCommentParams = {
                symEnc_content : symEnc_text,
                itemType : itemType,
                itemId : itemId
            }
            console.log(itemCommentParams)
            let newItemComment = new ItemComment()
            newItemComment.callMethod(
                "newItemComment",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                itemCommentParams,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    }else{
                        console.log('Item comment created ! \n', newItemComment)
                    }
                }
            )
        })
    }
});

Template.projectLayout.onCreated(function () {
    Meteor.subscribe("itemComments", projectController.getAuthInfo(FlowRouter.current().params.projectId), FlowRouter.current().queryParams.activityId, (err) => {
        if(err){
            console.log(err)
        }
    })
});

Template.projectLayout.onRendered(function () {
});

Template.projectLayout.onDestroyed(function () {
});

