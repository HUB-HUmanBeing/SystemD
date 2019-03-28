import cryptoTools from "../../../../../../lib/cryptoTools";
import Publication from "../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../lib/controllers/projectController";
import {renderShortname, unicodeToShortnames} from "emojitsu";
Template.textualContent.helpers({
    //add you helpers here
    showEmojiPicker : function () {
        return Template.instance().showEmojiPicker.get()
    }
});

Template.textualContent.events({
    //add your events here
    'click [toggleEmojiPicker]': function (event, instance) {
        event.preventDefault()
        instance.showEmojiPicker.set(!instance.showEmojiPicker.get())
    },
    'click [selectEmoji]': function (event, instance) {
        event.preventDefault()
        instance.showEmojiPicker.set(!instance.showEmojiPicker.get())
        let emoji = event.currentTarget.id.split('-')[1]
        $('#newPublicationText').val($('#newPublicationText').val() +emoji)
    },
    'submit [newPublicationForm]': function (event, instance) {
        event.preventDefault()
        function replaceSmileyByEmoji(text){
            let map = {
                "<3": "❤",
                ":D": "😀",
                ":)": "🙂",
                ";)": "😉",
                ":(": "😦",
                ":p": "😋",
                ";p": "😜",
                ":'(": "😓",
                ':/ ': "😑"
            };

            let  escapeSpecialChars = (regex)=> {
                return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
            }
            for (let i in map) {
                let regex = new RegExp(escapeSpecialChars(i), 'gim');
                text  = text.replace(regex, map[i]);
            }
            return text
        }
        let textContent =  unicodeToShortnames(replaceSmileyByEmoji($('#newPublicationText').val()))
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
                "newPublication",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                topic._id,
                publicationParams,
                (err,res)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("gagné", res)
                        instance.data.reset()
                    }
                }
            )
        })
    }
});

Template.textualContent.onCreated(function () {
    //add your statement here
    this.showEmojiPicker = new ReactiveVar(false)
});

Template.textualContent.onRendered(function () {
    //add your statement here
    $('#newPublicationText').val(Template.currentData().textContent)
    $('#newPublicationText').trigger('autoresize');
    $('#newPublicationText').characterCounter();
    $('#newPublicationText').focus()
});

Template.textualContent.onDestroyed(function () {
    //add your statement here
});

