import projectController from "../../../../../../../lib/controllers/projectController";

Template.likeBox.helpers({
    //add you helpers here
    liked: function () {
        let likedBy = Template.currentData().class.likedBy
        let currentMemberId = projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
        return likedBy.indexOf(currentMemberId) > -1
    }
});

Template.likeBox.events({
    //add your events here
    'click [toggleLike]': function (event, instance) {
        event.preventDefault()
        resetTooltips()
        instance.data.class.callMethod("toggleLike",
            projectController.getAuthInfo(FlowRouter.current().params.projectId), (err) => {
                if (err) {
                    console.log(err)
                }
            }
        )

    }
});

Template.likeBox.onCreated(function () {
    //add your statement here
});

Template.likeBox.onRendered(function () {
    //add your statement here
});

Template.likeBox.onDestroyed(function () {
    //add your statement here
});

