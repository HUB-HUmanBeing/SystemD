

if (Meteor.isDevelopment) {

    Template.fixturesAndTests.helpers({
        //add you helpers here
        Done: function () {
            return Template.instance().Done.get()
        },
        succes: function () {
            return Template.instance().succes.get()
        },
        elapsedTime: function () {
            let elapsedTime = Template.instance().elapsedTime.get()
            if (elapsedTime < 1000) {
                return elapsedTime.toString() + "ms"
            } else {
                return (elapsedTime / 1000).toString() + "s"
            }

        },
        message : function () {
            return Template.instance().message.get()
        }
    });

    Template.fixturesAndTests.events({
        //add your events here
        'click [clearDB]': function (event, instance) {
Meteor.logout()
            let startTime = new Date().getTime()
            Meteor.call('clearDb', (err) => {
                console.log("ok")
                let elapsedTime = new Date().getTime() - startTime
                instance.elapsedTime.set(elapsedTime)
                instance.Done.set(true)
                if (err) {
                    instance.succes.set(false)
                } else {
                    instance.message.set("la base de donnée a été reset")
                    instance.succes.set(true)

                }
            })
        },
        "click [launchUsersAndProjectsFixtures]": function (event, instance) {
            let startTime = new Date().getTime()
            Meteor.call('launchUsersAndProjectsFixtures', (err) => {
                instance.Done.set(true)
                let elapsedTime = new Date().getTime() - startTime
                instance.elapsedTime.set(elapsedTime)
                if (err) {
                    instance.succes.set(false)
                } else {
                    instance.message.set("des utilisateurs et leurs projets ont étés créés")
                    instance.succes.set(true)

                }
            })
        },
        "click [LaunchMembersAndInvitFixtures]" : function (event, instance) {
            let startTime = new Date().getTime()
            Meteor.call('LaunchMembersAndInvitFixtures', (err) => {
                let elapsedTime = new Date().getTime() - startTime
                instance.elapsedTime.set(elapsedTime)
                instance.Done.set(true)
                if (err) {
                    instance.succes.set(false)
                } else {
                    instance.message.set("des utilisateurs ont rejoint les projets et des invitations ont été émises")
                    instance.succes.set(true)

                }
            })
        }
    });

    Template.fixturesAndTests.onCreated(function () {
        //add your statement here
        this.Done = new ReactiveVar(false)
        this.succes = new ReactiveVar(false)
this.message = new ReactiveVar("")
        this.elapsedTime = new ReactiveVar()
    });

    Template.fixturesAndTests.onRendered(function () {
        //add your statement here
        $('.tooltipped').tooltip({delay: 50});
        $('.modal').modal();
    });

    Template.fixturesAndTests.onDestroyed(function () {
        //add your statement here
    });
}
