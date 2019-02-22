import {check} from "meteor/check";
import Project from "/imports/classes/Project";
import cryptoServer from "/imports/cryptoServer";


Project.extend({
    helpers: {
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
