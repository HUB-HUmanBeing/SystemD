import cryptoTools from "../cryptoTools";
import Invitation from "../../../imports/classes/Invitation";
import Project from "../../../imports/classes/Project";

/*************************************
 * Controlleur permettant de gerer la souscription à une invitation, au projet associé, et de gerer l'acceptation de l'invitation
 * @type {{acceptInvitation(*=, *, *=, *=): void, subscribeAndGet(*=, *=, *): void, getCurrentInvitAndProject(*=, *=, *=): void, decryptInvitation(*=, *=, *=): void, getCurrentInvit(*=, *=, *=): void, acceptInvitationId(*=, *=, *=): void}}
 */
const inviteController = {
    /**********************
     * renvoie l'invitation déchifrée et le projet associé pour un id d'invitation+ password
     * @param invitationId
     * @param password
     * @param callback(invitation, project)
     */
    getCurrentInvitAndProject(invitationId, password, callback) {
        this.getCurrentInvit(invitationId, password, (invitation) => {
            if (invitation) {
                Meteor.subscribe("ProjectPublic", invitation.projectId, (err) => {
                    if (!err) {
                        callback(invitation, Project.findOne(invitation.projectId))
                    } else {
                        console.log(err)
                    }
                })
            } else {
                callback(false, false)
            }
        })
    },

    /*************************
     * récupere l'invitation déchiffrée
     * @param invitationId
     * @param password
     * @param callback(invitation)
     */
    getCurrentInvit(invitationId, password, callback) {
        this.subscribeAndGet(invitationId, password, (invitation) => {
            if (invitation) {
                this.decryptInvitation(invitation, password, (decryptedInvitation) => {
                    callback(decryptedInvitation)
                })
            } else {
                callback(false)
            }
        })
    },
    /**************************
     * recupere l'invitation (sans la déchiffrer
     * @param invitationId
     * @param password
     * @param callback
     */
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
    /*************************
     * déchiffre une invitation donnée
     * @param invitation
     * @param password
     * @param callback
     */
    decryptInvitation(invitation, password, callback) {
        cryptoTools.generateSimKeyFromPassphrase(password, (invitationSymKey) => {
            cryptoTools.sim_decrypt_data(invitation.symEnc_projectSymKey, invitationSymKey, (projectSymKey) => {
                invitation.projectSymKey = projectSymKey
                callback(invitation)
            })
        })

    },
    /****************************
     * gere l'acceptation d'une invitation
     * @param invitation
     * @param project
     * @param password
     * @param callback
     */
    acceptInvitation(invitation, project, password, callback) {
        //on recupere le premier membre de l'invitation
        let newMember = invitation.invitationMembers[0]
        //on genere notre objet nouveau membre
        let unencryptedNewMember = {
            memberId: newMember.memberId,
            symEnc_userId: Meteor.userId(),
            invitedBy: invitation.emittedBy,
            symEnc_username: Meteor.user().username,
            symEnc_joinAtTs: String(Date.now()),
            userSignature: cryptoTools.hash(newMember.memberId + Session.get('stringifiedAsymPrivateKey'))
        }
        //on genere notre user project à ajouter
        let unencryptedUserProjectToAdd = {
            asymEnc_projectId: project._id,
            asymEnc_projectName: project.name,
            asymEnc_memberId: newMember.memberId,
            asymEnc_projectSymKey: invitation.projectSymKey,
            asymEnc_role: "member",
            asymEnc_adminPassword: cryptoTools.generateRandomPassword(),
            hashedAdminSignature: newMember.hashedAdminSignature
        }
        //on chiffre le membre a ajouter avec la clef projet
            cryptoTools.encryptObject(unencryptedNewMember, {
                symKey: invitation.projectSymKey
            }, (encryptedNewMember) => {
                //on chiffre l'userProject à ajouter avec la clef publique de notre utilisateur

                cryptoTools.encryptObject(unencryptedUserProjectToAdd, {publicKey: Meteor.user().public.asymPublicKey}, (encryptedUserProjectToAdd) => {
                    //on call la methode d'acceptation d'invitation
                    invitation.callMethod('acceptInvitation', cryptoTools.hash(password), encryptedUserProjectToAdd, encryptedNewMember, (err, res) => {
                        if (err) {
                            console.log(err)
                        } else {
                            //et on renvoie le callback
                            callback(project._id)
                        }
                    })
                })

            })
    },
    /***************************
     * idem à celle du dessus, mais va d'abord chercher l'invitation et la déchiffre avant de passer aux autres opérations
     * @param invitationId
     * @param password
     * @param callback
     */
    acceptInvitationId(invitationId, password, callback) {
        this.getCurrentInvitAndProject(invitationId, password, (invitation, project) => {
            let found = false
            Session.get("projects").forEach((currentProject)=>{
                if (currentProject.asymEnc_projectId == project._id){
                    found = true
                }
            })
            if(!found){
                this.acceptInvitation(invitation, project, password, callback)
            }else{
                callback(project._id)
            }

        })
    }

}
export default inviteController
