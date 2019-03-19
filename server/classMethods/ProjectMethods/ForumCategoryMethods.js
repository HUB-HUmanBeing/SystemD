import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";


Project.extend({
    meteorMethods: {
        newForumCategory(authInfo, categoryName,id) {
            check(categoryName, String)
            check(id, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            currentProject.private.forumCategories.push({symEnc_name: categoryName, categoryId:id})
            currentProject.save()

        },
        editForumCategoryName(authInfo,index, categoryName) {
            check(categoryName, String)
            check(index, Number)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            currentProject.private.forumCategories[index].symEnc_name=categoryName
            currentProject.save()

        },
        deleteForumCategory(authInfo,index) {

            check(index, Number)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            console.warn("todo :  remove tout le reste")
            currentProject.private.forumCategories.splice(index, 1)
            currentProject.save()

        },
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
        toggleNotifyCategory(authInfo,index) {

            check(index, Number)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            console.warn("todo :  appliquer aux enfants")
            let indexMember = currentProject.private.forumCategories[index].membersToNotify.indexOf(authInfo.memberId)
            if(indexMember=== -1){
                currentProject.private.forumCategories[index].membersToNotify.push(authInfo.memberId)
            }else{
                currentProject.private.forumCategories[index].membersToNotify.splice(indexMember,1)
            }
            currentProject.save()

        },

    }
})
