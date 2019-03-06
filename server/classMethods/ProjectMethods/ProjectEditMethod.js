import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";


Project.extend({
    meteorMethods: {

        /************
         * renvoie le lien pré-signé vers un avatar projet
         * @returns {Promise<*>}
         */
        async getUpdateProjectAvatarUrl(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)

            const result = await minioTools.client.presignedPutObject('project-avatars', currentProject._id + '.jpg')
            return result
        },
        /***************
         * détruit l'avatar du projet
         * @returns {Promise<*>}
         */
        async deleteAvatar(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            const result = await minioTools.client.removeObject('project-avatars', currentProject._id + '.jpg')
            return result
        },
        /**********************
         * methode d'edition des infos du projet
         * @param authInfo
         * @param text
         * @returns {*|*|*|*|*|*|void}
         */
        editDescription(authInfo, text) {
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)

            check(text, String)
            currentProject.public.description = text
            return currentProject.save()

        },
        /**************
         * Supression d'un projet
         * @param authInfo
         * @param userProjectIndex
         */
        deleteProject(authInfo, userProjectIndex) {
            check(Meteor.userId(), String)
            check(authInfo, {memberId: String, userSignature: String})
            check(userProjectIndex, Number)
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            check(currentProject.isDeletable(), true)
            let currentUser = User.findOne(Meteor.userId())
            currentUser.private.projects.splice(userProjectIndex, 1)
            currentProject.remove((err) => {
                if (err) {
                    console.log(err)
                }
                currentUser.save()
            })

        },
    }
})
