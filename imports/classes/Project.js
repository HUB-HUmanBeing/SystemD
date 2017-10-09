import {Class} from 'meteor/jagi:astronomy';
import Location from '/imports/classes/Location'

const PublicInfo = Class.create({
    name: 'PublicInfo',
    fields: {
        description: {
            type: String,
            optional: true,
            validator: [
                {
                    type: 'maxLength',
                    param: 1000
                }
            ],
        },
        location: {
            type: Location,
            default: function () {
                return {}
            }
        }
    },
});

const Member = Class.create({
    name: 'Member',
    fields: {
        user_id : String,
        username : String,
        joinAt : {
            type : Date,
            immutable: true,
            default : function () {
                return new Date()
            }
        },
        role : {
            type : [String],
            default : "member"
        }

    },
});

const Project = Class.create({
    name: 'Project',
    collection: Projects,
    fields: {
        members : {
            type : [Member],
            default: function () {
                return [];
            }
        },
        createdAt: {
            type : Date,
            default: new Date()
        },
        publicInfo: {
            type: publicInfo,
            default: function () {
                return {};
            }
        }

    },
    helpers: {
        //helper pour indiquer le pourcentage de complétion du projet
        completed() {
            //on liste ici les champs du profil faisant parti du ratio
            let fieldsToComplete = [
                this.publicInfo.description,
                this.publicInfo.location.lat
            ];
            //on initialise
            let completed = 0;
            //on incrémente a chaque fois qu'un champs n'est pas invalide
            _.each(fieldsToComplete, function (field) {
                if (!(field === undefined || field === "" || field === 0)) {
                    completed += 1
                }
            });
            //on retourne le résultat divisé par le nombre d'element à checker,
            // le tout multiplié par 100 pour l'avoir en pourcentage
            return parseInt((completed / fieldsToComplete.length) * 100)
        }
    },
    meteorMethods: {

    }
});



export default Project;