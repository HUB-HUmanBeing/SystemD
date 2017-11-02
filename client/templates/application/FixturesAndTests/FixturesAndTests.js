import FixturesAndTests from "/imports/FixturesAndTests/FixturesAndTests"

if (Meteor.isDevelopment) {

    Template.fixturesAndTests.helpers({
        //add you helpers here
        FixturesAndTestDone: function () {
            return Template.instance().FixturesAndTestDone.get()
        },
        AllSucces: function () {
            return 0 === Template.instance().errorMethods.get().length + Template.instance().invalidTests.get().length
        },
        succesMethods: function () {
            return Template.instance().succesMethods.get()
        },
        errorMethods: function () {
            return Template.instance().errorMethods.get()
        },
        invalidTests: function () {
            return Template.instance().invalidTests.get()
        },
        validTests: function () {
            return Template.instance().validTests.get()
        },
        succesMethodslength: function () {
            return Template.instance().succesMethods.get().length
        },
        errorMethodslength: function () {
            return Template.instance().errorMethods.get().length
        },
        invalidTestslength: function () {
            return Template.instance().invalidTests.get().length
        },
        validTestslength: function () {
            return Template.instance().validTests.get().length
        },
        elapsedTime: function () {
            let elapsedTime = Template.instance().elapsedTime.get()
            if( elapsedTime<1000){
                return elapsedTime.toString() + "ms"
            }else{
                return (elapsedTime/1000).toString() + "s"
            }

        }
    });

    Template.fixturesAndTests.events({
        //add your events here
        'click [launchFixturesAndTests]': function (event, instance) {
            let handler = Meteor.subscribe('AllForDev', {
                onReady: function () {
                    let startTime = new Date().getTime()
                    FixturesAndTests.RunFixturesAndTests(() => {
                        instance.succesMethods.set(FixturesAndTests.MethodValid)
                        instance.errorMethods.set(FixturesAndTests.MethodErrors)
                        instance.invalidTests.set(FixturesAndTests.invalidTests)
                        instance.validTests.set(FixturesAndTests.validTests)

                        instance.FixturesAndTestDone.set(true)
                        let elapsedTime = new Date().getTime() - startTime
                        instance.elapsedTime.set(elapsedTime)

                        Meteor.setTimeout(function () {
                                $('ul.tabs').tabs();
                                $('ul.tabs').tabs('select_tab', 'test1');
                            }, 100
                        )


                    })
                }
            })
        }
    });

    Template.fixturesAndTests.onCreated(function () {
        //add your statement here
        this.FixturesAndTestDone = new ReactiveVar(false)
        this.succesMethods = new ReactiveVar([])
        this.errorMethods = new ReactiveVar([])
        this.invalidTests = new ReactiveVar([])
        this.validTests = new ReactiveVar([])
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
