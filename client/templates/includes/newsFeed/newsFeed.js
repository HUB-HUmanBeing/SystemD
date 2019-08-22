import i18n from "meteor/universe:i18n";

Template.newsFeed.helpers({
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

Template.newsFeed.events({
    //add your events here
    "click [bugReport]": function (event, instance) {
        event.preventDefault()
        Meteor.setTimeout(()=>{
            $('#newsFeedContent').focus()
        },200)
        instance.requestType.set('bugReport')
    },
    "click [suggestion]": function (event, instance) {
        Meteor.setTimeout(()=>{
            $('#newsFeedContent').focus()
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
    'submit #newsFeedForm': function (event, instance) {
        event.preventDefault()
        let issueContent = $('#newsFeedContent').val()
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
            userInput: $("#NewsFeedCaptcha").val()?$("#NewsFeedCaptcha").val(): "ok"
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
        $('#newsFeedContent').val(' ')
    }
});

Template.newsFeed.onCreated(function () {
    //add your statement here
    this.requestType = new ReactiveVar('bugReport')
    this.issueUrl = new ReactiveVar(false)
    this.captcha = new ReactiveVar({data: null, text: null})
});

Template.newsFeed.onRendered(function () {
    //add your statement here
    $('#modalNewsFeed').modal({
        startingTop: '4%', // Starting top style attribute
        endingTop: '4%',
        ready: (modal, trigger) =>{ // Callback for Modal open. Modal and trigger parameters available.
            $('ul.tabs').tabs();
            Meteor.setTimeout(()=>{
                $('#newsFeedContent').focus()
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
    $('#newsFeedContent').characterCounter();
    resetTooltips()
});

Template.newsFeed.onDestroyed(function () {
    //add your statement here
});

