import {Class} from 'meteor/jagi:astronomy';
import CollaboratorAdverts from '/lib/collections/CollaboratorAdverts'
import Location from '/imports/classes/Location'
/******************************
 * Classe des Annonces de recherche de nouveaux collaborateurs
 **************************/
const CompetencesCriterion = Class.create({
   name: 'CompetenceCriterion' ,
    fields : {
       competences : {
           type : [Number],
           optional : true
       }
    }
})
const CollaboratorAdvert = Class.create({
    name: 'CollaboratorAdvert',
    collection: CollaboratorAdverts,
    fields: {
        location: {//permet a l'utilisateur d'epingler en haut de son fil un article
            type: Location,
            default: function () {
                return {}
            }
        },
        project_id: {
            type: String,
            index: 1
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        title: {
            type: String,
            optional: true,
            validators: [
                {
                    type: 'maxLength',
                    param: 70,
                }
            ],
        },
        content: {
            type: String,
            optional: true,
            validators: [
                {
                    type: 'maxLength',
                    param: 200,
                }
            ],
        },
        range: {
            type: Number,
            optional: true,
        },
        categories : {
            type: [Number],
            optional: true,
        },
        competencesCriteria :  {
            type : [CompetencesCriterion],
            optional: true,
        },
        competencesLabels: {
            type: [String],
            optional: true,
        }
    },
    indexes: {
        location : {
            fields: {
                "location.lonLat": "2dsphere"
            }
        }
    },
})

export default CollaboratorAdvert