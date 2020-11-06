import {Class} from 'meteor/jagi:astronomy';
import Projects from "/lib/collections/Projects";

const ProjectInvitation = Class.create({
    name: "ProjectInvitation",
    fields: {
        invitationId: {
            type: String
        },
        symEnc_invitationPassword: {
            type: String
        }
    }
})

const ProjectMember = Class.create({
    name: "ProjectMember",
    fields: {
        memberId: {
            type: String
        },
        role: {
            type: String,
            default: function () {
                return "member";
            }
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
        invitedBy: {
            type: String,
            optional: true
        },
        // ca permet d'autentifier un membre sur le serveur: corespond a hashServer(hashClient(memberId + userPrivateKey)
        userSignature: {
            type: String
        }
    }
})

const ForumCategory = Class.create({
    name: 'ForumCategory',
    fields: {
        categoryId: String,
        symEnc_name: {
            type: String
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        membersToNotify: {
            type: [String],
            default: function () {
                return [];
            }
        },
        topicCount: {
            type: Number,
            default: function () {
                return 0
            }
        }
    }
})
const CloudFolder = Class.create({
    name: 'CloudFolder',
    fields: {
        folderId: String,
        symEnc_name: {
            type: String
        },
        createdBy:{
            type: String
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        parentFolderId: {
            type: String,
            default: function () {
                return "root"
            }
        },
    }
})
const Map = Class.create({
    name: "Map",
    fields: {
        zoomLevel: {
            type: Number,
            default: function () {
                return 6
            }
        },
        symEnc_center: {
            type: String,
            optional: true,
        },
        symEnc_mapProvider: {
            type: String,
            optional: true
        },
        symEncArr_colorLegend:{
            type: [String],
            default: function () {
                return []
            }
        }
    }
})

const Calendar = Class.create({
    name: "Calendar",
    fields: {
        defaultView: {
            type: String,
            default: function () {
                return "days"
            }
        },
        symEncArr_colorLegend:{
            type: [String],
            default: function () {
                return []
            }
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
        avatar: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        asymPublicKey: {
            type: String,
        }
    }
});

const ProjectPrivate = Class.create({
    name: 'ProjectPrivate',
    fields: {
        symEnc_asymPrivateKey: {
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
        invitations: {
            type: [ProjectInvitation],
            default: function () {
                return [];
            }
        },
        forumCategories: {
            type: [ForumCategory],
            default: function () {
                return [];
            }
        },
        cloudFolders: {
            type: [CloudFolder],
            default: function () {
                return [];
            }
        },
        mainTopicId: {
            type: String,
            optional: true
        },
        map: {
            type: Map,
            default: function () {
                return {};
            }
        },
        calendar: {
            type: Calendar,
            default: function () {
                return {};
            }
        },
        totalFilesSize:{
            type: Number,
            default: function () {
                return 0
            }
        },
        spreadsheetCount:{
            type: Number,
            default: function () {
                return 0
            }
        },
        padCount:{
            type: Number,
            default: function () {
                return 0
            }
        }
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
    helpers: {
        isMemberAllowedToQuit(memberId) {
            let adminCount = 0
            let currentMember
            this.private.members.forEach(member => {

                if (member.role === "admin") {
                    adminCount++
                }
                if (member.memberId === memberId) {
                    currentMember = member
                }
            })
            return (currentMember.role !== "admin" || adminCount >= 2)
        },
        isDeletable() {
            return this.private.members.length === 1
        },
        getAdminMemberIds() {
            let adminMemberIds = []
            this.private.members.forEach(member => {
                if (member.role === "admin") {
                    adminMemberIds.push(member.memberId)
                }
            })
            return adminMemberIds
        }
    }

});

export default Project
