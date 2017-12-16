import hubCrypto from '/client/lib/hubCrypto'

Template.fixturesAndTests.helpers({
    //true si l'opération a été effectuée
    Done: function () {
        return Template.instance().Done.get()
    },
    //true si l'opération est réussie
    succes: function () {
        return Template.instance().succes.get()
    },
    //durée de l'opération
    elapsedTime: function () {
        let elapsedTime = Template.instance().elapsedTime.get()
        if (elapsedTime < 1000) {
            return elapsedTime.toString() + "ms"
        } else {
            return (elapsedTime / 1000).toString() + "s"
        }

    },
    //ouverture du anneau de retour
    showResults: function () {
        return Template.instance().showResults.get()
    },
    //renvoie l'intitulé de l'opération effectué
    message: function () {
        return Template.instance().message.get()
    }
});

Template.fixturesAndTests.events({
    //action de mise a zéro de la BDB
    'click [clearDB]': function (event, instance) {
        //on se déconnecte
        Meteor.logout()
        //on mémorise le début de l'opération
        let startTime = new Date().getTime()
        //on ouvre le panneau de retour
        instance.showResults.set(true)
        instance.Done.set(false)
        //on appele la methode de nettoyage de la bdd
        Meteor.call('clearDb', (err) => {
            //quant c'est fait
            //on renseigne sur le temps écoulé
            let elapsedTime = new Date().getTime() - startTime
            instance.elapsedTime.set(elapsedTime)
            //on renseigne que l'opération est finie
            instance.Done.set(true)
            //on indique l'opération essayée
            instance.message.set("reset de la base de données")
            //si il y a echec
            if (err) {
                console.log(err)
                //on passe succes a false
                instance.succes.set(false)
            } else {
                //sinon on rensigne du success
                instance.succes.set(true)

            }
        })
    },
    //action de création des utilisateurs et de leurs projets
    "click [launchUsersAndProjectsFixtures]": function (event, instance) {
        //on mémorise le début de l'opération
        let startTime = new Date().getTime()
        //on ouvre le panneau de retour
        instance.showResults.set(true)
        instance.Done.set(false)
        //on appelle la méthode de création des user et de leurs projets

        Meteor.call('launchUsersAndProjectsFixtures', instance.UserAsymKeys, instance.brunchOfKeys, (err) => {
            //on renseigne que l'opération est finie
            instance.Done.set(true)
            //on renseigne sur le temps écoulé
            let elapsedTime = new Date().getTime() - startTime
            instance.elapsedTime.set(elapsedTime)
            //on indique l'opération essayée
            instance.message.set("Création des utilisateurs et de leurs projets")
            //si il y a echec
            if (err) {
                console.log(err)
                //on passe succes a false
                instance.succes.set(false)
            } else {
                //sinon on rensigne du success
                instance.succes.set(true)

            }
        })


    },
    //ajout de membres et d'invitations
    "click [LaunchMembersAndInvitFixtures]": function (event, instance) {
        //on mémorise le début de l'opération
        let startTime = new Date().getTime()
        //on ouvre le panneau de retour
        instance.showResults.set(true)
        instance.Done.set(false)
        //on appele la methode d'ajout de membres et d'invitations
        Meteor.call('LaunchMembersAndInvitFixtures',instance.brunchOfKeys, (err) => {
            //on renseigne sur le temps écoulé
            let elapsedTime = new Date().getTime() - startTime
            instance.elapsedTime.set(elapsedTime)
            //on renseigne que l'opération est finie
            instance.Done.set(true)
            //on indique l'opération essayée
            instance.message.set("ajout de membres et d'invitations")
            //si il y a echec
            if (err) {
                console.log(err)
                //on passe succes a false
                instance.succes.set(false)
            } else {
                //sinon on rensigne du success
                instance.succes.set(true)
            }
        })
    },
    //ajout d'articles de blog aux utilisateurs et aux projets
    "click [LaunchBlogPostsFixtures]": function (event, instance) {
        //on mémorise le début de l'opération
        let startTime = new Date().getTime()
        //on ouvre le panneau de retour
        instance.showResults.set(true)
        instance.Done.set(false)
        //on appele la methode d'ajout de membres et d'invitations
        Meteor.call('LaunchBlogPostsFixtures', (err) => {
            //on renseigne sur le temps écoulé
            let elapsedTime = new Date().getTime() - startTime
            instance.elapsedTime.set(elapsedTime)
            //on renseigne que l'opération est finie
            instance.Done.set(true)
            //on indique l'opération essayée
            instance.message.set("ajout d'article de blog projet et user")
            //si il y a echec
            if (err) {
                console.log(err)
                //on passe succes a false
                instance.succes.set(false)
            } else {
                //sinon on rensigne du success
                instance.succes.set(true)
            }
        })
    },
    //ajout d'articles de blog aux utilisateurs et aux projets
    "click [LaunchCommentsFixtures]": function (event, instance) {
        //on mémorise le début de l'opération
        let startTime = new Date().getTime()
        //on ouvre le panneau de retour
        instance.showResults.set(true)
        instance.Done.set(false)
        //on appele la methode d'ajout de membres et d'invitations
        Meteor.call('LaunchCommentsFixtures', (err) => {
            //on renseigne sur le temps écoulé
            let elapsedTime = new Date().getTime() - startTime
            instance.elapsedTime.set(elapsedTime)
            //on renseigne que l'opération est finie
            instance.Done.set(true)
            //on indique l'opération essayée
            instance.message.set("ajout des commentaires")
            //si il y a echec
            if (err) {
                console.log(err)
                //on passe succes a false
                instance.succes.set(false)
            } else {
                //sinon on rensigne du success
                instance.succes.set(true)
            }
        })
    },
    //ajout d'annonce de recherche de membre
    "click [LaunchAdvertsFixtures]": function (event, instance) {
        //on mémorise le début de l'opération
        let startTime = new Date().getTime()
        //on ouvre le panneau de retour
        instance.showResults.set(true)
        instance.Done.set(false)
        //on appele la methode d'ajout de membres et d'invitations
        Meteor.call('LaunchConversationsFixtures', (err) => {
            //on renseigne sur le temps écoulé
            let elapsedTime = new Date().getTime() - startTime
            instance.elapsedTime.set(elapsedTime)
            //on renseigne que l'opération est finie
            instance.Done.set(true)
            //on indique l'opération essayée
            instance.message.set("ajout des Conversations")
            //si il y a echec
            if (err) {
                console.log(err)
                //on passe succes a false
                instance.succes.set(false)
            } else {
                //sinon on rensigne du success
                instance.succes.set(true)
            }
        })
    },
    "click [LaunchConversationsFixtures]" : function (event, instance) {
        //on mémorise le début de l'opération
        let startTime = new Date().getTime()
        //on ouvre le panneau de retour
        instance.showResults.set(true)
        instance.Done.set(false)
        //on appele la methode d'ajout de membres et d'invitations
        Meteor.call('LaunchConversationsFixtures',instance.brunchOfConversationKeys, (err) => {
            //on renseigne sur le temps écoulé
            let elapsedTime = new Date().getTime() - startTime
            instance.elapsedTime.set(elapsedTime)
            //on renseigne que l'opération est finie
            instance.Done.set(true)
            //on indique l'opération essayée
            instance.message.set("ajout des annonces de recherche de nouveaux collaborateurs")
            //si il y a echec
            if (err) {
                console.log(err)
                //on passe succes a false
                instance.succes.set(false)
            } else {
                //sinon on rensigne du success
                instance.succes.set(true)
            }
        })
    }

});

Template.fixturesAndTests.onCreated(function () {
    //add your statement here
    this.showResults = new ReactiveVar(false)
    this.Done = new ReactiveVar(false)
    this.succes = new ReactiveVar(false)
    this.message = new ReactiveVar("")
    this.elapsedTime = new ReactiveVar()
    //on génére toutes les clefs nécessaires a la création des fixtures
    hubCrypto.generateUserAsymKeys("123456", "robin", (UserAsymKeys)=> {
        this.UserAsymKeys = UserAsymKeys
        hubCrypto.generateNewProjectBrunchOfKeys("projet de robin", UserAsymKeys.asymPublicKey, (brunchOfKeys) => {
            this.brunchOfKeys = brunchOfKeys
        })
        hubCrypto.generateNewConversationBrunchOfKeys(UserAsymKeys.asymPublicKey, UserAsymKeys.asymPublicKey, (brunchOfConvKey)=>{
            this.brunchOfConversationKeys = brunchOfConvKey
        })
    })
});

Template.fixturesAndTests.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
});

Template.fixturesAndTests.onDestroyed(function () {
    //add your statement here
});
