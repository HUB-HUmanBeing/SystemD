import Publication from "../../../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../../../lib/controllers/projectController";

Template.pollOption.helpers({
    //add you helpers here
    checked: function () {
        let options = Publication.findOne(Template.currentData().id).pollContent.options
        let currentMemberId = projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
        return options[Template.currentData().index].checkedBy.indexOf(currentMemberId) > -1
    },
    countValue: function () {
        return Publication.findOne(Template.currentData().id).pollContent.options[Template.currentData().index].checkedBy.length
    },
    countPercent: function () {
        let countValue = Publication.findOne(Template.currentData().id).pollContent.options[Template.currentData().index].checkedBy.length
        return Math.round((countValue / Template.currentData().totalAnswer) * 100)
    }
});

Template.pollOption.events({
    //add your events here
    'click [selectOption]': function (event, instance) {
        event.preventDefault()
        let publication = Publication.findOne(instance.data.id)
        publication.callMethod("chooseProposition", projectController.getAuthInfo(FlowRouter.current().params.projectId), instance.data.index, (err, res) => {
            if (err) {
                console.log(err)
            }
        })
    }
});

Template.pollOption.onCreated(function () {
    //add your statement here
});

Template.pollOption.onRendered(function () {
    //add your statement here
});

Template.pollOption.onDestroyed(function () {
    //add your statement here
});

