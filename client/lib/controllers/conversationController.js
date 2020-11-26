import cryptoTools from "../cryptoTools";
import hubCrypto from "../hubCrypto";
import User from "../../../imports/classes/User";


const conversationController = {

    createNewConversation(projectId, usersToInvite, projectsToInvite, cb) {
        //on genere un password administrateur
        let adminPassword = cryptoTools.generateRandomPassword()
        if (projectId) {
            let currentProject = projectController.getCurrentUserProject(projectId)
        }

        //on genere une clef symetrique
        hubCrypto.generateNewConversationBrunchOfKeys(projectId ? currentProject.public.asymPublicKey : Meteor.user().public.asymPublicKey, (conversationBrunchOfKeys) => {
            //on prepare l'objet avec toutes les clef de conversation a envoyer dans la methode de création
            let brunchOfKeyToSend = {
                hashedSymKey: cryptoTools.hash(conversationBrunchOfKeys.stringifiedSymKey),
                hashedAdminPassword: cryptoTools.hash(adminPassword)
            }
            //on genere un nouveau membre pour le projet à partir des infos de l'utilisateur courant
            let newMemberId = cryptoTools.generateId()
            let uncryptedNewMember = {
                memberId: newMemberId,
                role: 'admin',
                symEnc_userId: projectId ? "" : Meteor.userId(),
                symEnc_username: projectId ? currentProject.asymEnc_projectName : Meteor.user().username,
                symEnc_projectId: projectId ? projectId : "",
                symEnc_joinAtTs: String(Date.now()),
                userSignature: cryptoTools.hash(newMemberId + Session.get('stringifiedAsymPrivateKey'))
            }
            //on prepare l'encryption param
            let encryptionParams = {
                symKey: conversationBrunchOfKeys.conversationKey
            }
            //on chiffre le tout avec notre super fonction
            cryptoTools.encryptObject(uncryptedNewMember, encryptionParams, (encryptedNewMember) => {
                //on crée le projet en base

                Meteor.call('createConversation', brunchOfKeyToSend, encryptedNewMember, (err, res) => {
                    if (err) {
                        console.log("inddddddddddddddddddddddddddddd")
                        console.log(err)
                        //si tout va bien
                    } else {

                        let createdConversationId = res
                        //on crée le projet à ajouter du coté utilisateur
                        let unencryptedUserConversationToAdd = {
                            asymEnc_conversationId: createdConversationId,
                            asymEnc_memberId: newMemberId,
                            asymEnc_conversationSymKey: conversationBrunchOfKeys.stringifiedSymKey,
                            asymEnc_role: "admin",
                            asymEnc_adminPassword: adminPassword,
                            //ce dernier champ sera utile pour editer le user conversation depuis d'
                            hashedAdminSignature: cryptoTools.hash(newMemberId + adminPassword)

                        }
                        //on le chiffre
                        cryptoTools.encryptObject(unencryptedUserConversationToAdd, {publicKey: projectId ? currentProject.public.asymPublicKey : Meteor.user().public.asymPublicKey}, (userConversationToAdd) => {
                            if (projectId) {

                            } else {
                                let currentUser = User.findOne(Meteor.userId())
                                //et on sauvegarde ce nouveau projet dans la liste des projets de l'utilisateur
                                currentUser.callMethod('addConversation', userConversationToAdd, (err, res) => {
                                    if (err) {
                                        console.log(err)
                                        //si tout est bon
                                    } else {
                                        //on redirige
                                        if (usersToInvite.length == 0 && projectsToInvite.length == 0) {
                                            FlowRouter.go('/messenger?conversationId=' + createdConversationId + "&addMembers=true")
                                            //on referme le loader
                                            cb()
                                        } else {
                                            this.inviteMemberToConversation(createdConversationId, usersToInvite, projectsToInvite, () => {
                                                FlowRouter.go('/messenger?conversationId=' + createdConversationId)
                                                cb()
                                            })
                                        }

                                    }
                                })
                            }

                        })
                    }
                })
            })
        })
    },
    inviteMemberToConversation(conversationId, usersToInvite, projectsToInvite, cb) {
        console.log("todo: enchainer sur inviter un utilisateur a rejoindre la conv")
    }
}
export default conversationController
