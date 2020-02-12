import cryptoTools from "../../../../../lib/cryptoTools";
import ItemComment from "../../../../../../imports/classes/ItemComment";
import projectController from "../../../../../lib/controllers/projectController";
import preFormatMessage from "../../../../../lib/preformatMessages";

Template.activityChat.helpers({
    itemComments: function () {
        comments=ItemComment.find({},{sort: {createdAt: 1}}).fetch()
        comments.forEach( (comment,i) => {
            if(i!==0){
                previousComment=comments[i-1]
                if (comment.createdAt.toDateString() === previousComment.createdAt.toDateString()){
                    comment.hideTimeBanner = true;
                    if (comment.createdBy === previousComment.createdBy){
                        comment.hideUserInfo = true;
                    }
                }
            }
        })
        return comments
    },
    displayAvatar: function() {
        console.log(itemComment.createdBy)
        return true
    }
});

Template.activityChat.events({
    'submit [newItemCommentForm]': function (event, instance) {
        event.preventDefault()
        let textContent = preFormatMessage($(".newItemCommentInput").val())
        $(".newItemCommentInput").val("")
        let itemType,itemId
        if(FlowRouter.current().queryParams.side=="activityDetail"){
            itemType = "Activity"
            itemId = FlowRouter.current().queryParams.activityId
        }else if(FlowRouter.current().queryParams.side=="markerDetail"){
            itemType = "MapMarker"
            itemId = FlowRouter.current().queryParams.markerId
        }
        cryptoTools.sim_encrypt_data(textContent, Session.get("currentProjectSimKey"), (symEnc_text) => {
            let itemCommentParams = {
                symEnc_content : symEnc_text,
                itemType : itemType,
                itemId : itemId
            }
            let newItemComment = new ItemComment()
            newItemComment.callMethod(
                "newItemComment",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                itemCommentParams,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    }
                }
            )
        })
    }
});

Template.activityChat.onCreated(function () {
    this.decrypted = new ReactiveVar(false)
    this.lastCommentCreator = ""
    this.itemComments= new ReactiveVar()

    this.autorun(() => {
        FlowRouter.watchPathChange()
        itemId = FlowRouter.current().queryParams.side=="activityDetail" ? FlowRouter.current().queryParams.activityId : FlowRouter.current().queryParams.markerId
        Meteor.subscribe("itemComments", projectController.getAuthInfo(FlowRouter.current().params.projectId), FlowRouter.current().params.projectId , itemId , (err) => {
            if(err){
                console.log(err)
            }else{
                
            }
        })  
    })
    
});

Template.activityChat.onRendered(function () {
});

Template.activityChat.onDestroyed(function () {
});

