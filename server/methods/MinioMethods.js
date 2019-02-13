
import Minio from 'minio'
import {check} from "meteor/check";
import minioTools from "../../imports/minioTools";


Meteor.methods({

    async getMinioUploadUrl(fileName, bucketName) {
        check(fileName, String)
        check(bucketName, String)
        const result = await minioTools.client.presignedPutObject(bucketName, fileName)
        return result
    },
    async getMinioUserAvatarUrl(userId) {

        check(userId, String)

        const result = await minioTools.client.presignedGetObject('user-avatars', userId + '.jpg')
        return result
    },

});
