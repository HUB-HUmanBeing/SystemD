import {Class} from 'meteor/jagi:astronomy';
import CompetencesSubCategories from '/lib/collections/CompetencesSubCategories'

/******************************
 * Classe des CompetencesCategory
 **************************/
const CompetencesSubCategory = Class.create({
    name: 'CompetencesSubCategory',
    collection: CompetencesSubCategories,
    fields: {
        index: String,
        frenchName: {
            type: String,
        },
        category:{ //nous permettra de classer les compétences dans le
            type: String
        },
    }
})

export default CompetencesSubCategory