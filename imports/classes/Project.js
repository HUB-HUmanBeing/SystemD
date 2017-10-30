import {Class} from 'meteor/jagi:astronomy';
import ProjectInvitation from '/imports/classes/ProjectInvitation'
import Location from '/imports/classes/Location'
import Projects from '/lib/collections/Projects'


const PublicInfo = Class.create({
    name: 'PublicInfo',
    fields: {
        description: {
            type: String,
            optional: true,
            validators: [
                {
                    type: 'maxLength',
                    param: 1000
                }
            ],
        },
        imgUrl: {
            type: String,
            default: '/images/icon/project_icon.png'
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
        joinedAt: {
            type : Date,
            immutable: true,
            default : function () {
                return new Date()
            }
        },
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
            validators: [
                {
                    type: 'maxLength',
                    param: 40
                },
                {
                    type: 'minLength',
                    param: 4,
                    message: 'Project name is too short'
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
            default: function () {
                return new Date()
            },
            immutable: true
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
        },
        /*****************************
         * return true si l'utilisateur est membre du projet
         * @param userId
         * @returns {boolean}
         */
        isAdmin(userId) {
            check(userId, String);
            let isAdmin = false;
            this.members.forEach((member) => {
                if (member.user_id === userId && member.roles.includes("admin")) {
                    isAdmin = true
                }
            });
            return isAdmin
        },
        /****************************
         * verifie qu'un utilisateur est invitable dans un projet
         * @param userId
         * @returns {boolean}
         ********************************************************/
        isInvitableUser(userId) {
            check(userId, String);
            //on check que c'est bien un admin qui fait la demande
            //on verifie que l'utilisateur n'est pas déja membre
            let isInvitable = true;
            if (this.isMember(userId)) {
                isInvitable = false
            } else {
                //et qu'il n'a pas déja une invitation en attente
                this.invitations.forEach((invitation) => {
                    if (invitation.user_id === userId && invitation.status === 'waiting') {
                        isInvitable = false
                    }
                })
            }
            return isInvitable
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
                if (member.user_id === userId) {
                    isMember = true
                }
            });
            return isMember
        },
        /*************************
         * renvoie la distance relative entre l'utilisateur courant et un projet
         * @returns {Number}
         */
        relativeDistance() {
            let currentUserLocation = Meteor.user().profile.location;

            if(this.publicInfo.location && currentUserLocation){

            let distance = new Haversine(
                this.publicInfo.location.lonLat[1],
                this.publicInfo.location.lonLat[0],
                currentUserLocation.lonLat[1],
                currentUserLocation.lonLat[0]);

            return parseInt(distance.kilometers)
            }else{
                return null
            }
        }
    }
});

export default Project