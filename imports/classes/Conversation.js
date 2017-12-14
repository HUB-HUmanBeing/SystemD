import {Class} from 'meteor/jagi:astronomy';
import Conversations from '/lib/collections/Conversations'

/******************************
 * Classe des Messages de conversations
 **************************/
const ConversationMessage = Class.create({
    name: 'ConversationMessage',
    fields: {
        content : String,
        speakerId : String,
        sendAt : {
            type: Date,
            default: function () {
                return new Date()
            }
        }
    }
})

/******************************
 * Classe des conversations entre projet et utilisateurs, user et user, projet et projets
 **************************/
const Conversation = Class.create({
    name: 'Conversation',
    collection: Conversations,
    fields: {
        messages : [ConversationMessage]
    }
})

export default Conversation