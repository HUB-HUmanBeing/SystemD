import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";
import Topic from "../../../imports/classes/Topic";


Topic.extend({
    meteorMethods: {
        /******************
         *creation d'un nouveau topic
         * @param authInfo
         * @param topicParmas
         */
        newTopic(authInfo, topicParmas) {
            check(topicParmas, {
                projectId: String,
                type: String,
                categoryId: String,
                symEnc_name: String,
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(topicParmas.projectId)
            check(currentProject.isMember(authInfo), true)
            let newTopic = new Topic(topicParmas)

            let categoryIndex = null
            currentProject.private.forumCategories.forEach((cat, i) => {
                if (cat.categoryId === topicParmas.categoryId) {
                    newTopic.membersToNotify = cat.membersToNotify
                    categoryIndex = i
                    if (cat.membersToNotify.indexOf(authInfo.memberId) === -1) {
                        newTopic.membersToNotify.push(authInfo.memberId)
                    }
                }
            })
            newTopic.seenBy.push(authInfo.memberId)
            return newTopic.save((err) => {
                if (!err) {
                    currentProject.private.forumCategories[categoryIndex].topicCount++
                    currentProject.save()
                }
            })
        },
        changeCategory(authInfo, categoryId) {
            check(categoryId, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this.projectId)
            check(currentProject.isAdmin(authInfo), true)

            currentProject.private.forumCategories.forEach(cat => {
                if (cat.id === this.categoryId) {
                    this.membersToNotify = [...this.membersToNotify, cat.membersToNotify]
                    this.membersToNotify = [...new Set(this.membersToNotify)];
                }
            })
            this.categoryId = categoryId
            this.lastActivity = new Date()
            return this.save()
        }
    }
})
