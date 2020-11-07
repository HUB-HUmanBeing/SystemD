import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";
import Topic from "../../../imports/classes/Topic";
import Spreadsheet from "../../../imports/classes/Spreadsheet";
import Pad from "../../../imports/classes/Pad";

Project.extend({
    meteorMethods: {
        /***********************
         * Création d'une nouvelle catégorie
         * @param authInfo
         * @param categoryName
         * @param id
         * @param membersToNotify
         */
        newForumCategory(authInfo, categoryName,id,membersToNotify) {
            check(categoryName, String)
            check(membersToNotify,[String])
            check(id, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            currentProject.private.forumCategories.push({symEnc_name: categoryName, categoryId:id,membersToNotify : membersToNotify})
            currentProject.save()

        },
        /*****************************
         * edition du nom d'une catégorie
         * @param authInfo
         * @param index
         * @param categoryName
         */
        editForumCategoryName(authInfo,index, categoryName) {
            check(categoryName, String)
            check(index, Number)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            currentProject.private.forumCategories[index].symEnc_name=categoryName
            currentProject.save()

        },
        /*******************************
         * supression d'une catégorie
         * @param authInfo
         * @param index
         */
        deleteForumCategory(authInfo,index) {

            check(index, Number)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)

            let insideTopics = Topic.find({"$and": [
                    {projectId: currentProject._id},
                    {categoryId: currentProject.private.forumCategories[index].categoryId}
                ]
            }).fetch()
            insideTopics.forEach((topic)=>{
                topic.removeRecursive()
            })
            let insidePads = Pad.find({"$and": [
                    {projectId: currentProject._id},
                    {categoryId: currentProject.private.forumCategories[index].categoryId}
                ]
            }).fetch()
            insidePads.forEach((pad)=>{
                pad.remove()
            })

            let insideSpreadsheets = Spreadsheet.find({"$and": [
                    {projectId: currentProject._id},
                    {categoryId: currentProject.private.forumCategories[index].categoryId}
                ]
            }).fetch()
            insideSpreadsheets.forEach((spreadsheet)=>{
                spreadsheet.remove()
            })


            currentProject.private.forumCategories.splice(index, 1)
            currentProject.save()

        },
        /**************************
         * déplacement d'une catégorie
         * @param authInfo
         * @param index
         * @param direction
         */
        moveForumCategory(authInfo,index, direction) {
            check(direction, String)
            check(index, Number)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            let waitingCategory
            if(direction == "up"){
                if(index>0){
                    waitingCategory = currentProject.private.forumCategories[index -1]
                    currentProject.private.forumCategories[index -1]=currentProject.private.forumCategories[index]
                    currentProject.private.forumCategories[index]= waitingCategory
                }
            }else{
                if(index< currentProject.private.forumCategories.length -1){
                    waitingCategory = currentProject.private.forumCategories[index +1]
                    currentProject.private.forumCategories[index +1]=currentProject.private.forumCategories[index]
                    currentProject.private.forumCategories[index]= waitingCategory
                }
            }
            currentProject.save()

        },
        /****************************
         * activation ou désactivation des notifications pour une catégorie donnée
         * @param authInfo
         * @param index
         */
        toggleNotifyCategory(authInfo,index) {

            check(index, Number)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
           let isTurnedOn = false
            let indexMember = currentProject.private.forumCategories[index].membersToNotify.indexOf(authInfo.memberId)
            if(indexMember=== -1){
                isTurnedOn = true
                currentProject.private.forumCategories[index].membersToNotify.push(authInfo.memberId)
            }else{
                currentProject.private.forumCategories[index].membersToNotify.splice(indexMember,1)
            }

            let insideTopics = Topic.find({"$and": [
                    {projectId: currentProject._id},
                    {categoryId: currentProject.private.forumCategories[index].categoryId}
                ]
            }).fetch()
            insideTopics.forEach(topic=>{
                let i=topic.membersToNotify.indexOf(authInfo.memberId)
                if( i=== -1){
                    if(isTurnedOn){
                        topic.membersToNotify.push(authInfo.memberId)
                        topic.save()
                    }
                }else{
                    if(!isTurnedOn){
                        topic.membersToNotify.splice(i,1)
                        topic.save()
                    }
                }
            })

            currentProject.save()
        },

    }
})
