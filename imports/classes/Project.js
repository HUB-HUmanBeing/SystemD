import {Class} from 'meteor/jagi:astronomy';
import ProjectInvitation from '/imports/classes/ProjectInvitation'
import Member from '/imports/classes/Member'
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
        },
        categories: {
            type: [Number],
            default: function () {
                return [];
            }
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
            index: 'text'
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
            }
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
    indexes: {
        location : {
            fields: {
                "publicInfo.location.lonLat": "2dsphere"
            }
        }
    },
    helpers: {
        //helper pour indiquer le pourcentage de complétion du projet
        completed() {
            //on liste ici les champs du profil faisant parti du ratio
            let fieldsToComplete = [
                this.publicInfo.description,
                this.publicInfo.location.lonLat,
                this.publicInfo.imgUrl,
                this.publicInfo.categories
            ];
            //on initialise
            let completed = 0;
            //on incrémente a chaque fois qu'un champs n'est pas invalide
            fieldsToComplete.forEach(function (field) {
                if (!(field === null
                        || field === undefined
                        || field === ""
                        || field === 0
                        || field === "/images/icon/project_icon.png"
                    ||field.length === 0)) {
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
            const currentUserLocation = Meteor.user().profile.location

            if (this.publicInfo.location && currentUserLocation.lonLat) {

                let distance = new Haversine(
                    this.publicInfo.location.lonLat[1],
                    this.publicInfo.location.lonLat[0],
                    currentUserLocation.lonLat[1],
                    currentUserLocation.lonLat[0]);

                return parseInt(distance.kilometers)
            } else {
                return null
            }
        },
        /****************************
         * renvoie true si toutes les conditions a remplir pour supprimer un projet sont réunies :
         * ------> 1 seul membre administrateur du projet
         * ------> pas d'invitations
         * @returns {*|boolean}
         */
        isDeletable() {
            let isWaitingInvitations = false;
            this.invitations.forEach((invitation) => {
                if (invitation.status === "waiting") {
                    isWaitingInvitations = true
                }
            })
            return this.isAdmin(Meteor.userId()) && this.members.length === 1 && !isWaitingInvitations
        },
        /*******************************
         *  helpeur utilisé lorsqu'on qu'un utilisateur souhaite quitter un projet
         */
        isThereOtherAdminsExeptCurrentUser() {
            const currentUserId = Meteor.userId()
            //on initialise un compteur d'admins autre que l'utilisateur courant
            let numberOfAdminsExeptMe = 0;
            //on boucle sur les membres du projet
            this.members.forEach((member) => {
                //si on en trouve qui sont admins sans etre l'utilisateur courant
                if (member.roles.includes("admin") && member.user_id !== currentUserId) {
                    numberOfAdminsExeptMe++;
                }
            })
            return numberOfAdminsExeptMe > 0
        }


    }
});

export default Project