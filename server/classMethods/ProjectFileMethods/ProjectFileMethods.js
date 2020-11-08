import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Invitation from "../../../imports/classes/Invitation";
import cryptoServer from "../../../imports/cryptoServer";
import User from "../../../imports/classes/User";
import ProjectNotification from "../../../imports/classes/ProjectNotification";
import ProjectFile from "../../../imports/classes/ProjectFile";
import minioTools from "../../../imports/minioTools";


ProjectFile.extend({
    meteorMethods: {
        async newProjectFile(authInfo, projectFileParams) {
            check(authInfo, {memberId: String, userSignature: String})
            check(projectFileParams, {
                symEnc_fileName: String,
                size: Number,
                symEnc_mimeType: String,
                projectId: String,
                parentFolderId: String
            })
            let projectFilesSize = Project.findOne(projectFileParams.projectId).private.totalFilesSize
            if (((projectFileParams.size + projectFilesSize) < Meteor.settings.public.maxFilesSize)&&((projectFileParams.size ) < Meteor.settings.public.maxOneFile)) {
                let currentProject = Project.findOne(projectFileParams.projectId)
                check(currentProject.isMember(authInfo), true)
                currentProject.private.totalFilesSize += projectFileParams.size
                let newProjectFile = new ProjectFile(projectFileParams)
                newProjectFile.createdBy = authInfo.memberId
                let id = newProjectFile.save((err) => {
                    if (!err) {
                        currentProject.save()
                    }
                })
                const result = await minioTools.client.presignedPutObject('project-files', id)
                return {url: result, id: id}
            }
        },
        moveFile(authInfo, fileId,parentId) {
            check(fileId, String)
            check(parentId, String)
            check(authInfo, {memberId: String, userSignature: String})
            let file = ProjectFile.findOne(fileId)
            let currentProject = Project.findOne(file.projectId)
            check(currentProject.isMember(authInfo), true)

                file.parentFolderId=parentId
            file.save()

        },
        async deleteProjectFile(authInfo, fileId) {
            check(authInfo, {memberId: String, userSignature: String})
            let file = ProjectFile.findOne(fileId)
            let currentProject = Project.findOne(file.projectId)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.totalFilesSize -= file.size
            const resultDelete = await minioTools.client.removeObject('project-files', file._id)
            return {
                servRes: file.remove((err) => {
                    if (!err) {
                        currentProject.save()
                    }
                }), minioRes: resultDelete
            }
        },
        async getFileUrl(authInfo, fileId) {
            check(authInfo, {memberId: String, userSignature: String})
            check(fileId, String)
            let file = ProjectFile.findOne(fileId)
            let currentProject = Project.findOne(file.projectId)
            check(currentProject.isMember(authInfo), true)


            return await minioTools.client.presignedGetObject('project-files', fileId)


        },
    }
})
