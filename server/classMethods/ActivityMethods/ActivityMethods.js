import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Topic from "../../../imports/classes/Topic";
import Activity from "../../../imports/classes/Activity";
import NotifPush from "../../../imports/NotifPush";
import Comment from "../../../imports/classes/Comment";


Activity.extend({
    meteorMethods: {

        newActivityTextual(authInfo, topicId, ActivityParmas, notifObjects) {
            check(ActivityParmas, {
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
            ActivityParmas = {...ActivityParmas, ...computedParams}
            let newActivity = new Activity(ActivityParmas)
            topic.seenBy = [authInfo.memberId]
            topic.lastActivity = new Date()
            topic.ActivityTotalCount++
            return newActivity.save((err) => {
                if (!err) {
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])

                    topic.save()
                    topic.notifySubscribers(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },
        newActivityPoll(authInfo, topicId, ActivityParmas, notifObjects) {
            check(ActivityParmas, {
                type: String,
                pollContent: Object
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
            ActivityParmas = {...ActivityParmas, ...computedParams}
            let newActivity = new Activity(ActivityParmas)
            topic.seenBy = [authInfo.memberId]
            topic.lastActivity = new Date()
            topic.ActivityTotalCount++
            return newActivity.save((err) => {
                if (!err) {
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])

                    topic.save()
                    topic.notifySubscribers(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },

        chooseProposition(authInfo, index) {
            check(authInfo, {memberId: String, userSignature: String})
            check(index, Number)
            let Activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(Activity.projectId)
            check(currentProject.isMember(authInfo), true)

            Activity.pollContent.options.forEach((option, i) => {

                let memberIndex = option.checkedBy.indexOf(authInfo.memberId)
                if (memberIndex > -1) {
                    Activity.pollContent.options[i].checkedBy.splice(memberIndex, 1)
                }
                if (index === i) {
                    Activity.pollContent.options[i].checkedBy.push(authInfo.memberId)
                }
            })
            return Activity.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})

            let Activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(Activity.projectId)
            check(currentProject.isMember(authInfo), true)
            check(authInfo.memberId === Activity.createdBy, true)
            return Activity.removeRecursive((err) => {
                console.warn('todo: remover les comments enfants')
            })
        },
        toggleLike(authInfo){
            check(authInfo, {memberId: String, userSignature: String})
            let Activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(Activity.projectId)
            check(currentProject.isMember(authInfo), true)
            let memberIndex = Activity.likedBy.indexOf(authInfo.memberId)
            if (memberIndex > -1) {
                Activity.likedBy.splice(memberIndex, 1)
            }else{
                Activity.likedBy.push(authInfo.memberId)
            }

            return Activity.save()
        }
    }
})
