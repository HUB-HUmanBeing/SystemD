
import Minio from 'minio'
import {check} from "meteor/check";
import minioTools from "../../imports/minioTools";
import Project from "../../imports/classes/Project";
import User from "../../imports/classes/User";


Meteor.methods({


    /**************
     * renvoie une url pré-signée vers le dossier des avatars utilisateurs
     * @param userId
     * @returns {Promise<*>}
     */
    async getMinioUserAvatarUrl(userId) {
        check(userId, String)

        if(User.findOne(userId).public.avatar){
            return await minioTools.client.presignedGetObject('user-avatars', userId + '.jpg')
        }else{
            return "noAvatar"
        }


    },
    async getMinioProjectAvatarUrl(projectId){
        check(projectId, String)
        if(Project.findOne(projectId).public.avatar){
            return await minioTools.client.presignedGetObject('project-avatars', projectId + '.jpg')
        }else{
            return "noAvatar"
        }

    }

});
