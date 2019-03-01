import cryptoTools from "./cryptoTools";
import Invitation from "../../imports/classes/Invitation";
import Project from "../../imports/classes/Project";

const inviteController = {
    getCurrentInvitAndProject(invitationId, password,callback) {
        this.getCurrentInvit(invitationId, password,(invitation) => {
            if(invitation){
                Meteor.subscribe("ProjectPublic", invitation.projectId, (err) => {
                    if (!err) {
                            callback(invitation, Project.findOne(invitation.projectId))
                    } else {
                        console.log(err)
                    }
                })
            }else{
                callback(false, false)
            }
        })
    },

    getCurrentInvit(invitationId, password,callback) {
        this.subscribeAndGet(invitationId, password, (invitation) => {
            if(invitation){
                this.decryptInvitation(invitation, password, (decryptedInvitation) => {
                    callback(decryptedInvitation)
                })
            }else{
                callback(false)
            }
        })
    },
    subscribeAndGet(invitationId, password, callback) {
        Meteor.subscribe('invitation', invitationId, cryptoTools.hash(password), (err) => {
            if (err) {
                console.log(err)
            } else {
                //on déchiffre le message d'invitation
                let invitation = Invitation.findOne(invitationId)
                callback(invitation)
            }
        })
    },
    decryptInvitation(invitation, password, callback) {
        cryptoTools.generateSimKeyFromPassphrase(password, (invitationSymKey) => {
              cryptoTools.sim_decrypt_data(cryptoTools.convertStringToArrayBufferView(invitation.symEnc_projectSymKey), invitationSymKey, invitation.projectId, (projectSymKey) => {
                    invitation.projectSymKey = projectSymKey
                    callback(invitation)
                })
        })

    },
    acceptInvitation(invitation,project,  password, callback){
        Tracker.autorun(()=>{
            if(Meteor.userId() ){
                let newMember = invitation.invitationMembers[0]
                let unencryptedNewMember ={
                    memberId : newMember.memberId,
                    symEnc_userId: Meteor.userId(),
                    symEnc_username: Meteor.user().username,
                    symEnc_joinAtTs: Date.now(),
                    userSignature: cryptoTools.hash(newMember.memberId +Session.get('stringifiedAsymPrivateKey') )
                }
                let unencryptedUserProjectToAdd = {
                    asymEnc_projectId: project._id,
                    asymEnc_projectName: project.name,
                    asymEnc_memberId: newMember.memberId,
                    asymEnc_projectSymKey: invitation.projectSymKey,
                    asymEnc_role: "member",
                    asymEnc_adminPassword:cryptoTools.generateRandomPassword(),
                    hashedAdminSignature: newMember.hashedAdminSignature
                }
                cryptoTools.importSymKey(invitation.projectSymKey, project.name, (symKey)=>{
                    cryptoTools.encryptObject(unencryptedNewMember, {symKey: symKey, vector: project.name}, (encryptedNewMember)=>{
                        cryptoTools.importPublicKey(Meteor.user().public.asymPublicKey, (publicKey)=>{
                            cryptoTools.encryptObject(unencryptedUserProjectToAdd, {publicKey: publicKey}, (encryptedUserProjectToAdd)=>{
                                console.log(encryptedUserProjectToAdd, encryptedNewMember)
                                invitation.callMethod('acceptInvitation', cryptoTools.hash(password), encryptedUserProjectToAdd, encryptedNewMember, (err, res)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        callback()
                                    }
                                })
                            })
                        })
                    })
                })
            }

        })

    },
    acceptInvitationId(invitationId,  password, callback){
        this.getCurrentInvitAndProject(invitationId,password, (invitation, project)=>{
            this.acceptInvitation(invitation,password, callback)
        })
    }

}
export default inviteController
