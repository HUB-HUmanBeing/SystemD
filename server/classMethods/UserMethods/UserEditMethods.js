import User from '/imports/classes/User';
import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import NotifPush from "../../../imports/NotifPush";
import cryptoServer from "../../../imports/cryptoServer";


User.extend({
    meteorMethods: {
        /**********
         * modification de la description utilisateur
         * @param encryptedAsymPrivateKey
         */
        updateEncryptedAsymPrivateKey(encryptedAsymPrivateKey,salt, pinCode) {
            check(encryptedAsymPrivateKey, String)
            check(this._id, Meteor.userId())
            check(salt,String)
            check(pinCode, String)
            if(salt){
                this.public.securized = true
                this.salt=salt
                this.hashedPinCode = cryptoServer.heavyHash(pinCode)
            }else{
                this.public.securized = false
                delete this.salt
                delete this.hashedPinCode
            }
            this.private.encryptedAsymPrivateKey = encryptedAsymPrivateKey
            this.save()
        },
        /************
         * renvoie le lien pré-signé vers un avatar utilisateur
         * @returns {Promise<*>}
         */
        async getUpdateAvatarUrl() {
            check(this._id, Meteor.userId())
            let currentUser =User.findOne(Meteor.userId())
            currentUser.public.avatar = true
            currentUser.save()
            const result = await minioTools.client.presignedPutObject('user-avatars', Meteor.userId() + '.jpg')
            return result
        },
        /***************
         * détruit l'avatar de l'utilisateur courant
         * @returns {Promise<*>}
         */
        async deleteAvatar() {
            check(this._id, Meteor.userId())
            let currentUser =User.findOne(Meteor.userId())
                currentUser.public.avatar = false
            currentUser.save()
            const result = await minioTools.client.removeObject('user-avatars', Meteor.userId() + '.jpg')
            return result
        },
        changeLang(language){
            check(this._id, Meteor.userId())
            check(language, String)
            //NotifPush.sendNotif([Meteor.userId()], "acceptedInvitation")
            this.public.language = language
            return this.save()
        }

    }
})
