import {Class} from 'meteor/jagi:astronomy';
import Projects from "/lib/collections/Project";

const ProjectMember = Class.create({
    name: "ProjectMember",
    fields: {
        memberId: {
            type: String
        },
        role: {
            type: String,
        },
        symEnc_username: {
            type: String
        },
        symEnc_userId: {
            type: String
        },
        symEnc_joinAtTs: {
            type: String
        },
        userSignature: {
            type: String
        }
    }
})
const ProjectPublic = Class.create({
    name: 'ProjectPublic',
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
        asymPublicKey: {
            type: String,
        }
    }
});

const ProjectPrivate = Class.create({
    name: 'ProjectPrivate',
    fields: {
        symEnc_AsymPrivateKey: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        hashedSymKey: {
            type: String,
        },
        hashedAdminPassword: {
            type: String,
        },
        members: {
            type: [ProjectMember],
            default: function () {
                return [];
            }
        },

    }
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
                    param: 50
                },
                {
                    type: 'minLength',
                    param: 4,
                    message: 'Project name is too short'
                }
            ],
            index: 'text'
        },


        public: {
            type: ProjectPublic,
            default: function () {
                return {};
            }
        },
        private: {
            type: ProjectPrivate,
            default: function () {
                return {};
            }
        }
    },
    helpers: {}

});

export default Project
