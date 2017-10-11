import {Class} from 'meteor/jagi:astronomy';
import Location from '/imports/classes/Location'
import Projects from '/lib/collections/Projects'


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
        // joinAt : {
        //     type : Date,
        //     immutable: true,
        //     default : function () {
        //         return new Date()
        //     }
        // },
        roles : {
            type : [String],
            default : ["member"]
        }

    },
});

const Project = Class.create({
    name: 'Project',
    collection: Projects,
    fields: {
        name: {
            type: String,
            validator: [
                {
                    type: 'maxLength',
                    param: 50
                },
                {
                    type: 'minLength',
                    param: 5
                }
            ],

        },
        members: {
            type: [Member],
            default: function () {
                return [];
            }
        },
        createdAt: {
            type: Date,
            default: new Date()
        },
        publicInfo: {
            type: PublicInfo,
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
        'createProject': function (projectName) {
            // let alreadyExist = Projects.find({name: projectName}).count
            // check(alreadyExist, 0);
            this.name = projectName;
            this.members.push( {
                    user_id: Meteor.userId(),
                    username: Meteor.user().username,
                    roles: ['member', 'admin']
                });
            return this.save();

        }
    }
})

export default Project