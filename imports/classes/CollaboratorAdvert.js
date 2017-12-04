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
        location: {
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
            },
            index : -1
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
                    param: 300,
                }
            ],
        },
        range: {
            type: Number,
            optional: true,
        },
        categories : {
            type: [Number],
            default: function () {
                return []
            },
        },
        competencesCriteria :  {
            type : [CompetencesCriterion],
            default: function () {
                return []
            },
        },
        competencesLabels: {
            type: [String],
            default: function () {
                return []
            },
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