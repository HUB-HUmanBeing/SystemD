//sont définis ici la classe user et sa sous classe profile
import {Class} from 'meteor/jagi:astronomy';


const Profile = Class.create({
    name: 'Profile',
    fields: {

    },

});
const Public = Class.create({
    name: 'Public',
    fields: {
        asymPublicKey: String,

    },

});
const Private = Class.create({
    name: 'Private',
    fields: {
        encryptedAsymPrivateKey: String, //clef chifrée a partir du mot de passe
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
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
        private:{
            type: Private,
            default: function () {
                return {};
            }
        },
        public:{
            type: Public,
            default: function () {
                return {};
            }
        },
        profile: {
            type: Profile,
            default: function () {
                return {};
            }
        }
    },
    indexes: {
    },
    helpers: {}
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
