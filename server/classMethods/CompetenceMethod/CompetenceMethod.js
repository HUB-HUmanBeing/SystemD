
import Competence from '/imports/classes/Competence';
import Competences from '/lib/collections/Competences'
/*********************
 * Methodes des commentaires de blog
 */
Competence.extend({
    meteorMethods: {

        getCompetencesByLanguage(language) {
            check(language, String)
            let fields= {}
            if (language === "french"){
                fields= {}
            }
            return Competences.find({}, {fields : fields, sort: {code:1}}).fetch()
        }
    }
})