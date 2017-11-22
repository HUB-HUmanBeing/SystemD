import {Class} from 'meteor/jagi:astronomy';
import Competences from '/lib/collections/Competences'

/******************************
 * Classe des Competences
 **************************/
const Competence = Class.create({
    name: 'Competence',
    collection: Competences,
    fields: {
        code: Number,
        frenchName: {
            type: String,
            index: 'text'
        },
        category:{ //nous permettra de classer les compétences dans le
           type: String
        },
        subCategory:{
            type: Number
        }
    }
})

export default Competence