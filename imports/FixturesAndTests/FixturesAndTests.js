import User from '/imports/classes/User'
import Project from '/imports/classes/Project'
import UserActionsToRun from "/imports/FixturesAndTests/User/UserActionsToRun"
//on affiche tout ça que si on est en mode dev bien sur

/************************************************
 * Objet permettant de réaliser en meme temps des fixtures et des tests, il permet donc la génération de données de test ainsi que le test de ces données dans la meme Action
 * @type {{RunFixturesAndTests: (function(*)), MethodValid: Array, MethodErrors: Array, validTests: Array, invalidTests: Array, actionsToRun: [null,null]}}
 */
let FixturesAndTests = {
    /**************************
     * Lance les differentes Actions du tableau ActionTo run les unes après les autres suivant leur etape (milestone)
     * @param callBack     on se servira de ce callback dans les events du boutons, il sera executé a l'issue du processus
     * @constructor
     */
    RunFixturesAndTests(callBack) {
        //tableau listant les fonctions différées
        let listFonctionsDefered = []
        //on trie les actions par ordre croissant de leurs milestone
        this.actionsToRun.sort(function (a, b) {
            return a.milestone - b.milestone;
        });
        //on boucle sur le tableau des actions a réaliser
        this.actionsToRun.forEach((actionToRun, i) => {
            //on les range dans le tableau des actions différées
            listFonctionsDefered[i] = actionToRun.action();
        });
        //ici, $.when.apply... permet de déterminer quand toutes les exécutions de actionsToRun,
        //seront terminées.
        $.when.apply($, listFonctionsDefered).then(() => {
            //quant tout est terminé, on lance le callback
            callBack()
        })
    },
    //tableau des methodes valides
    MethodValid: [],
    //tableau des methodes ayant échouées
    MethodErrors: [],
    //tableau des tests validés
    validTests: [],
    //tableau des Tests non validés
    invalidTests: [],
    //liste des Actions a réaliser
    actionsToRun: [
        {
            //ordre de passage dans la methode principale
            milestone: 0,
            //nom sous lequel la methode sera connue
            name: "clearUsers",
            //action a réaliser qui sera exécuté dans RunFixturesAndTest
            action() {
                //Cette fonction retoune un objet promise, c'est à dire un objet qui va permettre de déterminer
                //l'état d'exécution de l'action
                return $.Deferred((defer) => {
                    //on réalise la methode de suppression des utilisateurs
                    Meteor.call('clearUsers', (err) => {
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
                        } else {
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

                        }
                    })

                }).promise(); //on renvoie bien la promise
            }
            ,
//tableau des tests a réaliser concernant les données rentrées par la méthodes appelée dans l'action
            tests: [
                {
                    //message qui sera renvoyé a l'écran
                    label: function () {
                        return "action 0 test 0 : The Projects collection has to be Empty"
                    },
                    //test qui sera réalisé apres l'action si elle se passe sans erreur, elle comporte un callback
                    // car on ne passe a l'action suivante qu'en callback du dernier test appelé
                    doTest(callback) {
                        if (User.find().fetch().length === 0) {
                            FixturesAndTests.validTests.push(this.label())
                        } else {
                            FixturesAndTests.invalidTests.push(this.label())
                        }
                        callback()
                    }
                }
            ]
        },
        {
            //ordre de passage dans la methode principale
            milestone: 1,
            //nom sous lequel la methode sera connue
            name:
                "clearProjects",
            //action a réaliser qui sera exécuté dans RunFixturesAndTest
            action() {
                //Cette fonction retoune un objet promise, c'est à dire un objet qui va permettre de déterminer
                //l'état d'exécution de l'action
                return $.Deferred((defer) => {
                    //on réalise la methode de suppression des projets
                    Meteor.call('clearProjects', (err) => {
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
                        } else {
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
                        }
                    });
                }).promise(); //on renvoie bien la promise
            }
            ,
            //tableau des tests a réaliser concernant les données rentrées par la méthodes appelée dans l'action
            tests: [
                {
                    //message qui sera renvoyé a l'écran
                    label: function () {
                        return "action 1 test 0 : The user collection has to be Empty"
                    },
                    //test qui sera réalisé apres l'action si elle se passe sans erreur, elle comporte un callback
                    // car on ne passe a l'action suivante qu'en callback du dernier test appelé
                    doTest(callback) {
                        if (Project.find().fetch().length === 0) {
                            FixturesAndTests.validTests.push(this.label())
                        } else {
                            FixturesAndTests.invalidTests.push(this.label())
                        }
                        callback()
                    }
                }
            ]
        }
        ,
    ],
}

FixturesAndTests.actionsToRun = FixturesAndTests.actionsToRun.concat(UserActionsToRun)

export default FixturesAndTests;