import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import cryptoServer from "../../../imports/cryptoServer";

Project.extend({
    meteorMethods: {
        addConversation(authInfo, userConversationToAdd) {
            check(authInfo, {memberId: String, userSignature: String})

            check(userConversationToAdd, {
                asymEnc_conversationId: String,
                asymEnc_conversationName: String,
                asymEnc_conversationSymKey: String,
                asymEnc_memberId: String,
                asymEnc_role: String,
                asymEnc_adminPassword: String,
                hashedAdminSignature: String

            })
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            userConversationToAdd.hashedAdminSignature = cryptoServer.hash(userConversationToAdd.hashedAdminSignature)
            currentProject.private.conversations.unshift(userConversationToAdd)
            return currentProject.save()
        },
    }
})
