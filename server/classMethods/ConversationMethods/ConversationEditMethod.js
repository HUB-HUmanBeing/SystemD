import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";
import Topic from "../../../imports/classes/Topic";
import MapMarkers from "../../../lib/collections/MapMarkers";
import Invitations from "../../../lib/collections/Invitations";
import Activities from "../../../lib/collections/Activities";
import Topics from "../../../lib/collections/Topics";
import Publication from "../../../imports/classes/Publication";
import Publications from "../../../lib/collections/Publications";
import Comments from "../../../lib/collections/Comments";
import ProjectFiles from "../../../lib/collections/ProjectFiles";
import ProjectFile from "../../../imports/classes/ProjectFile";
import ProjectNotifications from "../../../imports/classes/ProjectNotification";
import Spreadsheets from "../../../lib/collections/Spreadsheets";

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
            currentProject.public.avatar = true
            currentProject.save()
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
            currentProject.public.avatar = false
            currentProject.save()
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
        deleteProject(authInfo, hashedAdminSignature) {
            check(Meteor.userId(), String)
            check(authInfo, {memberId: String, userSignature: String})
            check(hashedAdminSignature, String)
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            check(currentProject.isDeletable(), true)
            let currentUser = User.findOne(Meteor.userId())
            let found = false
            currentUser.private.projects.forEach((userProjet,i)=>{
                if(userProjet.hashedAdminSignature === hashedAdminSignature){
                    currentUser.private.projects.splice(i,  1)
                    found = true
                }
            })

            check(found, true)
            Topics.remove({projectId: currentProject._id})
            Comments.remove({projectId: currentProject._id})
            Publications.remove({projectId: currentProject._id})
            MapMarkers.remove({projectId: currentProject._id})
            Invitations.remove({projectId: currentProject._id})
            Activities.remove({projectId: currentProject._id})
            ProjectNotifications.remove({projectId: currentProject._id})
            Spreadsheets.remove({projectId: currentProject._id})
let files = ProjectFile.find({projectId: currentProject._id}).fetch()
            files.forEach(file=>{
                file.removeAndDeleteFile()
            })
            minioTools.client.removeObject('project-avatars', currentProject._id + '.jpg')
            currentProject.remove((err) => {
                if (err) {
                    console.log(err)
                }
                currentUser.save()
            })

        },
    }
})
