import moment from "../../lib/i18nMoment";
import projectController from "../../lib/controllers/projectController";
import {render} from "emojitsu";
import filesTypes from "../../lib/filesTypes";

Template.registerHelper('length', function (array) {
    return array.length
})
Template.registerHelper('isSelected', function (selectedItems, type, itemId) {
     return selectedItems.indexOf(type + "-" +itemId) !== -1
})


Template.registerHelper('isInArray', function (element, array) {
    return array.indexOf(element)!== -1
})
Template.registerHelper('currentUserId', function (element, array) {
    return Meteor.userId()
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
    if(!isNaN(date)){
        date = new Date(date)
    }
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
Template.registerHelper('isCurentUserFromMemberId',function (memberId) {
    let requiredMember = {}
    Session.get("currentProjectMembers").forEach((member) => {
        if (member.memberId === memberId) {
            requiredMember = member
        }
    })
    return requiredMember.symEnc_userId === Meteor.userId()
})
Template.registerHelper('isCurentUserInMemberArray',function (memberArray) {

  let currentMemberId = projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
    return memberArray.indexOf(currentMemberId) != -1
})
Template.registerHelper("isAdmin", function (projectId) {
    projectId = projectId || FlowRouter.current().params.projectId
    return projectController.isAdmin(projectId)
})
Template.registerHelper('onlyZeroToNine', function (number) {
    return number > 9 ? "9+" : number;
})
Template.registerHelper('isDev', function () {
    return Meteor.isDevelopment
})
Template.registerHelper('getIndex', function (array, i) {
    return array[i]
})
Template.registerHelper('boolean', function (x) {
    return !!x
})
Template.registerHelper("getEmojis", function () {

    let emojis = ["👍", "🙂", "😉", "☺️", "😐", "😆", "😜", "😅", "😂", "😱", "😁", "😃", "😘", "🐱", "😋", "😊", "😍", "🤨", "🤩", "😑", "😏", "😯", "😡", "😱", "😨", "😤", "😖", "🤫", "💩", "💀", "👌", "✌", "💪", "❤", "️💣", "💥", "🕶", "🍴", "🍺", "🎉", "📢", "🏴"]
    let imagesEmoji = []
    emojis.forEach(function (emoji) {
        imagesEmoji.push({
            unicode: emoji,
            img: render(emoji, {
                size: 32, // size of emojis to use when the default CDN is used
                className: "emojiImg", // CSS class to use when rendering image tags
                unsafe: false, // when set to true, render will NOT sanitize the string, e.g. it forces "unsafe" output
                single: true, // when a string contains just a single emoji this speeds render a bit
                cdn: undefined, // a CDN to use for image paths
            })
        })
    })
    return imagesEmoji
})

Template.registerHelper('firstLetters', function (string, number) {
    if(string.length<number){
        return string
    }else{
        return string.substring(0, number-3)+ "..."
    }
    return array[i]
})

Template.registerHelper('getFileIcon', function (typeInput) {
    let types = filesTypes
    let res = "/images/icon/files/other.svg"
    types.forEach(type=>{

        if(type.mimes.indexOf(typeInput)>-1){
            res = type.iconUrl
        }
    })

    return res

})

Template.registerHelper("carouselIndex", function (index){
    let values = ["#one!","#two!", "#three!", "#four!", "#five!", "#six!", "#seven!", "#eight!","#nine!","#ten!"]
    return values[index]
})
Template.registerHelper("formatBytes", function (bytes){
    let decimals= 2
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
})
