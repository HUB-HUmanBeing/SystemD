import preFormatMessage from "../../../../../../../../../lib/preformatMessages";
import cryptoTools from "../../../../../../../../../lib/cryptoTools";
import Comment from "../../../../../../../../../../imports/classes/Comment";
import projectController from "../../../../../../../../../lib/controllers/projectController";
import notificationController from "../../../../../../../../../lib/controllers/notificationController";

Template.editComment.helpers({
    //add you helpers here
    textareaId: function () {
        return "editCommentText-" + Template.currentData().comment._id
    },
    isCreating: function () {
        return Template.instance().isCreating.get()
    }
});

Template.editComment.events({
    //add your events here
    'submit [editCommentForm]': function (event, instance) {
        event.preventDefault()
        instance.isCreating.set(true)
        let content = preFormatMessage($("#editCommentText-" + instance.data.comment._id).val())
        cryptoTools.sim_encrypt_data(content, Session.get("currentProjectSimKey"), encryptedContent => {
            let comment = Comment.findOne(instance.data.comment._id)
            comment.callMethod(
                "editComment",
                projectController.getAuthInfo(comment.projectId),
                encryptedContent,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        $("#editCommentText-" + instance.data.comment._id).val("")
                        instance.isCreating.set(false)
                        instance.data.abortEdition(content)
                    }
                })
        })
    }
});

Template.editComment.onCreated(function () {
    //add your statement here
    this.isCreating = new ReactiveVar(false)
});

Template.editComment.onRendered(function () {
    //add your statement here
    $("#editCommentText-" + this.data.comment._id).keypress(function (e) {
        if (e.which == 13 && !e.shiftKey) {
            $(this).closest("form").submit();
            e.preventDefault();
            return false;
        }
    });
    $("#editCommentText-" + this.data.comment._id).keypress(function (e) {
        if (e.key === "Escape") {
            this.data.abortEdition(this.data.content)
        }
    });
});

Template.editComment.onDestroyed(function () {
    //add your statement here
});

