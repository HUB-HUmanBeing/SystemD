//sont définis ici la classe user et sa sous classe profile
import {Class} from 'meteor/jagi:astronomy';
import Location from '/imports/classes/Location'
import Notification from '/imports/classes/Notification'

// import Project from '/imports/classes/Project'

const UserInvitation = Class.create({
    name: 'UserInvitation',
    fields: {
        project_id: String,
        invitationMessage: {
            type: String,
            default: "",
            validators: [
                {
                    type: 'maxLength',
                    param: 1000
                }
            ],
        },
        sentAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        status: {
            type: String,
            default: "waiting"
        }
    },
});


const UserProject = Class.create({
    name: 'UserProject',
    fields: {
        project_id: String,
        //on garde le nom, ce qui évite une subscription pour le menu latéral
        name: String,
        roles: {
            type: [String],
            default: ["member"]
        }
    },
});

const Profile = Class.create({
    name: 'Profile',
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
            default: '/images/icon/user_icon.png'

            // validator: Validators.regexp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)// ,
        },
        location: {
            type: Location,
            default: function () {
                return {}
            }
        },
        projects: {
            type: [UserProject],
            default: function () {
                return [];
            }
        },
        followedAuthors: {
            type: [String],
            default: function () {
                return [];
            }
        },
        invitations: {
            type: [UserInvitation],
            default: function () {
                return [];
            }
        },
        notifications: {
            type: [Notification],
            default: function () {
                return [];
            }
        },
        categories:{
            type: [Number],
            default: function () {
                return [];
            }
        },
        competences:{
            type: [Number],
            default: function () {
                return [];
            }
        }
    },

});


const User = Class.create({
    name: 'User',
    collection: Meteor.users,
    fields: {
        emails: {
            type: [Object],
            optional: true
        },
        username: {
            type: String,
            immutable: true,
            index: 'text'
        },
        services: {
            type: Object,
            optional: true
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        profile: {
            type: Profile,
            default: function () {
                return {};
            }
        }

    },
    helpers: {
        //helper pour indiquer le pourcentage de complétion du profil
        completed() {
            //on liste ici les champs du profil faisant parti du ratio
            let fieldsToComplete = [
                this.profile.description,
                this.profile.location.lonLat,
                this.profile.imgUrl
            ];
            //on initialise
            let completed = 0;
            //on incrémente a chaque fois qu'un champs n'est pas invalide
            _.each(fieldsToComplete, function (field) {
                if (!(
                        field === undefined ||
                        field === "" ||
                        field === 0 ||
                        field === '/images/icon/user_icon.png')
                ) {
                    completed += 1
                }
            });
            //on retourne le résultat divisé par le nombre d'element à checker,
            // le tout multiplié par 100 pour l'avoir en pourcentage
            return parseInt((completed / fieldsToComplete.length) * 100)
        },
        /*************************
         * renvoie la distance vis a vis de l'utilisateur courant
         * @returns {Number}
         ****************************/
        distance() {
          const currentUserLocation = Meteor.user().profile.location

            if (this.profile.location.lonLat && currentUserLocation.lonLat) {

                let distance = new Haversine(
                    this.profile.location.lonLat[1],
                    this.profile.location.lonLat[0],
                    currentUserLocation.lonLat[1],
                    currentUserLocation.lonLat[0]
                );
                return parseInt(distance.kilometers)
            } else {
                return null
            }

        },
        /***************
         *renvoie le nombre de projet d'un utilisateur
         * @returns {Number}
         *********************/
        nbOfProjects() {
            return this.profile.projects.length
        },
        /**
         * Renvoie une liste comprenant les propriétés du/des projets d'un utilisateur.
         * @returns {Array}
         */
        projectsData() {
            let items = [];
            this.profile.projects.forEach(function (project) {
                let icon = project.roles.includes("admin") ? "verified_user" : "perm_identity";
                items.push({
                    id: project.project_id,
                    name: project.name,
                    path: "projectMainPage",
                    pathData: {_id: project.project_id},
                    icon: icon
                })
            });
            items.push({
                id: "newProject",
                name: "Nouveau Projet",
                path: "#",
                icon: "add_box"
            });
            return items
        },
        /****************************
         * renvoie true si toutes les conditions a remplir pour supprimer le compte utilisateur sont réunies :
         * ------> membre d'aucun projet
         * ------> pas d'invitations en cours
         * @returns {*|boolean}
         */
        isDeletable() {
            let isWaitingInvitations = false;
            this.profile.invitations.forEach((invitation) => {
                if (invitation.status === "waiting") {
                    isWaitingInvitations = true
                }
            })
            return this.profile.projects.length === 0 && !isWaitingInvitations
        }
    },
    meteorMethods: {}
});

if (Meteor.isServer) {
    User.extend({
        fields: {
            services: {
                type: Object,
                optional: true
            }
        }
    });
}
export default User;