
import Minio from 'minio'
import {check} from "meteor/check";
import minioTools from "../../imports/minioTools";


Meteor.methods({


    /**************
     * renvoie une url pré-signée vers le dossier des avatars utilisateurs
     * @param userId
     * @returns {Promise<*>}
     */
    async getMinioUserAvatarUrl(userId) {
        check(userId, String)
        const result = await minioTools.client.presignedGetObject('user-avatars', userId + '.jpg')
        return result
    },

});
