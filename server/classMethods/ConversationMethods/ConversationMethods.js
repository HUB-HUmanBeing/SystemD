import {check} from "meteor/check";
import Conversation from "../../../imports/classes/Conversation";
import cryptoServer from "../../../imports/cryptoServer";
import minioTools from "../../../imports/minioTools";
import Topic from "../../../imports/classes/Topic";
import Project from "../../../imports/classes/Project";

/*********************************
 * METHODES DE LA COLLECTION USERS
 * les autres méthodes sont directement stockées dans la classe
 **************************/

Meteor.methods({

    createConversation( brunchOfKeys, firstMember) {


        check(brunchOfKeys, {
            hashedSymKey: String,
            hashedAdminPassword:String
        })
        check(firstMember, {
            memberId : String,
            role: String,
            symEnc_userId: String,
            symEnc_projectId: String,
            symEnc_username: String,
            symEnc_joinAtTs: String,
            userSignature: String
        })
        //on rehash coté serveur la signature utilisateur
        firstMember.userSignature = cryptoServer.hash(firstMember.userSignature)
        let newConversation = new Conversation()
        newConversation.hashedSymKey = brunchOfKeys.hashedSymKey
        newConversation.hashedAdminPassword = brunchOfKeys.hashedAdminPassword
        newConversation.lasActivity = new Date()
        newConversation.members.push(firstMember)
        return newConversation.save()

    },


})
