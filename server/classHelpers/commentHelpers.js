import {check} from "meteor/check";
import Comment from "/imports/classes/Comment";
import NotifPush from "../../imports/NotifPush";
import Publication from "../../imports/classes/Publication";
import Topic from "../../imports/classes/Topic";


Comment.extend({
    helpers: {
        removeRecursive(cb) {
            return this.remove(err => {
                if (cb) {
                    cb(err)
                }

                if (!err && this.isRootComment) {
                    let commentsInside = Comment.find({commentId: this._id}).fetch()
                    commentsInside.forEach(comment => {
                        comment.remove()
                    })
                }
            })
        },
        notify(membersToNotify,notifObjects){
let topicId = Publication.findOne(this.publicationId).topicId
let categoryId = Topic.findOne(topicId).categoryId
            console.log( categoryId)
            NotifPush.notifyGlobally(membersToNotify, notifObjects, "newResponse",this.projectId,"forum", "categoryId="+categoryId+"&topicId="+topicId)
        },
    }
})
