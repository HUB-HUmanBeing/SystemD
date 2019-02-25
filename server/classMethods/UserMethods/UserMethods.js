import User from '/imports/classes/User';
import {check} from "meteor/check";
import cryptoServer from "../../../imports/cryptoServer";

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
                hashedAdminSignature:  String

            })
            userProjectToAdd.hashedAdminSignature = cryptoServer.hash(userProjectToAdd.hashedAdminSignature)
            check(this._id , Meteor.userId())
            this.private.projects.unshift(userProjectToAdd)
            return this.save()
        }
    }
});
