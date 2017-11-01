if(Meteor.isDevelopment) {


    let fixtures = {
        users: []
    };

    var LaunchFixturesAndTests = {
        done: false,
        RunFixturesAndTests() {
            ping()
            let listFonctionsDefered = []
            this.actionsToRun.forEach((actionToRun, i) => {
                //on appele actionToRun en lui passant l'index
                listFonctionsDefered[i] = actionToRun.action(actionToRun, i);

            });
            //ici, $.when.apply... permet de déterminer quand toutes les exécutions de actionsToRun,
            //seront terminées.
            $.when.apply($, listFonctionsDefered).then(() => {
                this.done = true
                console.log(this.MethodErrors)
                console.log(this.MethodValid)
            })
        },
        MethodValid: [],
        MethodErrors: [],
        validTests: [],
        invalidTests: [],
        actionsToRun: [
            {
                object: this,
                name: "clearDB",
                action(actionToRun, i) {
                    return $.Deferred(function (defer) {
                        Meteor.call('clearUser', (err) => {
                            //defer.reject permet d'indiquer que l'exécution est terminé avec l'état KO
                            //l'objet promise retournée par rechercherNbLikeAsync aura l'état "Rejected"
                            //Dans le meme temp, on lui passe en argument l'objet Erreur
                            if (err) {
                                LaunchFixturesAndTests.MethodErrors.push(err)
                                defer.reject(err);
                                return;
                            } else {
                                LaunchFixturesAndTests.MethodValid.push(actionToRun.name)
                                defer.resolve();
                            }
                            //defer.resolve permet d'indiquer que l'exécution est terminé avec l'état OK
                            //l'objet promise retournée par rechercherNbLikeAsync aura l'état "Fulfilled"
                            //Dans le meme temp, on lui passe en argument notre objet que l'on veut mettre dans listResultat


                        });
                    }).promise();
                },
                tests: [
                    {
                        testLabel: "",
                        test() {

                        }
                    }
                ]
            }
        ]
    };


    Template.fixturesAndTests.helpers({
        //add you helpers here
        invalidTests: function () {
            return Template.instance().invalidTests.get()
        },
        validTests: function () {
            return Template.instance().invalidTests.get()
        }
    });

    Template.fixturesAndTests.events({
        //add your events here
        'click [launchFixturesAndTests]': function () {
            LaunchFixturesAndTests.RunFixturesAndTests()
        }

    });

    Template.fixturesAndTests.onCreated(function () {
        //add your statement here
        this.invalidTests = new ReactiveVar([])
        this.validTests = new ReactiveVar([])
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
