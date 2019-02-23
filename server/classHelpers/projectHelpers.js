import {check} from "meteor/check";
import Project from "/imports/classes/Project";
import cryptoServer from "/imports/cryptoServer";

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
                    if(cryptoServer.hash(authInfo.userSignature) === member.userSignature){
                        result = true
                    }
                }
            })
            return result
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
                    if(cryptoServer.hash(authInfo.userSignature) === member.userSignature){
                        result = member.role === "admin"
                    }
                }
            })
            return result
        }
    }
})
