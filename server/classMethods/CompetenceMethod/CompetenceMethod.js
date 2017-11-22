import Competence from '/imports/classes/Competence';
import Competences from '/lib/collections/Competences';
import CompetencesCategories from '/lib/collections/CompetencesCategories';
import CompetencesSubCategories from '/lib/collections/CompetencesSubCategories'

/*********************
 * Methodes des commentaires de blog
 */
Competence.extend({
    meteorMethods: {

        getCompetencesByLanguage(language) {
            check(language, String)
            let fields = {}
            if (language === "french") {
                fields = {}
            }
            return Competences.find({}, {fields: fields, sort: {index: 1}}).fetch()
        },
        getCompetencesCatByLanguage(language) {
            check(language, String)
            let fields = {}
            if (language === "french") {
                fields = {}
            }
            return {
                competencesCategories: CompetencesCategories.find({}, {fields: fields, sort: {index: 1}}).fetch(),
                competencesSubCategories: CompetencesSubCategories.find({}, {fields: fields, sort: {index: 1}}).fetch(),
            }
        }
    }
})