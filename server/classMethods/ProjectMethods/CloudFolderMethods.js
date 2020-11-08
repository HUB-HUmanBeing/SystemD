import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";
import Topic from "../../../imports/classes/Topic";
import ProjectFile from "../../../imports/classes/ProjectFile";

Project.extend({
    meteorMethods: {
        /***********************
         * Création d'un nouveau dossier (cloud)
         * @param authInfo
         * @param symEnc_name
         * @param folderId
         * @param parentFolderId
         */
        newCloudFolder(authInfo, symEnc_name,folderId,parentFolderId) {
            check(symEnc_name, String)
            check(folderId,String)
            check(parentFolderId, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.cloudFolders.push(
                {
                    folderId: folderId,
                    symEnc_name:symEnc_name,
                    createdBy: authInfo.memberId,
                    parentFolderId:parentFolderId,
                })
            currentProject.save()

        },
        /*****************************
         * edition du nom d'une catégorie
         */
        editCloudFolderName(authInfo,name, id) {
            check(name, String)
            check(id, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.cloudFolders.forEach((folder,i)=>{
                if(folder.folderId == id){
                    currentProject.private.cloudFolders[i].symEnc_name=name
                }
            })
            currentProject.save()

        },
        moveFolder(authInfo, id, parentId) {
            check(id, String)
            check(parentId, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.cloudFolders.forEach((folder,i)=>{
                if(folder.folderId == id){
                    currentProject.private.cloudFolders[i].parentFolderId=parentId
                }
            })
            currentProject.save()

        },
        /*******************************
         * supression d'une catégorie
         * @param authInfo
         * @param index
         */
        async deleteFolder(authInfo,folderId) {

            check(folderId, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            let indexToDelete = []
            let idToDelete=[]
            let recursiveDelete= (id)=>{
                currentProject.private.cloudFolders.forEach((folder, i)=>{
                    if(folder.folderId == id){
                        indexToDelete.push(i)
                        idToDelete.push(id)
                    } else if(folder.parentFolderId==id){
                        recursiveDelete(folder.folderId)
                    }
                })
            }
            recursiveDelete(folderId)

            let newArray = []
            currentProject.private.cloudFolders.forEach((el,i)=>{
                if(indexToDelete.indexOf(i)== -1){
                    newArray.push(el)
                }
            })
currentProject.private.cloudFolders = newArray
            currentProject.save((err) => {
                let filesToRemove = ProjectFile.find({"$and": [
                        {projectId: currentProject._id},
                        {parentFolderId: {"$in": idToDelete}}
                    ]
                }).fetch()
                filesToRemove.forEach((file)=>{
                    file.removeAndDeleteFile()
                })
            })

        },
        // /**************************
        //  * déplacement d'une catégorie
        //  * @param authInfo
        //  * @param index
        //  * @param direction
        //  */
        // moveForumCategory(authInfo,index, direction) {
        //     check(direction, String)
        //     check(index, Number)
        //     check(authInfo, {memberId: String, userSignature: String})
        //     let currentProject = Project.findOne(this._id)
        //     check(currentProject.isAdmin(authInfo), true)
        //     let waitingCategory
        //     if(direction == "up"){
        //         if(index>0){
        //             waitingCategory = currentProject.private.forumCategories[index -1]
        //             currentProject.private.forumCategories[index -1]=currentProject.private.forumCategories[index]
        //             currentProject.private.forumCategories[index]= waitingCategory
        //         }
        //     }else{
        //         if(index< currentProject.private.forumCategories.length -1){
        //             waitingCategory = currentProject.private.forumCategories[index +1]
        //             currentProject.private.forumCategories[index +1]=currentProject.private.forumCategories[index]
        //             currentProject.private.forumCategories[index]= waitingCategory
        //         }
        //     }
        //     currentProject.save()
        //
        // },
        // /****************************
        //  * activation ou désactivation des notifications pour une catégorie donnée
        //  * @param authInfo
        //  * @param index
        //  */
        // toggleNotifyCategory(authInfo,index) {
        //
        //     check(index, Number)
        //     check(authInfo, {memberId: String, userSignature: String})
        //     let currentProject = Project.findOne(this._id)
        //     check(currentProject.isMember(authInfo), true)
        //    let isTurnedOn = false
        //     let indexMember = currentProject.private.forumCategories[index].membersToNotify.indexOf(authInfo.memberId)
        //     if(indexMember=== -1){
        //         isTurnedOn = true
        //         currentProject.private.forumCategories[index].membersToNotify.push(authInfo.memberId)
        //     }else{
        //         currentProject.private.forumCategories[index].membersToNotify.splice(indexMember,1)
        //     }
        //
        //     let insideTopics = Topic.find({"$and": [
        //             {projectId: currentProject._id},
        //             {categoryId: currentProject.private.forumCategories[index].categoryId}
        //         ]
        //     }).fetch()
        //     insideTopics.forEach(topic=>{
        //         let i=topic.membersToNotify.indexOf(authInfo.memberId)
        //         if( i=== -1){
        //             if(isTurnedOn){
        //                 topic.membersToNotify.push(authInfo.memberId)
        //                 topic.save()
        //             }
        //         }else{
        //             if(!isTurnedOn){
        //                 topic.membersToNotify.splice(i,1)
        //                 topic.save()
        //             }
        //         }
        //     })
        //
        //     currentProject.save()
        // },

    }
})
