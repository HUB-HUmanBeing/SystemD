import Competence from '/imports/classes/Competence';
import Competences from '/lib/collections/Competences';
import CompetencesCategories from '/lib/collections/CompetencesCategories';
import CompetencesSubCategories from '/lib/collections/CompetencesSubCategories'

/*********************
 * Methodes des commentaires de blog
 */
Competence.extend({
    meteorMethods: {
        /************************************
         * Renvoie un objet avec les compétences et leurs catégories
         * @param language
         * @returns {{competences: any, competencesCategories: any, competencesSubCategories: any}}
         */
        getCompetencesByLanguage(language) {
            check(language, String)
            let fields = {}
            if (language === "french") {
                fields = {}
            }
            return {
                competences : Competences.find({}, {fields: fields, sort: {index: 1}}).fetch(),
                competencesCategories: CompetencesCategories.find({}, {fields: fields, sort: {index: 1}}).fetch(),
                competencesSubCategories: CompetencesSubCategories.find({}, {fields: fields, sort: {index: 1}}).fetch(),
            }
        },
        /**************************************
         * creation d'une nouvelle compétence
         */
        addNewCompetence(){
            check(Meteor.userId(), String)
            //on check qu'elle a bien des catégories et sousCatégories valides
            check(CompetencesCategories.find({index : this.category}).count() , 1)
            check(CompetencesSubCategories.find({index : this.subCategory}).count() , 1)
            this.index= Competences.find({}).count()
            this.save()
        }
    }
})