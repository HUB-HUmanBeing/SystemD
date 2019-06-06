import moment from "../../lib/i18nMoment";
import projectController from "../../lib/controllers/projectController";
import {render} from "emojitsu";

Template.registerHelper('length', function (array) {
    return array.length
})


Template.registerHelper('isInArray', function (element, array) {
    return array.indexOf(element)!== -1
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

    let emojis = ["👍", "🙂", "😉", "☺️", "😐", "😆", "😜", "😅", "😂", "😱", "😁", "😃", "😘", "😗", "😋", "😊", "😍", "🤨", "🤩", "😑", "😏", "😯", "😡", "😱", "😨", "😤", "😖", "🤫", "💩", "💀", "👌", "✌", "💪", "❤", "️💣", "💥", "🕶", "🍴", "🍺", "🎉", "📢", "🏴"]
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
    console.log(typeInput)
    let types = [
            {
                label: "video",
                mimes:["video/mp4", "video/avi", "video/flv", "video/m4v", "video/mkv", "video/x-matroska", "video/mov", "video/mpeg", "video/mpg", "video/mts", "video/vob", "video/webm", "video/wmv", "video/3gp", "video/3gpp", "video/x-msvideo", "video/x-flv", "video/quicktime", "video/mp2t", "video/x-ms-wmv"],
                iconUrl: "/images/icon/files/video1.svg"
            },
        {
            label: "audio",
            mimes:["audio/mp4", "audio/mp3", "audio/mpg"],
            iconUrl: "/images/icon/files/audio.svg"
        },
            {
                label: "image",
                mimes:["image/jpeg", "image/gif", "image/png", "image/svg+xml", "image/jpg"],
                iconUrl: "/images/icon/files/image.svg"
            },
            {
                label: "pdf",
                mimes:["application/pdf", "application/x-pdf"],
                iconUrl: "/images/icon/files/pdf.svg"
            },
            {
                label: "doc",
                mimes: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
                iconUrl: "/images/icon/files/word.svg"
            },
            {
                label: "sheet",
                mimes:   ["application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.spreadsheet"],
                iconUrl: "/images/icon/files/excel.svg"
            },
        ]
    let res = "/images/icon/files/other.svg"
    types.forEach(type=>{
        if(type.mimes.indexOf(typeInput)>-1){
            res = type.iconUrl
        }
    })

    return res

})
