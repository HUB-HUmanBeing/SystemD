import {check} from "meteor/check";
import Conversation from "/imports/classes/Conversation";
import cryptoServer from "/imports/cryptoServer";


/***********************
 * on met ici les helpers de la classe projet dispo uniquement coté serveur
 */
Conversation.extend({
    helpers: {
        /****************
         * true si l'utilisateur est membre du projet
         * @param authInfo
         * @returns {boolean}
         */
        isMember(authInfo){
            check(authInfo , {
                memberId : String,
                userSignature: String
            })
            let result = false
            this.members.forEach(member=>{
                if(member.memberId === authInfo.memberId){
                    if(cryptoServer.compare(authInfo.userSignature,member.userSignature)){
                        result = true
                    }
                }
            })
            return result
        },
        isThisMember(authInfo, memberId){
            check(authInfo , {
                memberId : String,
                userSignature: String
            })
            let result = false
            this.members.forEach(member=>{
                if(member.memberId === authInfo.memberId){
                    if(cryptoServer.compare(authInfo.userSignature,member.userSignature)){
                        result = true
                    }
                }
            })
            return result && memberId===authInfo.memberId
        },
        /***************************
         * renvoie true si l'utilisateur est admin du projet
         * @param authInfo
         * @returns {boolean}
         */
        isAdmin(authInfo){
            check(authInfo , {
                memberId : String,
                userSignature: String
            })
            let result = false
            this.members.forEach(member=>{
                if(member.memberId === authInfo.memberId){
                    if(cryptoServer.compare(authInfo.userSignature, member.userSignature)){
                        result = member.role === "admin"
                    }
                }
            })
            return result
        }
    }
})
