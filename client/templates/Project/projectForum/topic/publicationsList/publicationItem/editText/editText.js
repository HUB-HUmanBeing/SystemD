import preFormatMessage from "../../../../../../../lib/preformatMessages";
import cryptoTools from "../../../../../../../lib/cryptoTools";
import Publication from "../../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../../lib/controllers/projectController";

Template.editText.helpers({
    //add you helpers here
    textareaId:  function () {
        return "editPublicationText-"+Template.currentData().id
    }
});

Template.editText.events({
    //add your events here
    'click [abort]' : function (event, instance) {
        event.preventDefault()
instance.data.abortEdition(true)
    },
    'submit [editPublicationForm]': function (event, instance) {
        event.preventDefault()
        let textContent = preFormatMessage($('#editPublicationText-'+instance.data.id).val())
        cryptoTools.sim_encrypt_data(textContent, Session.get("currentProjectSimKey"), (symEnc_text) => {

            let publication = Publication.findOne(instance.data.id)
            publication.callMethod(
                "editPublication",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                symEnc_text,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        instance.data.abortEdition(true)
                    }
                }
            )
        })
    }
});

Template.editText.onCreated(function () {
    //add your statement here
});

Template.editText.onRendered(function () {
    //add your statement here
});

Template.editText.onDestroyed(function () {
    //add your statement here
});

