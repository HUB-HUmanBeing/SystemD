import cryptoTools from "../../../../../../lib/cryptoTools";
import Publication from "../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../lib/controllers/projectController";
import preFormatMessage from "../../../../../../lib/preformatMessages";

Template.pollContent.helpers({
    //add you helpers here
    propositions: function () {
        return Template.instance().propositions.get()
    }
});

Template.pollContent.events({
    //add your events here
    'keyup [propositionInput]': function (event, instance) {
        event.preventDefault()
        let index = event.target.id.split('-')[1]
        let value = event.target.value
        let newPropositions = []
        instance.propositions.get().forEach(proposition => {
            if (proposition.id === index) {
                proposition.value = value
            }
            newPropositions.push(proposition)
        })
        instance.propositions.set(newPropositions)

    },
    'click [addProposition]': function (event, instance) {
        event.preventDefault()
        let newPropositionId = cryptoTools.generateId()
        instance.propositions.set([...instance.propositions.get(), ...[{value: "", id: newPropositionId}]])
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
    'click [submitPublicationForm]': function (event, instance) {
        event.preventDefault()
        let propositions = instance.propositions.get()
        let textContent = preFormatMessage($('#newPublicationText').val())
        let topic = instance.data.topic
        let options = []
        propositions.forEach(proposition => {
            options.push({symEnc_label: proposition.value})
        })
        cryptoTools.sim_encrypt_data(textContent, Session.get("currentProjectSimKey"), (symEnc_text) => {
            cryptoTools.encryptArrayOfObject(options, {symKey: Session.get("currentProjectSimKey")}, (encryptedOptions) => {
                let publicationParams = {
                    type: "pollContent",
                    pollContent: {
                        symEnc_text: symEnc_text,
                        options: encryptedOptions
                    }
                }
                let newPublication = new Publication()
                newPublication.callMethod(
                    "newPublicationPoll",
                    projectController.getAuthInfo(FlowRouter.current().params.projectId),
                    topic._id,
                    publicationParams,
                    instance.data.notifyObjects,
                    (err, res) => {
                        if (err) {
                            console.log(err)
                        } else {
                            instance.data.reset()
                        }
                    }
                )
            })

        })
    }

});

Template.pollContent.onCreated(function () {
    //add your statement here
    this.propositions = new ReactiveVar([
        {value: "", id: cryptoTools.generateId()},
        {value: "", id: cryptoTools.generateId()}
    ])
});

Template.pollContent.onRendered(function () {
    //add your statement here
});

Template.pollContent.onDestroyed(function () {
    //add your statement here
});

