import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import ShortenedEntity from '/imports/classes/ShortendEntity';
import Conversation from '/imports/classes/Conversation';

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
            if(shortendCreator.isProject){
                let projectCreator = Project.findOne({_id : shortendCreator.speaker_id})
                check(projectCreator.isAdmin(Meteor.userId()))
            }else{
                check(shortendCreator.speaker_id, Meteor.userId())
            }

            check(shortendOtherSpeaker, ShortenedEntity)
            check(brunchOfKeys, Object)
            check(brunchOfKeys.vector, String)
            check(brunchOfKeys.encryptedConversationKeyForCreator, String)
            check(brunchOfKeys.encryptedConversationKeyForOtherSpeaker, String)
            //puis on sauvegarde la conversation encore vide pour recuperer son Id
            this.save((err,conversation_id)=>{
                if(err){
                    console.log(err)
                }else{//si tout se passe bien
                    //on cree une variable dans laquelle sera stockée notre user ou notre projet
                    let otherSpeaker
                    //on rempli notre objet a pusher dans notre projet/user.conversations
                    let entitySideConversation = {
                        conversation_id: conversation_id,
                        vector : brunchOfKeys.vector,
                        otherSpeakers  : [],
                        encryptedConversationKey : brunchOfKeys.encryptedConversationKeyForOtherSpeaker
                    }
                    entitySideConversation.otherSpeakers.push(shortendCreator)//on ajoute aussi un speaker a la conversation
                    //si c'est un projet
                    if(shortendOtherSpeaker.isProject){
                        //on le recupere
                        otherSpeaker =  Project.findOne({_id :shortendOtherSpeaker.speaker_id })
                        //et on push au bon endroit
                        otherSpeaker.conversations.push(entitySideConversation)
                    }else{
                        //si cest un user, on fait quasiment pareil
                        otherSpeaker =  User.findOne({_id :shortendOtherSpeaker.speaker_id })
                        otherSpeaker.profile.conversations.push(entitySideConversation)
                    }
                    //puis on sauvegarde
                    otherSpeaker.save((err)=>{
                        if(err){
                            console.log(err)
                        }else{
                            //et on fait pareil pour l'autre speaker de la conversation
                            let Creator

                            let entitySideConversation = {
                                conversation_id: conversation_id,
                                vector : brunchOfKeys.vector,
                                otherSpeakers  : [],
                                encryptedConversationKey : brunchOfKeys.encryptedConversationKeyForOtherSpeaker
                            }
                            entitySideConversation.otherSpeakers.push(shortendOtherSpeaker)
                            if(shortendCreator.isProject){
                                Creator =  Project.findOne({_id :shortendCreator.speaker_id })

                                Creator.conversations.push(entitySideConversation)
                            }else{
                                Creator =  User.findOne({_id :shortendCreator.speaker_id })
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
        newMessage(encryptedMessage, otherSpeakers) {
            check(encryptedMessage, String)
            check(otherSpeakers, Array)
            this.messages.unshift({
                content : encryptedMessage,
                speakerId : Meteor.userId()
            })
            this.save((err)=>{
                if(!err){
                    otherSpeakers.forEach((otherSpeaker)=>{
                        check(otherSpeaker, ShortenedEntity)
                        if(otherSpeaker.isProject){
                            let project = Project.findOne({_id : otherSpeaker.speaker_id})
                            project.conversations.forEach((conv,i)=>{
                                if(conv.conversation_id === this._id){
                                    project.conversations[i].unreadMessage ++
                                }
                            })
                            project.save()
                        }else{
                            let user = User.findOne({_id : otherSpeaker.speaker_id})
                            user.profile.conversations.forEach((conv,i)=>{
                                if(conv.conversation_id === this._id){
                                    user.profile.conversations[i].unreadMessage ++
                                }
                            })
                            user.save()
                        }
                    })
                }
            })
        }
    }
})