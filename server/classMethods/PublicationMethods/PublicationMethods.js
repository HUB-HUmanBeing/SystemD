import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Topic from "../../../imports/classes/Topic";
import Publication from "../../../imports/classes/Publication";
import NotifPush from "../../../imports/NotifPush";
import Comment from "../../../imports/classes/Comment";


Publication.extend({
    meteorMethods: {

        newPublicationTextual(authInfo, topicId, publicationParmas, notifObjects) {
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
        newPublicationFile(authInfo, topicId, publicationParmas, notifObjects) {
            check(publicationParmas, {
                type: String,
                fileContent: Object,
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
        newPublicationPoll(authInfo, topicId, publicationParmas, notifObjects) {
            check(publicationParmas, {
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
            publicationParmas = {...publicationParmas, ...computedParams}
            let newPublication = new Publication(publicationParmas)
            topic.seenBy = [authInfo.memberId]
            topic.lastActivity = new Date()
            topic.publicationTotalCount++
            return newPublication.save((err) => {
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
        addPollOption(authInfo, encryptedOption) {
            check(authInfo, {memberId: String, userSignature: String})
            check(encryptedOption, Object)
            let publication = Publication.findOne(this._id)
            let currentProject = Project.findOne(publication.projectId)

            check(currentProject.isMember(authInfo),true)

            encryptedOption.checkedBy=[authInfo.memberId]
            publication.pollContent.options.push(encryptedOption)

            return publication.save()
        },
        chooseProposition(authInfo, i) {
            check(authInfo, {memberId: String, userSignature: String})
            check(i, Number)
            let publication = Publication.findOne(this._id)
            let currentProject = Project.findOne(publication.projectId)
            check(currentProject.isMember(authInfo), true)

            let option = publication.pollContent.options[i]

            let memberIndex = option.checkedBy.indexOf(authInfo.memberId)
            if (memberIndex > -1) {
                publication.pollContent.options[i].checkedBy.splice(memberIndex, 1)
            } else {
                publication.pollContent.options[i].checkedBy.push(authInfo.memberId)
            }
            return publication.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let publication = Publication.findOne(this._id)
            let currentProject = Project.findOne(publication.projectId)
            check(currentProject.isMember(authInfo), true)
            check(authInfo.memberId === publication.createdBy, true)
            return publication.removeRecursive((err) => {
            })
        },
        editPublication(authInfo, symEnc_text) {
            check(authInfo, {memberId: String, userSignature: String})
            check(symEnc_text, String)
            let publication = Publication.findOne(this._id)
            let currentProject = Project.findOne(publication.projectId)
            check(currentProject.isMember(authInfo), true)
            check(authInfo.memberId === publication.createdBy, true)
            if (publication.fileContent) {
                publication.fileContent.symEnc_text = symEnc_text
            }
            if (publication.pollContent) {
                publication.pollContent.symEnc_text = symEnc_text
            }
            if (publication.textualContent) {
                publication.textualContent.symEnc_text = symEnc_text
            }

            return publication.save()
        },
        toggleLike(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let publication = Publication.findOne(this._id)
            let currentProject = Project.findOne(publication.projectId)
            check(currentProject.isMember(authInfo), true)
            let memberIndex = publication.likedBy.indexOf(authInfo.memberId)
            if (memberIndex > -1) {
                publication.likedBy.splice(memberIndex, 1)
            } else {
                publication.likedBy.push(authInfo.memberId)
            }

            return publication.save()
        },
        togglePinned(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let publication = Publication.findOne(this._id)
            let currentProject = Project.findOne(publication.projectId)
            check(currentProject.isAdmin(authInfo), true)
            let previousPinnedPub = Publication.findOne({
                $and: [
                    {pinned: true},
                    {topicId: publication.topicId}
                ]
            })
            publication.pinned = !publication.pinned
            return publication.save(() => {
                if (previousPinnedPub) {
                    previousPinnedPub.pinned = false
                    previousPinnedPub.save()
                }
            })
        }
    }
})
