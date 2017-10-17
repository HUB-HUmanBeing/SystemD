import {Class} from 'meteor/jagi:astronomy';
import Location from '/imports/classes/Location'
import Projects from '/lib/collections/Projects'
import User from '/imports/classes/User'


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
        imgUrl: {
            type: String,
            default: function () {
                return '/images/icon/project_icon.png'
            },
            // validator: Validators.regexp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
            // ,
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
        user_id: String,
        username: String,
        // joinAt : {
        //     type : Date,
        //     immutable: true,
        //     default : function () {
        //         return new Date()
        //     }
        // },
        roles: {
            type: [String],
            default: ["member"]
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
        /*****************************
         * methode de creation d'un nouveau projet
         * @param projectName String
         *******************************/
        'createProject': function (projectName) {
            //on verifie que le nom n'est pas déja pris
            let alreadyExist = Projects.find({name: projectName}).count()
            check(alreadyExist, 0);
            //on check que l'utilisateur est bien connecté
            check(Meteor.userId(), String)
            //on modifie le nom
            this.name = projectName;
            //on rajoute l'utilisateur courant comme admin du projet
            this.members.push({
                user_id: Meteor.userId(),
                username: Meteor.user().username,
                roles: ['member', 'admin']
            });
            //on sauvegarde le projet, puis
           return this.save(function (err, id) {
               //si ya pas d'erreur
                if (!err) {
                    //on recupere l'objet astronomy de l'utilisateur courant
                    let user = User.findOne(Meteor.userId());
                    //on ajoute le projet créé
                    user.profile.projects.push({
                        project_id: id,
                        name: projectName,
                        roles : ['member', 'admin']
                    });
                    //et on sauvegarde
                    user.save()
                }
            });
        },
        /*******************************
         * Methode renvoyant le role de l'utilisateur courant dans le projet
         */
        'currentUserRole' : function () {
            let roles = []
            this.members.forEach(function (member) {
                if(Meteor.userId() === member.user_id){
                   roles = member.roles
                }
            })
            return roles
        }
    }
})

export default Project