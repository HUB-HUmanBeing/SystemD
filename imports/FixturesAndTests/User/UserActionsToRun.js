import Fixtures from "/imports/FixturesAndTests/Fixtures"
import FixturesAndTests from '/imports/FixturesAndTests/FixturesAndTests'
import User from '/imports/classes/User'
import Project from '/imports/classes/Project'

const UserActionsToRun = [
    {
        //ordre de passage dans la methode principale
        milestone: 2,
        //nom sous lequel la methode sera connue
        name: "CreateUsers",
        //action a réaliser qui sera exécuté dans RunFixturesAndTest
        action() {
            //Cette fonction retoune un objet promise, c'est à dire un objet qui va permettre de déterminer
            //l'état d'exécution de l'action
            return $.Deferred((defer) => {
                //on boucle sur les Usernames
                Fixtures.usersnames.forEach((username) => {
                    Meteor.call('createNewUser', {username: username, password: Fixtures.password}, (err) => {
                        //si la méthode renvoie une erreur
                        if (err) {
                            //on rajoute le nom de la methode au tableau des erreurs methode
                            FixturesAndTests.MethodErrors.push(this.name)
                            //defer.reject permet d'indiquer que l'exécution est terminé avec l'état KO
                            //l'objet promise retournée par rechercherNbLikeAsync aura l'état "Rejected"
                            //Dans le meme temp, on lui passe en argument l'objet Erreur
                            defer.reject(err);
                            //et on quitte la fonction
                            return;
                            //si tout se passe bien
                        }
                    })
                });
                    //on rajoute la methode au tableau des actions réussies
                    FixturesAndTests.MethodValid.push(this.name)

                    //et on passe au tests pour chaques tests
                    this.tests.forEach((test, i) => {
                        //on réalise le test
                        test.doTest(() => {
                            //lorsqu'on arrive au dernier test, on renvoie defer.resolve
                            if (i === this.tests.length - 1) {
                                //defer.resolve permet d'indiquer que l'exécution est terminé avec l'état OK
                                //l'objet promise retournée par rechercherNbLikeAsync aura l'état "Fulfilled"
                                defer.resolve();
                            }
                        })

                    })




            }).promise(); //on renvoie bien la promise
        },
        //tableau des tests a réaliser concernant les données rentrées par la méthodes appelée dans l'action
        tests: [
            {
                //message qui sera renvoyé a l'écran
                label: function () {
                    return "action 2 test 0 : The user collection has to have 10 documents"
                },
                //test qui sera réalisé apres l'action si elle se passe sans erreur, elle comporte un callback
                // car on ne passe a l'action suivante qu'en callback du dernier test appelé
                doTest(callback) {
                    if (User.find().fetch().length === 10) {
                        FixturesAndTests.validTests.push(this.label())
                    } else {
                        FixturesAndTests.invalidTests.push(this.label())
                    }
                    callback()
                }
            }
        ]
    },
]


export default UserActionsToRun
