import User from '/imports/classes/User';
import {check} from "meteor/check";

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
                asymEnc_role: String,
                hashedAdminSignature:  String

            })
            check(this._id , Meteor.userId())
            this.private.projects.push(userProjectToAdd)
            return this.save()
        }
    }
});
