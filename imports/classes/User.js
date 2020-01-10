//sont définis ici la classe user et sa sous classe profile
import {Class} from 'meteor/jagi:astronomy';

const ProjectUser = Class.create({
    name: 'ProjectUser',
    fields: {
        asymEnc_projectId: {
            type: String
        },
        asymEnc_memberId: {
            type: String
        },
        asymEnc_projectName: {
            type: String
        },
        asymEnc_projectSymKey: {
            type: String
        },
        asymEnc_role: {
            type: String,
        },
        asymEnc_adminPassword: {
            type: String
        },
        //permet d'authentifier un admin du projet hashServer(hashclient(memberId + adminPassword))
        hashedAdminSignature: {
            type: String
        }
    },
});
const Profile = Class.create({
    name: 'Profile',
    fields: {},

});
const PublicUser = Class.create({
    name: 'PublicUser',
    fields: {
        asymPublicKey: String,
        avatar: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        language: {
            type: String,
            optional: true
        },
    },

});

const pushSubscription = Class.create({
    name: 'pushSubscription',
    fields: {
        navigatorFingerPrint: String,
        subscription: String
    }
})

const PrivateUser = Class.create({
    name: 'PrivateUser',
    fields: {
        encryptedAsymPrivateKey: String, //clef chifrée a partir du mot de passe
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        projects: {
            type: [ProjectUser],
            default: function () {
                return []
            }
        },
        tokens: {
            type: [String],
            default: function () {
                return []
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
        private: {
            type: PrivateUser,
            default: function () {
                return {};
            }
        },
        public: {
            type: PublicUser,
            default: function () {
                return {};
            }
        },
        profile: {
            type: Profile,
            default: function () {
                return {};
            }
        },
        projects: {
            type: [ProjectUser],
            default: function () {
                return [];
            }
        }
    },
    indexes: {},
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
