import cryptoTools from "../../../../../../../lib/cryptoTools";
import Publication from "../../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../../lib/controllers/projectController";

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
    propositions: function () {
        return Template.instance().propositions.get()
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
    },
});

Template.showPollContent.events({
    'click [addProposition]':   function (event, instance){
        event.preventDefault()
        let newPropositionId = cryptoTools.generateId()
        instance.propositions.set([...instance.propositions.get(), {value: "", id: newPropositionId}])
        Meteor.setTimeout(() => {
            $("#pollPropositionInput-" + newPropositionId).focus()
        }, 100)
    },
    'click [removeProposition]': function (event, instance) {
        event.preventDefault()
        let id = event.currentTarget.id.split('-')[1]
        let newArray = []
        instance.propositions.get().forEach(proposition => {
            if (proposition.id !== id) {
                newArray.push(proposition)
            }
        })
        instance.propositions.set(newArray)
    },
    'click [sendProposition]': function (event, instance) {
        event.preventDefault()
        let id = event.currentTarget.id.split('-')[1]
        console.log(id)
        $("#pollPropositionInput-"+newPropositionId).reset()
    }
});

Template.showPollContent.onCreated(function () {
    //add your statement here
    this.decryptedSymEnc_text = new ReactiveVar(null)
    this.pollOptions = new ReactiveVar([])
    this.propositions = new ReactiveVar([])
    this.autorun(() => {
        let publication = Publication.findOne(this.data.id)
        if (publication) {
            cryptoTools.sim_decrypt_data(publication.pollContent.symEnc_text, Session.get("currentProjectSimKey"), (decryptedSymEnc_text) => {
                this.decryptedSymEnc_text.set(decryptedSymEnc_text)
            })
            cryptoTools.decryptArrayOfObject(this.data.content.options, {symKey: Session.get("currentProjectSimKey")}, (pollOptions) => {
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

