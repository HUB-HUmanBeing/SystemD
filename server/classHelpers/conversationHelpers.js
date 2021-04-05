import {check} from "meteor/check";
import Project from "/imports/classes/Project";
import cryptoServer from "/imports/cryptoServer";
import Topic from "../../imports/classes/Topic";
import ProjectFile from "../../imports/classes/ProjectFile";

/***********************
 * on met ici les helpers de la classe projet dispo uniquement coté serveur
 */
Project.extend({
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
            this.private.members.forEach(member=>{
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
            this.private.members.forEach(member=>{
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
            this.private.members.forEach(member=>{
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
