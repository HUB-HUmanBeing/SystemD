import moment from "../../lib/i18nMoment";
import projectController from "../../lib/controllers/projectController";

Template.registerHelper('length', function (array) {
    return array.length
})


Template.registerHelper('isInArray', function (element, array) {
    return array.includes(element)
})

Template.registerHelper('showDistance', function (distance) {

//distance relative
    if (!distance && distance !== 0) {
        distance = ""
    } else if (distance <= 1) {
        distance = "moins de 2 km"
    } else {
        distance = distance + " km"
    }
    return distance
})

Template.registerHelper('relativeDistanceFromCoord', function (lonLat) {
    let relativeDistance = ""
    if (Meteor.userId()) {
        const currentUserLocation = Meteor.user().profile.location
        if (lonLat && currentUserLocation.lonLat) {
            let distance = calculateDistance(
                lonLat,
                currentUserLocation.lonLat
            );
            let distanceToShow = parseInt(distance.kilometers) < 2 ? "moins de 2" : parseInt(distance.kilometers)
            relativeDistance = "(" + distanceToShow + "km )"
        }
    }
    return relativeDistance
})

Template.registerHelper('isArray', function (el) {
    return Array.isArray(el)

})

Template.registerHelper('formatDate', function (date, capitalize) {
    let calendarDate = moment(date).calendar();
    if (capitalize) {
        return calendarDate.charAt(0).toUpperCase() + calendarDate.slice(1)
    } else {
        return calendarDate.charAt(0).toLowerCase() + calendarDate.slice(1)
    }


})

Template.registerHelper('usernameFromMemberId', function (memberId) {
    let requiredMember = {}
    Session.get("currentProjectMembers").forEach((member) => {
        if (member.memberId === memberId) {
            requiredMember = member
        }
    })
    return requiredMember.symEnc_username;

})
Template.registerHelper('userIdFromMemberId', function (memberId) {
    let requiredMember = {}
    Session.get("currentProjectMembers").forEach((member) => {
        if (member.memberId === memberId) {
            requiredMember = member
        }
    })
    return requiredMember.symEnc_userId;

})
Template.registerHelper("isAdmin", function (projectId) {
    return projectController.isAdmin(projectId)
})
Template.registerHelper('onlyZeroToNine', function (number) {
    return number > 9 ? "9+" : number;
})
