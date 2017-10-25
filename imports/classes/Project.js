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

const ProjectInvitation = Class.create({
    name: 'ProjectInvitation',
    fields: {
        user_id: String,
        invitationMessage: {
            type: String,
            default: "",
            validator: [
                {
                    type: 'maxLength',
                    param: 1000
                }
            ],
        },
        sendAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        adminId: String,
        status: {
            type: String,
            default: function () {
                return "waiting"
            }
        },
        answerMessage: {
            type: String,
            default: "",
            validator: [
                {
                    type: 'maxLength',
                    param: 1000
                }
            ],
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
        },
        invitations: {
            type: [ProjectInvitation],
            default: function () {
                return [];
            }
        }

    },
    helpers: {
        //helper pour indiquer le pourcentage de complétion du projet
        completed() {
            //on liste ici les champs du profil faisant parti du ratio
            let fieldsToComplete = [
                this.publicInfo.description,
                this.publicInfo.location.lat,
                this.publicInfo.imgUrl
            ];
            //on initialise
            let completed = 0;
            //on incrémente a chaque fois qu'un champs n'est pas invalide
            fieldsToComplete.forEach(function (field) {
                if (!(field === null || field === undefined || field === "" || field === 0 || field === "/images/icon/project_icon.png")) {
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
            let alreadyExist = Projects.find({name: projectName}).count();
            check(alreadyExist, 0);
            //on check que l'utilisateur est bien connecté
            check(Meteor.userId(), String);
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
                        roles: ['member', 'admin']
                    });
                    //et on sauvegarde
                    user.save()
                }
            });
        },
        /***************
         * verifie que l'utilisateur est membre du projet
         * @param userId
         * @returns {boolean}
         */

        isMember(userId) {
            check(userId, String);
            let isMember = false;
            this.members.forEach((member) => {
                if (member.user_id === Meteor.userId()) {
                    isMember = true
                }
            })
            return isMember
        },
        /*****************************
         * return true si l'utilisateur est membre du projet
         * @param userId
         * @returns {boolean}
         */
        isAdmin(userId) {
            check(userId, String);
            let isAdmin = false
            this.members.forEach((member) => {
                if (member.user_id === userId && member.roles.includes("admin")) {
                    isAdmin = true
                }
            })
            return isAdmin
        },
        /*********************************
         * modifie dynamiquement les info de la partie publique
         * @param key
         * @param value
         */
        updateInfoItem(key, value) {
            //on check que l'utilisateur est bien admin du projet
            check(key, String);
            check(this.isAdmin(Meteor.userId()), true)
            this.publicInfo[key] = value;
            return this.save()


        },
        /**********************************
         * modifie la localisation du projet
         * @param lat
         * @param lng
         * @param city
         * @param country
         */
        updateProjectLocation(lat, lng, city, country) {
            //on check que l'utilisateur est bien admin du projet
            check(this.isAdmin(Meteor.userId()), true)
            this.publicInfo.location.lat = lat;
            this.publicInfo.location.lng = lng;
            this.publicInfo.location.city = city;
            this.publicInfo.location.country = country;
            return this.save()

        },
        /**************************
         * methode d'invitation d'un nouvel utilisateur a rejoindre le projet
         * @param userId
         * @param invitationMessage
         */
        inviteUser(userId, invitationMessage) {
            //on check que l'utilisateur qu'on veut ajouter existe
            let invitedUser = User.findOne({_id: userId});
            check(invitedUser, User);
            //on check que l'utilisateur qui fait la demande est admin du projet'
            let adminId = Meteor.userId();
            check(this.isAdmin(adminId), true);

            //on insère l'invitation dans le tableau d'invitations de l'objet courant
            this.invitations.push({
                adminId: adminId,
                invitationMessage: invitationMessage,
                user_id: userId
            });
            //on enregistre, et si tout se passe bien
            this.save(function (err) {
                if (!err) {
                    //on insère l'invitation dans l'instance de l'utilisateur
                    console.log(invitedUser)
                    invitedUser.invitations.push({
                        project_id: this._id,
                        invitationMessage: invitationMessage
                    });
                    //puis on sauvegarde
                    user.save()
                }
            })

        }
    }
});

export default Project