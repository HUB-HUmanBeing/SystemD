
Template.submitIssue.helpers({
    //add you helpers here
    requestType: function () {
        return Template.instance().requestType.get()
    },
    issueUrl: function () {
        return Template.instance().issueUrl.get()
    }
});

Template.submitIssue.events({
    //add your events here
    "click [bugReport]": function (event, instance) {
        event.preventDefault()
        instance.requestType.set('bugReport')
    },
    "click [suggestion]": function (event, instance) {
        event.preventDefault()
        instance.requestType.set('suggestion')
    },
    'submit #submitIssueForm': function (event, instance) {
        event.preventDefault()
        let issueContent = $('#submitIssueContent').val()
        let requestType = instance.requestType.get()
        let contextInfos = null
        let withDeviceInfo = $('#withDeviceInfo').prop("checked")
        console.log(withDeviceInfo)
        if (requestType === "bugReport" && withDeviceInfo) {
            contextInfos = {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                appVersion: navigator.appVersion,
                vendor: navigator.vendor,
                url: window.location.href
            }
        }
        let body = "### " + requestType + " from System-D user" + "\n"
        if (contextInfos) {
            body += "#### context info :" + "\n"
            Object.keys(contextInfos).forEach(key => {
                body += '> ' + key + " : " + contextInfos[key] + "\n"
            })
        }
        body += "#### content :" + "\n"
        body += issueContent
        let issueObj = {
            title: requestType + " from System-D user",
            body: body
        }
        Meteor.call("sendIssue", issueObj, (err, res)=>{
            if(err){
                console.log(err)
            }else{
                instance.issueUrl.set(res)
            }
        })
    }
});

Template.submitIssue.onCreated(function () {
    //add your statement here
    this.requestType = new ReactiveVar('bugReport')
    this.issueUrl = new ReactiveVar(false)
});

Template.submitIssue.onRendered(function () {
    //add your statement here
    $('.modal').modal({
        ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            $('ul.tabs').tabs();
        },
        complete() { this.issueUrl.set(false)}
    })
    $('#submitIssueContent').characterCounter();
});

Template.submitIssue.onDestroyed(function () {
    //add your statement here
});

