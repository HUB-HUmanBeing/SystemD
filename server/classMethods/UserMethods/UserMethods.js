import User from '/imports/classes/User';
import {check} from "meteor/check";
import cryptoServer from "../../../imports/cryptoServer";
import * as randomPassword from "secure-random-password";
import Hashes from "jshashes";

User.extend({
    meteorMethods: {
        /****************
         * methode d'ajout d'un projet a la liste des projet d'un utilisateur
         * @param userProjectToAdd
         * @returns {*|*|*|*|*|*|void}
         */
        addUserProject(userProjectToAdd){
            check(userProjectToAdd,{
                asymEnc_projectId : String,
                asymEnc_projectName: String,
                asymEnc_projectSymKey: String,
                asymEnc_memberId: String,
                asymEnc_role: String,
                asymEnc_adminPassword:String,
                hashedAdminSignature:  String,
                securized:Boolean

            })

            userProjectToAdd.hashedAdminSignature = cryptoServer.hash(userProjectToAdd.hashedAdminSignature)
            check(this._id , Meteor.userId())
            this.private.projects.unshift(userProjectToAdd)
            return this.save()
        },
        getPinCodeHash(password,pinCode ){
            let currentUser = User.findOne(Meteor.userId())
            check(pinCode, String)
            check(password, String)
            if(!currentUser.private.blockedUntil || currentUser.private.blockedUntil< new Date()){
                if(cryptoServer.compare(pinCode,currentUser.hashedPinCode)){
                    let salt = currentUser.salt
                    currentUser.private.leftPinCodeTentatives = 2
                    delete currentUser.private.blockedUntil
                    currentUser.save()
                    return new Hashes.SHA512().b64(password + pinCode + salt+Meteor.settings.serverSalt)
                }else{
                    currentUser.private.leftPinCodeTentatives --
                    if(currentUser.private.leftPinCodeTentatives<0){
                        let date = new Date();
                        date.setDate(date.getDate() + 2);
                        currentUser.private.blockedUntil = date
                        currentUser.private.leftPinCodeTentatives = 2
                    }
                    console.log(currentUser.private.leftPinCodeTentatives)
                    currentUser.save()
                    return false
                }
            }else{
                console.log("blocked")
                return false
            }

        }
    }
});
