//sont définis ici la classe user et sa sous classe profile
import {Class} from 'meteor/jagi:astronomy';
import Location from '/imports/classes/Location'
// import Project from '/imports/classes/Project'

const UserInvitation = Class.create({
    name: 'UserInvitation',
    fields: {
        project_id: String,
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
                return '/images/icon/user_icon.png'
            },
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
        invitations: {
            type: [UserInvitation],
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
            type: [String],
            default: function () {
                return [];
            }
        },
        username: {
            type: String,
            immutable: true
        },
        services: {
            type :Object,
            optional : true
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            },
            immutable: true
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
            let currentUserLocation = Meteor.user().profile.location;
            if(this.profile.location.lonLat && currentUserLocation.lonLat){
                let distance = new Haversine(
                    this.profile.location.lonLat[1],
                    this.profile.location.lonLat[0],
                    currentUserLocation.lonLat[1],
                    currentUserLocation.lonLat[0]);

                return parseInt(distance.kilometers)
            }else{
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
                items.push({
                    id: project.project_id,
                    name: project.name,
                    path: "projectMainPage",
                    pathData : { _id : project.project_id}
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
    },
    meteorMethods: {


    }
});

export default User;