import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import ItemComment from "../../../imports/classes/ItemComment";
import Activity from "../../../imports/classes/Activity";
import MapMarker from "../../../imports/classes/MapMarker";

ItemComment.extend({
    meteorMethods: {
        newItemComment(authInfo, itemCommentParams) {
            check(itemCommentParams, {
                itemId: String,
                itemType: String,
                symEnc_content: String
            })
            check(authInfo, {memberId: String, userSignature: String})

            let item={}
            if (itemCommentParams.itemType=="Activity"){
                item = Activity.findOne(itemCommentParams.itemId)
            }else if (itemCommentParams.itemType=="MapMarker"){
                item = MapMarker.findOne(itemCommentParams.itemId)
            }
            let currentProject = Project.findOne(item.projectId)
            check(currentProject.isMember(authInfo), true)

            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId
            }
            itemCommentParams = {...itemCommentParams, ...computedParams}
            let newItemComment= new ItemComment(itemCommentParams)
            return newItemComment.save((err) => {
                if (!err) {
                    item.commentCount++
                    item.save()
                }else{
                    console.log(err)
                }
            })
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let itemComment = ItemComment.findOnde(this._id)
            let currentProject = Project.findOne(itemComment.projectId)
            check(currentProject.isMember(authInfo), true)
            check(authInfo.memberId === comment.createdBy, true)

            return itemComment.remove()
        }
    }
});