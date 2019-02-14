
import Minio from 'minio'
import {check} from "meteor/check";
import minioTools from "../../imports/minioTools";


Meteor.methods({


    async getMinioUserAvatarUrl(userId) {

        check(userId, String)

        const result = await minioTools.client.presignedGetObject('user-avatars', userId + '.jpg')
        return result
    },

});
