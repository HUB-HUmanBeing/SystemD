import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Topic from "../../../imports/classes/Topic";
import Publication from "../../../imports/classes/Publication";


Publication.extend({
    meteorMethods: {

        newPublication(authInfo, topicId, publicationParmas) {
            check(publicationParmas, {
                type: String,
                textualContent: Object
            })
            check(authInfo, {memberId: String, userSignature: String})
            check(topicId, String)
            let topic = Topic.findOne(topicId)
            let currentProject = Project.findOne(topic.projectId)
            check(currentProject.isMember(authInfo), true)

            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId,
                topicId: topic._id,
            }
            publicationParmas = {...publicationParmas, ...computedParams}
            let newPublication = new Publication(publicationParmas)
            topic.seenBy = [authInfo.memberId]
            topic.lastActivity = new Date()
            topic.publicationTotalCount++
            return newPublication.save((err) => {
                if (!err) {
                    console.warn("todo : notifier les notifiables")
                    topic.save()
                }else{
                    console.log(err)
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
            return topic.remove()
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
