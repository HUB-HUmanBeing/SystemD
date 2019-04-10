import preFormatMessage from "../../../../../../../../../lib/preformatMessages";
import cryptoTools from "../../../../../../../../../lib/cryptoTools";
import Comment from "../../../../../../../../../../imports/classes/Comment";
import projectController from "../../../../../../../../../lib/controllers/projectController";
import notificationController from "../../../../../../../../../lib/controllers/notificationController";

Template.newSubComment.helpers({
    //add you helpers here
    textareaId: function () {
        return "newSubCommentText-" + Template.currentData().comment._id
    },
    isCreating: function () {
        return Template.instance().isCreating.get()
    }
});

Template.newSubComment.events({
    //add your events here
    'submit [newSubCommentForm]': function (event, instance) {
        event.preventDefault()
        instance.isCreating.set(true)
        let content = preFormatMessage($("#newSubCommentText-" + instance.data.comment._id).val())
        cryptoTools.sim_encrypt_data(content, Session.get("currentProjectSimKey"), encryptedContent => {
            let comment = new Comment()
            let parentComment = instance.data.comment
            let subCommentParams = {
                commentId: parentComment._id,
                isRootComment: false,
                symEnc_content: encryptedContent
            }
            let MembersToNotify= comment.getMembersToNotify(parentComment, projectController.getCurrentUserProject(parentComment.projectId).asymEnc_memberId)
            comment.callMethod(
                "newSubComment",
                projectController.getAuthInfo(parentComment.projectId),
                subCommentParams,
                notificationController.getNotifyObjects(MembersToNotify),
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        $("#newSubCommentText-" + instance.data.comment._id).val("")
                        instance.isCreating.set(false)
                    }
                })
        })
    }
});

Template.newSubComment.onCreated(function () {
    //add your statement here
    this.isCreating = new ReactiveVar(false)
});

Template.newSubComment.onRendered(function () {
    //add your statement here
    $(".newSubComment textarea").attr("style", "height: 24px")
    $("#newSubCommentText-" + this.data.comment._id).keypress(function (e) {
        if (e.which == 13 && !e.shiftKey) {
            $(this).closest("form").submit();
            e.preventDefault();
            return false;
        }
    });
});

Template.newSubComment.onDestroyed(function () {
    //add your statement here
});

