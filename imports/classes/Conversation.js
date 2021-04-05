import {Class} from 'meteor/jagi:astronomy';
import Conversations from "/lib/collections/Conversations";

const ConversationInvitation = Class.create({
    name: "ConversationInvitation",
    fields: {
        invitationId: {
            type: String
        },
        symEnc_invitationPassword: {
            type: String
        }
    }
})

const ConversationMember = Class.create({
    name: "ConversationMember",
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
            type: String,
            optional: true
        },
        symEnc_projectId: {
            type: String,
            optional: true
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





const Conversation = Class.create({
    name: 'Conversation',
    collection: Conversations,
    fields: {
        symEnc_name: {
            type: String,

            optional:true,
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            },
            index:true
        },
        lastActivity: {
            type: Date,
            default: function () {
                return new Date()
            },
            index:true
        },
        hashedSymKey: {
            type: String,
        },
        hashedAdminPassword: {
            type: String,
        },
        members: {
            type: [ConversationMember],
            default: function () {
                return [];
            }
        },
        invitations: {
            type: [ConversationInvitation],
            default: function () {
                return [];
            }
        },
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

export default Conversation
