import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import ShortenedEntity from '/imports/classes/ShortendEntity';
import Conversation from '/imports/classes/Conversation';
import ConversationMessage from "../../../imports/classes/ConversationMessage";

/*********************
 * Methodes des commentaires de blog
 */
Conversation.extend({
    meteorMethods: {
        /******************************************
         * Methode de création d'une nouvelle conversation
         * @param shortendCreator
         * @param shortendOtherSpeaker
         * @param brunchOfKeys
         */
        newConversation(shortendCreator, shortendOtherSpeaker, brunchOfKeys) {
            //on commence par checker touts les arguments passés a la methode
            check(shortendCreator, ShortenedEntity)
            //on check qu'on est bien avec l'admin du projet ou le proprietaire du compte user
            if (shortendCreator.isProject) {
                let projectCreator = Project.findOne({_id: shortendCreator.speaker_id})
                check(projectCreator.isAdmin(Meteor.userId()))
            } else {
                check(shortendCreator.speaker_id, Meteor.userId())
            }

            check(shortendOtherSpeaker, ShortenedEntity)
            check(brunchOfKeys, Object)
            check(brunchOfKeys.vector, String)
            check(brunchOfKeys.encryptedConversationKeyForCreator, String)
            check(brunchOfKeys.encryptedConversationKeyForOtherSpeaker, String)
            //puis on sauvegarde la conversation encore vide pour recuperer son Id
            return this.save((err, conversation_id) => {
                if (err) {
                    console.log(err)
                } else {//si tout se passe bien
                    //on cree une variable dans laquelle sera stockée notre user ou notre projet
                    let otherSpeaker
                    //on rempli notre objet a pusher dans notre projet/user.conversations
                    let entitySideConversation = {
                        conversation_id: conversation_id,
                        vector: brunchOfKeys.vector,
                        otherSpeakers: [],
                        encryptedConversationKey: brunchOfKeys.encryptedConversationKeyForOtherSpeaker
                    }
                    entitySideConversation.otherSpeakers.push(shortendCreator)//on ajoute aussi un speaker a la conversation
                    //si c'est un projet
                    if (shortendOtherSpeaker.isProject) {
                        //on le recupere
                        otherSpeaker = Project.findOne({_id: shortendOtherSpeaker.speaker_id})
                        //et on push au bon endroit
                        otherSpeaker.conversations.push(entitySideConversation)
                    } else {
                        //si cest un user, on fait quasiment pareil
                        otherSpeaker = User.findOne({_id: shortendOtherSpeaker.speaker_id})
                        otherSpeaker.profile.conversations.push(entitySideConversation)
                    }
                    //puis on sauvegarde
                    otherSpeaker.save((err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            //et on fait pareil pour l'autre speaker de la conversation
                            let Creator

                            let entitySideConversation = {
                                conversation_id: conversation_id,
                                vector: brunchOfKeys.vector,
                                otherSpeakers: [],
                                encryptedConversationKey: brunchOfKeys.encryptedConversationKeyForCreator
                            }
                            entitySideConversation.otherSpeakers.push(shortendOtherSpeaker)
                            if (shortendCreator.isProject) {
                                Creator = Project.findOne({_id: shortendCreator.speaker_id})

                                Creator.conversations.push(entitySideConversation)
                            } else {
                                Creator = User.findOne({_id: shortendCreator.speaker_id})
                                Creator.profile.conversations.push(entitySideConversation)
                            }
                            //on le sauvegarde
                            Creator.save()
                            //et on renvoie l'id de la conversation pour pouvoir l'ouvrir juste apres
                            return conversation_id
                        }

                    })

                }
            })
        },
        newMessage(convId, encryptedMessage, otherSpeakers) {
            //on commence par checker les arguments
            check(encryptedMessage, String)
            check(otherSpeakers, Array)
            check(convId, String)
            //on push le message en haut du tableau des nouveaux messages
            message = new ConversationMessage()

            message.conversation_id = convId
            message.content = encryptedMessage
            message.speakerId = Meteor.userId()


            //puis on l'enregistre
            message.save((err) => {
                if (!err) {
                    //si ya pas d'erreur, on viens, pour chacuns des membres de la conversation
                    otherSpeakers.forEach((otherSpeaker) => {
                        //verifier le type
                        check(otherSpeaker.speaker_id, String)
                        check(otherSpeaker.isProject, Boolean)
                        check(otherSpeaker.imgUrl, String)
                        check(otherSpeaker.name, String)
                        //si c'est un projet
                        if (otherSpeaker.isProject) {
                            //on viens recuperer le projet
                            let project = Project.findOne({_id: otherSpeaker.speaker_id})
                            //puis on viens retrouver sa conversation
                            project.conversations.forEach((conv, i) => {
                                if (conv.conversation_id === convId) {
                                    //et on rajoute 1 message non lu
                                    project.conversations[i].unreadMessage++
                                }
                            })
                            //et on sauvegarde
                            project.save()
                        } else {//si c'est un utilisateur, on fait la meme manip
                            let user = User.findOne({_id: otherSpeaker.speaker_id})
                            user.profile.conversations.forEach((conv, i) => {
                                if (conv.conversation_id === convId) {
                                    user.profile.conversations[i].unreadMessage++
                                }
                            })
                            user.save()
                        }
                    })
                } else {
                    console.log(err)
                }
            })
        }
    }
})