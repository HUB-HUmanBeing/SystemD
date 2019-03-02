import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import Invitation from "../../../imports/classes/Invitation";
import cryptoServer from "../../../imports/cryptoServer";


Project.extend({
    meteorMethods: {
        /*******************
         * methode de génération d'invitation
         * @param authInfo
         * @param invitationParams
         * @param symEnc_invitationPassword
         * @returns {Promise<*|*|*|void>}
         */
        async createInvitation(authInfo, invitationParams, symEnc_invitationPassword) {
            //on check les parametres et on vérifie que l'utilisateur courrant est admin du projet
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            check(invitationParams, {
                projectId: String,
                hashedPassword: String,
                projectName: String,
                emittedBy: String,
                symEnc_projectSymKey: String,
                validityDuration: Number,
                remaining: Number,
                invitationMembers : [{
                    memberId: String,
                    hashedAdminSignature: String
                }]
            })
            //on hash le password
            invitationParams.hashedPassword = cryptoServer.hash(invitationParams.hashedPassword)
            check(symEnc_invitationPassword, String)
            //on crée l'invitation
            let invitation = new Invitation(invitationParams)
            //on la sauvegarde
            let invitationId = invitation.save((err, invitationId) => {
                if (!err) {
                    //si tout va bien, on sauvegarde aussi l'invitation coté projet en lui ajoutant la clef d'invitation chiffrée avec la clef projet
                    currentProject.private.invitations.push({
                            invitationId: invitationId,
                            symEnc_invitationPassword: symEnc_invitationPassword
                        }
                    )
                    return currentProject.save()
                } else {
                    console.log(err)
                }
            })
            return invitationId
        },
        async deleteInvitation(authInfo, invitationId) {
            //on check les parametres et on vérifie que l'utilisateur courrant est admin du projet
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            check(invitationId, String)

            let invitation
            currentProject.private.invitations.forEach((invit, i) => {
                if (invit.invitationId === invitationId) {
                    currentProject.private.invitations.splice(i, 1)
                    invitation = Invitation.findOne(invitationId)
                }
            })
            if(invitation){
               return invitation.remove((err, result) => {
                    if (!err) {
                       return currentProject.save()
                    }
                })
            }

        }
    }
})
