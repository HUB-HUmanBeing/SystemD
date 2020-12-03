import cryptoTools from "../cryptoTools";
import hubCrypto from "../hubCrypto";
import User from "../../../imports/classes/User";
import projectController from "./projectController";
import Projects from "../../../lib/collections/Projects";


const conversationController = {

    createNewConversation(project, usersToInvite, projectsToInvite, cb) {
        //on genere un password administrateur
        let adminPassword = cryptoTools.generateRandomPassword()


        //on genere une clef symetrique
        hubCrypto.generateNewConversationBrunchOfKeys(project ? project.public.asymPublicKey : Meteor.user().public.asymPublicKey, (conversationBrunchOfKeys) => {
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
                symEnc_userId: project ? "" : Meteor.userId(),
                symEnc_username: project ? project.name : Meteor.user().username,
                symEnc_projectId: project ? project._id : "",
                symEnc_joinAtTs: String(Date.now()),
                userSignature: cryptoTools.hash(newMemberId + Session.get(project ? 'currentProjectPrivateKey' : "stringifiedAsymPrivateKey"))
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
                        console.log(err)
                        //si tout va bien
                    } else {

                        let createdConversationId = res
                        //on crée le projet à ajouter du coté utilisateur
                        let unencryptedUserConversationToAdd = {
                            asymEnc_conversationId: createdConversationId,
                            asymEnc_conversationName: "",
                            asymEnc_memberId: newMemberId,
                            asymEnc_conversationSymKey: conversationBrunchOfKeys.stringifiedSymKey,
                            asymEnc_role: "admin",
                            asymEnc_adminPassword: adminPassword,
                            //ce dernier champ sera utile pour editer le user conversation depuis d'
                            hashedAdminSignature: cryptoTools.hash(newMemberId + adminPassword)

                        }
                        //on le chiffre
                        cryptoTools.encryptObject(unencryptedUserConversationToAdd, {publicKey: project ? project.public.asymPublicKey : Meteor.user().public.asymPublicKey}, (userConversationToAdd) => {
                            if (project) {
                                console.log("in")
                                //et on sauvegarde ce nouveau projet dans la liste des projets de l'utilisateur
                                project.callMethod('addConversation', projectController.getAuthInfo(project._id), userConversationToAdd, (err, res) => {
                                    if (err) {
                                        console.log(err)
                                        //si tout est bon
                                    } else {
                                        //on redirige
                                        if (usersToInvite.length == 0 && projectsToInvite.length == 0) {
                                            FlowRouter.go('project' + project._id + '/messenger?conversationId=' + createdConversationId + "&addMembers=true")
                                            //on referme le loader
                                            cb()
                                        } else {
                                            this.inviteMemberToConversation(createdConversationId, usersToInvite, projectsToInvite, () => {
                                                FlowRouter.go('project' + project._id + '/messenger?conversationId=' + createdConversationId)
                                                cb()
                                            })
                                        }

                                    }
                                })
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
    },
    getAuthInfo(convId) {

    },
    initializeConversationList(instance) {
        this.decryptUserConversationList(instance, (decryptedUserConversationList) => {
            let conversationsParams = []
            console.log(decryptedUserConversationList)
            decryptedUserConversationList.forEach((conv) => {
                conversationsParams.push({
                    id: conv.asymEnc_conversationId,
                    authInfo: {
                        memberId: conv.asymEnc_memberId,
                        userSignature: cryptoTools.hash(conv.asymEnc_memberId + Session.get(instance.project ? 'currentProjectPrivateKey' : "stringifiedAsymPrivateKey"))
                    }
                })
            })
            instance.autorun(() => {
                let limit = instance.limit.get()
                Meteor.subscribe('conversationList', conversationsParams, limit, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("gagné")
                    }
                })
            })
        })
    },
    decryptUserConversationList(instance, cb) {
        instance.autorun(() => {
            let conversationList = []
            if (instance.project && Projects.findOne(instance.project._id)) {

                conversationList = instance.project.private.conversations
                cryptoTools.decryptArrayOfObject(conversationList,
                    {privateKey: Session.get('currentProjectPrivateKey')},
                    (decryptedConversations) => {
                        cb(decryptedConversations)
                    })
            } else if (Meteor.users.findOne(Meteor.userId()) && User.findOne(Meteor.userId())) {
                conversationList = User.findOne(Meteor.userId()).private.conversations

                cryptoTools.decryptArrayOfObject(conversationList,
                    {privateKey: Session.get('stringifiedAsymPrivateKey')},
                    (decryptedConversations) => {
                        cb(decryptedConversations)
                    })

            }
        })

    }
}
export default conversationController
