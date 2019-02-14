import User from '/imports/classes/User';
import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";


User.extend({
    meteorMethods: {
//modification de la description utilisateur
        updateEncryptedAsymPrivateKey(encryptedAsymPrivateKey) {
            check(encryptedAsymPrivateKey, String)
            check(this._id, Meteor.userId())
            this.private.encryptedAsymPrivateKey = encryptedAsymPrivateKey
            this.save()
        },
        async getUpdateAvatarUrl() {
            const result = await minioTools.client.presignedPutObject('user-avatars', Meteor.userId() + '.jpg')
            return result
        },
        async deleteAvatar() {
            const result = await minioTools.client.removeObject('user-avatars', Meteor.userId() + '.jpg')
            return result
        }

    }
})
