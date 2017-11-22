import {Class} from 'meteor/jagi:astronomy';
import CompetencesCategories from '/lib/collections/CompetencesCategories'

/******************************
 * Classe des CompetencesCategory
 **************************/
const CompetencesCategory = Class.create({
    name: 'CompetencesCategory',
    collection: CompetencesCategories,
    fields: {
        index: String,
        frenchName: {
            type: String,
        },
    }
})

export default CompetencesCategory