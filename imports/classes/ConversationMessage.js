import {Class} from 'meteor/jagi:astronomy';
import ConversationMessages from '/lib/collections/ConversationMessages'

/******************************
 * Classe des Messages de conversations
 **************************/
const ConversationMessage = Class.create({
    name: 'ConversationMessage',
    collection: ConversationMessages,
    fields: {
        content : String,
        speakerId : String,
        conversation_id: {
            type : String,
            index : 1
        },
        sendAt : {
            type: Date,
            default: function () {
                return new Date()
            },
            index: -1
        }
    }
})

export default ConversationMessage