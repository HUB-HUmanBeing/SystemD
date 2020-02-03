import {check} from "meteor/check";
import {Class} from 'meteor/jagi:astronomy';
import Project from "../../../imports/classes/Project";
import ItemComment from "../../../imports/classes/ItemComment";
import Activity from "../../../imports/classes/Activity";
import Marker from "../../../imports/classes/MapMarker";
import MapMarker from "../../../imports/classes/MapMarker";

ItemComment.extend({
    meteorMethods: {
        newItemComment(authInfo, ItemCommentParams) {
            check(ItemCommentParams, {
                itemId: String,
                itemType: Class,
                symEnc_content: String
            })
            check(authInfo, {memberId: String, userSignature: String})

            if (ItemCommentParams.itemType==Activity){
                let item = Activity.findOne(ItemCommentParams.itemId)
            }else if (ItemCommentParams.itemType==MapMarker){
                let item = MapMarker.findOne(ItemCommentParams.itemId)
            }
            let currentProject = Project.findOne(item.projectId)
            check(currentProject.isMember(authInfo), true)

            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId
            }
            ItemCommentParams = {...ItemCommentParams, ...computedParams}
            let newItemComment= new ItemComment(ItemCommentParams)
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