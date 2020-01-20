import cryptoTools from "../../../../../../../../lib/cryptoTools";
import projectController from "../../../../../../../../lib/controllers/projectController";
import Comment from "/imports/classes/Comment";
import notificationController from "../../../../../../../../lib/controllers/notificationController";
import preFormatMessage from "../../../../../../../../lib/preformatMessages";

Template.newComment.helpers({
    //add you helpers here
    textareaId: function () {
        return "newCommentText-" + Template.currentData().publication._id
    },
    isCreating: function () {
        return Template.instance().isCreating.get()
    }
});

Template.newComment.events({
    //add your events here
    'submit [newPublicationForm]': function (event, instance) {
        event.preventDefault()
        instance.isCreating.set(true)
        resetTooltips()
        let content = preFormatMessage($("#newCommentText-" + instance.data.publication._id).val())
        cryptoTools.sim_encrypt_data(content, Session.get("currentProjectSimKey"), encryptedContent => {
            let comment = new Comment()
            let publication = instance.data.publication
            let commentParams = {
                publicationId: publication._id,
                isRootComment: true,
                symEnc_content: encryptedContent
            }
            let MembersToNotify= comment.getMembersToNotify(publication, projectController.getCurrentUserProject(publication.projectId).asymEnc_memberId)
            comment.callMethod(
                "newComment",
                projectController.getAuthInfo(publication.projectId),
                commentParams,
                notificationController.getNotifyObjects(MembersToNotify),
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        $("#newCommentText-" + instance.data.publication._id).val("")
                        instance.isCreating.set(false)
                    }
                })
        })
    }
});

Template.newComment.onCreated(function () {
    //add your statement here
    this.isCreating = new ReactiveVar(false)
});

Template.newComment.onRendered(function () {
    //add your statement here
    $(".newComment textarea").attr("style", "height: 24px")
    $("#newCommentText-" + this.data.publication._id).keypress(function (e) {
        if (e.which == 13 && !e.shiftKey) {
            $(this).closest("form").submit();
            e.preventDefault();
            return false;
        }
    });
});

Template.newComment.onDestroyed(function () {
    //add your statement here
});

