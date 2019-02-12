import User from '/imports/classes/User';
import {check} from "meteor/check";


User.extend({
    meteorMethods: {
//modification de la description utilisateur
        updateEncryptedAsymPrivateKey(encryptedAsymPrivateKey){
            check(encryptedAsymPrivateKey, String)
            check(this._id, Meteor.userId())
            this.private.encryptedAsymPrivateKey =encryptedAsymPrivateKey
            this.save()
        },

    }
})
