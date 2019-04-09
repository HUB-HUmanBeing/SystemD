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
            newTopic.createdBy = authInfo.memberId
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
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && this.memberId === authInfo.createdBy), true)
            check(this.isMainTopic, false)
            currentProject.private.forumCategories.forEach(cat => {
                if (cat.id === this.categoryId) {
                    this.membersToNotify = [...this.membersToNotify, cat.membersToNotify]
                    this.membersToNotify = [...new Set(this.membersToNotify)];
                }
            })
            this.categoryId = categoryId
            this.lastActivity = new Date()
            return this.save()
        },
        editName(authInfo, symEnc_name) {
            check(symEnc_name, String)
            check(authInfo, {memberId: String, userSignature: String})
            let topic = Topic.findOne(this._id)
            let currentProject = Project.findOne(topic.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && topic.createdBy === authInfo.memberId), true)
            check(topic.isMainTopic, false)
            topic.symEnc_name = symEnc_name
            return topic.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let topic = Topic.findOne(this._id)
            let currentProject = Project.findOne(topic.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && topic.createdBy === authInfo.memberId), true)
            check(topic.isMainTopic, false)
            return topic.removeRecursive()
        },
        toggleNotify(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})

            let topic = Topic.findOne(this._id)
            let currentProject = Project.findOne(topic.projectId)
            check(currentProject.isMember(authInfo), true)
            let indexMember = topic.membersToNotify.indexOf(authInfo.memberId)
            if (indexMember === -1) {
                topic.membersToNotify.push(authInfo.memberId)
            } else {
                topic.membersToNotify.splice(indexMember, 1)
            }
            topic.save()
        },
    }
})
