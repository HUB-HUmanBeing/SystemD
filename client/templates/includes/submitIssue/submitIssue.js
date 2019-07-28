import i18n from "meteor/universe:i18n";

Template.submitIssue.helpers({
    //add you helpers here
    requestType: function () {
        return Template.instance().requestType.get()
    },
    issueUrl: function () {
        return Template.instance().issueUrl.get()
    },
    captcha: function () {
        return Template.instance().captcha.get().data
    }
});

Template.submitIssue.events({
    //add your events here
    "click [bugReport]": function (event, instance) {
        event.preventDefault()
        Meteor.setTimeout(()=>{
            $('#submitIssueContent').focus()
        },200)
        instance.requestType.set('bugReport')
    },
    "click [suggestion]": function (event, instance) {
        Meteor.setTimeout(()=>{
            $('#submitIssueContent').focus()
        },200)
        event.preventDefault()
        instance.requestType.set('suggestion')
    },
    "click [refreshCaptcha]": function (event, instance) {
        event.preventDefault()
        Meteor.call("getCaptcha", (err, res) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(res)
                instance.captcha.set(res)
            }
        })
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
                url: window.location.href,
                size: window.innerWidth + " x " +window.innerHeight,
                locale: i18n.getLocale()
            }
        }
        let body = "### " + requestType + " from System-D user" + "\n"
        body += "#### content :" + "\n"
        body += issueContent+ "\n"
        if (contextInfos) {
            body += "#### context info :" + "\n"
            Object.keys(contextInfos).forEach(key => {
                body += '> ' + key + " : " + contextInfos[key] + "\n"
            })
        }

        let issueObj = {
            title: requestType + " : " +issueContent.substring(0,50) + "...",
            body: body
        }
        let captcha = {
            hashControl: instance.captcha.get().text,
            userInput: $("#SubmitIssueCaptcha").val()?$("#SubmitIssueCaptcha").val(): "ok"
        }

        Meteor.call("sendIssue", issueObj, captcha, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                instance.issueUrl.set(res)
            }
        })
    },
    'click [closeModal]' : function (event, instance) {
        event.preventDefault()
        $('.modal').modal('close')
        $('#submitIssueContent').val(' ')
    }
});

Template.submitIssue.onCreated(function () {
    //add your statement here
    this.requestType = new ReactiveVar('bugReport')
    this.issueUrl = new ReactiveVar(false)
    this.captcha = new ReactiveVar({data: null, text: null})
});

Template.submitIssue.onRendered(function () {
    //add your statement here
    $('#modalSubmitIssue').modal({
        startingTop: '4%', // Starting top style attribute
        endingTop: '4%',
        ready: (modal, trigger) =>{ // Callback for Modal open. Modal and trigger parameters available.
            $('ul.tabs').tabs();
            Meteor.setTimeout(()=>{
                $('#submitIssueContent').focus()
            },200)
            Meteor.call("getCaptcha", (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(res)
                    this.captcha.set(res)
                }
            })
        },
        complete: () => {
            this.issueUrl.set(false)
        }
    })
    $('#submitIssueContent').characterCounter();
    resetTooltips()
});

Template.submitIssue.onDestroyed(function () {
    //add your statement here
});

