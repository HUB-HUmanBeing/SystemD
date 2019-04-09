import cryptoTools from "../../../../../../lib/cryptoTools";
import Publication from "../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../lib/controllers/projectController";
import {renderShortname, unicodeToShortnames} from "emojitsu";
import preFormatMessage from "../../../../../../lib/preformatMessages";


Template.textualContent.helpers({
    //add you helpers here

    isCreating: function () {
        return Template.instance().isCreating.get()
    }
});

Template.textualContent.events({
    //add your events here

    'submit [newPublicationForm]': function (event, instance) {
        event.preventDefault()
        instance.isCreating.set(true)
        let textContent = preFormatMessage($('#newPublicationText').val())
        let topic = instance.data.topic
        cryptoTools.sim_encrypt_data(textContent, Session.get("currentProjectSimKey"), (symEnc_text) => {
            let publicationParams = {
                type: "textualContent",
                textualContent: {
                    symEnc_text: symEnc_text
                }
            }
            let newPublication = new Publication()
            newPublication.callMethod(
                "newPublicationTextual",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                topic._id,
                publicationParams,
                instance.data.notifyObjects,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        instance.data.reset()
                        instance.isCreating.set(false)
                    }
                }
            )
        })
    }
});

Template.textualContent.onCreated(function () {
    //add your statement here
    this.isCreating = new ReactiveVar(false)
});

Template.textualContent.onRendered(function () {
    //add your statement here

});

Template.textualContent.onDestroyed(function () {
    //add your statement here
});

