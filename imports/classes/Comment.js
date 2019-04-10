import {Class} from 'meteor/jagi:astronomy';
import Comments from "../../lib/collections/Comments";
import Publication from "./Publication";

const Comment = Class.create({
    name: 'Comment',
    collection: Comments,
    fields: {

        projectId: {
            type: String,
            index: 1
        },
        publicationId: {
            type: String,
            index: 1
        },
        commentId: {
            type: String,
            index: 1,
            optional: true
        },
        isRootComment: {
            type: Boolean,
            index: 1
        },
        createdBy: { //memberId of the admin who emit the Comment
            type: String
        },
        symEnc_content: {
            type: String
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        commentCount: {
            type: Number,
            default: function () {
                return 0
            }
        },
        likedBy: {
            type: [String],
            default: function () {
                return [];
            }
        }
    },
    helpers: {
        getParentElement(){
            if(this.isRootComment){
                return Publication.findOne(this.publicationId)
            }else{
                return this.findOne(this.commentId)
            }
        },
        getPrecedentComments(parentElement, number) {
            if (parentElement.type === "Comment") {
                return Comments.find({commentId: parentElement._id, isRootComment: false}, {
                    limit: number,
                    sort: {
                        createdAt: -1
                    }
                }).fetch()
            } else {
                return Comments.find({publicationId: parentElement._id, isRootComment: true}, {
                    limit: number,
                    sort: {
                        createdAt: -1
                    }
                }).fetch()
            }
        },
        getMembersToNotify(parentElement, currentMemberId) {
            let membersToNotify = []
            if (parentElement.commentCount < 3) {
                membersToNotify.push(parentElement.createdBy)
            }
            this.getPrecedentComments(parentElement, 3).forEach(comment => {
                membersToNotify.push(comment.createdBy)
            })
            membersToNotify = [...new Set(membersToNotify)]
            let index = membersToNotify.indexOf(currentMemberId)
            if (index > -1) {
                membersToNotify.splice(index, 1)
            }
            return membersToNotify
        }
    }

});

export default Comment
