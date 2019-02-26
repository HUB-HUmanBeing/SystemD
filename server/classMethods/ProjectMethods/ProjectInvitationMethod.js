import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import Invitation from "../../../imports/classes/Invitation";
import cryptoServer from "../../../imports/cryptoServer";


Project.extend({
    meteorMethods: {
        async createInvitation(authInfo, invitationParams,symEnc_invitationPassword) {
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            check(invitationParams, {
                projectId: String,
                symEnc_message: Match.Maybe(String),
                hashedPassword: String,
                emittedBy: String,
                symEnc_projectSymKey: String,
                validityDuration: Number,
                remaining: Number
            })
            invitationParams.hashedPassword = cryptoServer.hash(invitationParams.hashedPassword)
            check(symEnc_invitationPassword, String)
            let invitation = new Invitation(invitationParams)
            let invitationId =invitation.save((err, invitationId) => {
                if (!err) {
                    currentProject.private.invitations.push({
                        invitationId: invitationId,
                        symEnc_invitationPassword: symEnc_invitationPassword
                        }
                    )
                    return currentProject.save()
                }else{
                    console.log(err)
                }
            })
            return invitationId

        }
    }
})
