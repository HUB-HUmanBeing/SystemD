import cryptoTools from "../../../../../../../lib/cryptoTools";
import Publication from "../../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../../lib/controllers/projectController";
import preFormatMessage from "../../../../../../../lib/preformatMessages";

Template.showPollContent.helpers({
    //add you helpers here
    decryptedSymEnc_text: function () {
        return Template.instance().decryptedSymEnc_text.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    pollOptions: function () {
        return Template.instance().pollOptions.get()
    },
    addingProposition: function () {
        return Template.instance().addingProposition.get()
    },
    totalAnswer: function () {
        let total = 0
        Publication.findOne(Template.currentData().id).pollContent.options.forEach(option => {
            total += option.checkedBy.length
        })
        return total
    },
    showResult: function () {
        let checkedByCurrentMember = false
        let currentMemberId = projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
        Publication.findOne(Template.currentData().id).pollContent.options.forEach(option => {
            if (option.checkedBy.indexOf(currentMemberId) !== -1) {
                checkedByCurrentMember = true
            }
        })
        return checkedByCurrentMember
    },
    abortEdition: function () {
        return Template.currentData().abortEdition
    }
});

Template.showPollContent.events({
    'click [addProposition]':   function (event, instance){
        event.preventDefault()
        instance.addingProposition.set(true)
        Meteor.setTimeout(() => {
            resetTooltips()
            $(".newPropositionInput").focus()
        }, 200)
    },
    'click [removeProposition]': function (event, instance) {
        event.preventDefault()
        instance.addingProposition.set(false)
    },
    'submit [propositionForm]': function (event, instance) {
        event.preventDefault()
        let proposition = {symEnc_label:preFormatMessage($(".newPropositionInput").val())}
        cryptoTools.encryptObject(proposition, {symKey: Session.get("currentProjectSimKey")}, (encryptedProposition) => {
            let currentPublication = Publication.findOne(instance.data.id)
            currentPublication.callMethod(
                "addPollOption",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                encryptedProposition,
                (err, res) => {
                    if (err) { 
                        console.log(err)
                    }else{
                        instance.addingProposition.set(false)
                        proposition.checkedBy=['me']
                        instance.pollOptions.set([...instance.pollOptions.get(), proposition])
                        resetTooltips()
                    }
                }
            )
        })
    }
});

Template.showPollContent.onCreated(function () {
    //add your statement here
    this.decryptedSymEnc_text = new ReactiveVar(null)
    this.pollOptions = new ReactiveVar([])
    this.addingProposition = new ReactiveVar(false)
    this.autorun(() => {
        let publication = Publication.findOne(this.data.id)
        if (publication) {
            cryptoTools.sim_decrypt_data(publication.pollContent.symEnc_text, Session.get("currentProjectSimKey"), (decryptedSymEnc_text) => {
                this.decryptedSymEnc_text.set(decryptedSymEnc_text)
            })
            cryptoTools.decryptArrayOfObject(publication.pollContent.options, {symKey: Session.get("currentProjectSimKey")}, (pollOptions) => {
                this.pollOptions.set(pollOptions)
            })
        }
    })

});

Template.showPollContent.onRendered(function () {
    //add your statement here
});

Template.showPollContent.onDestroyed(function () {
    //add your statement here
});

