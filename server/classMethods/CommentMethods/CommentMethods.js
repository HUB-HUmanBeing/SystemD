import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Comment from "../../../imports/classes/Comment";
import Publication from "../../../imports/classes/Publication";
import NotifPush from "../../../imports/NotifPush";


Comment.extend({
    meteorMethods: {

        newComment(authInfo, CommentParmas, notifObjects) {
            check(CommentParmas, {
                publicationId: String,
                isRootComment: Boolean,
                symEnc_content: String
            })
            check(authInfo, {memberId: String, userSignature: String})

            let publication = Publication.findOne(CommentParmas.publicationId)
            let currentProject = Project.findOne(publication.projectId)
            check(currentProject.isMember(authInfo), true)

            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId
            }
            CommentParmas = {...CommentParmas, ...computedParams}
            let newComment = new Comment(CommentParmas)
            return newComment.save((err) => {
                if (!err) {
                    publication.commentCount++
                    publication.save()
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])
                    newComment.notify(this.getMembersToNotify(publication, authInfo.memberId), notifObjects)
                } else {
                    console.log(err)
                }
            })
        },
        newSubComment(authInfo, subCommentParmas, notifObjects) {
            check(subCommentParmas, {
                commentId: String,
                isRootComment: Boolean,
                symEnc_content: String
            })
            check(authInfo, {memberId: String, userSignature: String})

            let comment = Comment.findOne(subCommentParmas.commentId)
            let currentProject = Project.findOne(comment.projectId)
            check(currentProject.isMember(authInfo), true)

            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId,
                publicationId: comment.publicationId
            }
            subCommentParmas = {...subCommentParmas, ...computedParams}
            let newComment = new Comment(subCommentParmas)
            return newComment.save((err) => {
                if (!err) {
                    comment.commentCount++
                    comment.save()
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])
                    newComment.notify(this.getMembersToNotify(comment, authInfo.memberId), notifObjects)
                } else {
                    console.log(err)
                }
            })
        },
        editComment(authInfo, symEnc_content) {
            check(authInfo, {memberId: String, userSignature: String})
            check(symEnc_content,  String)
            let comment = Comment.findOne(this._id)
            let currentProject = Project.findOne(comment.projectId)
            check(currentProject.isMember(authInfo), true)
            check(authInfo.memberId === comment.createdBy, true)
            comment.symEnc_content = symEnc_content
            return comment.save()

        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let comment = Comment.findOne(this._id)
            let currentProject = Project.findOne(comment.projectId)
            check(currentProject.isMember(authInfo), true)
            check(authInfo.memberId === comment.createdBy, true)

            return comment.removeRecursive()

        },
        toggleLike(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let comment = Comment.findOne(this._id)
            let currentProject = Project.findOne(comment.projectId)
            check(currentProject.isMember(authInfo), true)
            let memberIndex = comment.likedBy.indexOf(authInfo.memberId)
            if (memberIndex > -1) {
                comment.likedBy.splice(memberIndex, 1)
            } else {
                comment.likedBy.push(authInfo.memberId)
            }

            return comment.save()
        }
    }
})
