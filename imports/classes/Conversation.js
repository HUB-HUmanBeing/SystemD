import {Class} from 'meteor/jagi:astronomy';
import Conversations from '/lib/collections/Conversations'



/******************************
 * Classe des conversations entre projet et utilisateurs, user et user, projet et projets
 **************************/
const Conversation = Class.create({
    name: 'Conversation',
    collection: Conversations,
})

export default Conversation