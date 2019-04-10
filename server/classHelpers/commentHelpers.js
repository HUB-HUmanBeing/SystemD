import {check} from "meteor/check";
import Comment from "/imports/classes/Comment";
import NotifPush from "../../imports/NotifPush";
import Publication from "../../imports/classes/Publication";


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
        }
    }
})
