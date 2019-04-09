import {check} from "meteor/check";
import Comment from "/imports/classes/Comment";
import NotifPush from "../../imports/NotifPush";
import Publication from "../../imports/classes/Publication";


Publication.extend({
    helpers: {

        removeRecursive(cb) {
            return this.remove(err=>{
                if(cb){
                    cb(err)
                }
                if(!err){
                    let commentsInside= Comment.find({publicationId:this._id}).fetch()
                    commentsInside.forEach(comment=>{
                        comment.removeRecursive()
                    })
                }
            })
        }
    }
})
