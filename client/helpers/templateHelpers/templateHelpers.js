import moment from "../../lib/i18nMoment";

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

Template.registerHelper('formatDate', function (date) {
    return moment(date).format();

})

Template.registerHelper('usernameFromMemberId', function (memberId) {
    let requiredMember = {}
    Session.get("currentProjectMembers").forEach((member)=>{
        if(member.memberId === memberId){
            requiredMember = member
        }
    })
    return requiredMember.symEnc_username;

})
Template.registerHelper('userIdFromMemberId', function (memberId) {
    let requiredMember = {}
    Session.get("currentProjectMembers").forEach((member)=>{
        if(member.memberId === memberId){
            requiredMember = member
        }
    })
    return requiredMember.symEnc_userId;

})
