//sont définis ici la classe user et sa sous classe profile
import {Class} from 'meteor/jagi:astronomy';
import Location from '/imports/classes/Location'

const UserProject = Class.create({
    name: 'UserProject',
    fields: {
        project_id : String,
        name : String,
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
            // validator: Validators.regexp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
            // ,
        },
        location: {
            type: Location,
            default: function () {
                return {}
            }
        },
        projects : {
            type : [UserProject],
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
        services: Object,
        createdAt: {
            type: Date,
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
                this.profile.location.lat,
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
        }
    },
    meteorMethods: {
        //modification de la description utilisateur
        updateProfileItem(key , value) {
            check(key, String);
            if(this._id === Meteor.userId()) {
                this.profile[key] = value;
                return this.save()
            }
        },
        //changement de la position de l'utilisateur
        updateSelfLocation(lat, lng, city, country) {
            if(this._id === Meteor.userId()){
                this.profile.location.lat = lat;
                this.profile.location.lng = lng;
                this.profile.location.city = city;
                this.profile.location.country = country;
                return this.save()
            }
        }

    }
});

export default User;