

const validateNewProjectForm = {
    /**
     *check if the name of the project is not already taken
     * @param username
     * @param callback
     */
    checkUnicity(projectName, callback) {
        Meteor.call('projectNameAlreadyExists', projectName, function (error, result) {
            if (error) {
                console.log(error)
                Materialize.toast("Une erreur s'est produite", 6000, 'red darken-3')
            } else {
                callback(!result)
            }
        })

    },
    /****
     * check if the username given by the user is valid
     * @param event
     * @param instance
     */
    validateProjectName(event, instance) {
        let projectName = $('#projectName').val();
        let errors = instance.errors.get()
        const regexMail = RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        if (projectName) {
            if (projectName.length < 4) {
                errors.projectName = ["votre nom de projet doit comporter au moins 4 caractères"]
                instance.errors.set(errors)
            } else if (projectName.length > 50) {
                errors.projectName = ["votre nom de projet ne doit pas faire plus de 50 caractères"]
                instance.errors.set(errors)
            } else if (regexMail.test(projectName)) {
                errors.projectName = ["votre nom de projet ne peut être une adresse e-mail"]
                instance.errors.set(errors)
            } else {
                this.checkUnicity(projectName, (isOk) => {
                    if (isOk) {
                        errors.projectName = 'valid'
                        instance.errors.set(errors)
                    } else {
                        errors.projectName = ["ce nom de projet est déjà pris"]
                        instance.errors.set(errors)
                    }
                })
            }
        } else {
            errors.projectName = ["veuillez donner un nom à votre projet"]
            instance.errors.set(errors)
        }
    },
    /***
     *  check if the form ids valid and inform the use
     * @param instance
     * @returns {boolean}
     */
    isValid(instance) {
        let errors = instance.errors.get()
        let errorList = []
        let isValid = true
        let missingFields = false
        Object.keys(errors).forEach((key) => {
            if (errors[key] != "valid") {
                isValid = false
                if (errorList.length == 0) {
                    errorList.push("Le formulaire de création de projet n'est pas valide")
                }
                if (errors[key].length) {
                    errorList = [...errorList, ...errors[key]]
                } else {
                    missingFields = true
                }
            }
        })
        if (missingFields) {
            errorList.push("Il manque des informations")
        }
        if (errorList.length) {
            errorList.forEach((err, i) => {
                Meteor.setTimeout(() => {
                    Materialize.toast(err, 6000, 'red darken-3')
                }, i * 500)

            })
        }
        return isValid
    }
}
Template.newProject.helpers({
    //add you helpers here
    errors: function () {
        return Template.instance().errors.get()
    },
    newProjectComplete: function () {
        return Template.instance().newProjectComplete.get()

    }
});

Template.newProject.events({
    //add your events here
    'keyup #projectName, touchend #projectName , blur #projectName ': function (event, instance) {
        if (instance.timeout) {
            Meteor.clearTimeout(instance.timeout)
        }
        instance.timeout = Meteor.setTimeout(() => {
            validateNewProjectForm.validateProjectName(event, instance)
        }, 400)
    },
    'submit #newProjectForm ': function (event, instance) {
        event.preventDefault()
        if (validateNewProjectForm.isValid(instance)) {
            let projectName = $('#projectName').val();

            // //on génére les clefs de ckiffrement
            // hubCrypto.generateUserAsymKeys(password, username, (userAsymKeys) => {
            //     //on préformate l'objet a envoyer
            //     let userAttribute = {
            //         username: username,
            //         password: password,
            //     };
            //     //et on passe par une meteor method pour creer notre user et stocker ses clefs
            //     Meteor.call('createNewUser', userAttribute, userAsymKeys, function (error, result) {
            //         //si ca échoue on renvoie l'erreur en toast
            //         if (error) {
            //             console.log(error, userAttribute, userAsymKeys)
            //             Materialize.toast(error.message, 6000, 'red darken-3')
            //         } else {
                        //ca lance le loader avec les infos de chiffrement pour l'utilisateur
                        instance.newProjectComplete.set([
                            'Génération des clefs de chiffrement du projet',
                            'Anonymisation de la liste de participants',
                            'Connexion chiffrée au projet'
                        ])

            //             //on laisse les infos de chiffrement plus que de raison pour que l'utilisateur puisse bien voir
                        Meteor.setTimeout(() => {

                            // Meteor.loginWithPassword(username, password, function (error) {
                            //     if(!error){//si ya pas de bug,on récupere les infos utilisateurs puis on initie une session chiffrée pour l'utilisateur
                            //         Meteor.subscribe("UserPrivateInfo", Meteor.userId(), ()=>{
                            //             cryptoTools.hash(password, (hashedPassword)=>{
                            //                 window.localStorage.setItem('hashedPassword',hashedPassword)
                            //                 hubCrypto.initCryptoSession(hashedPassword, username, () => {
                            //                     //si tout va bien on redirige vers la page pour completer le profil
                                                FlowRouter.go('/user-params')
                                                Materialize.toast("Le projet "+projectName+" a été créé.", 6000, 'lighter-bg')
                            //                 })
                            //             })
                            //
                            //         } )
                            //
                            //     }
                            // });
                        }, 4500)
            //         }
            //     })
            // })
        }

    }
});

Template.newProject.onCreated(function () {
    //add your statement here
    this.newProjectComplete = new ReactiveVar()
    this.errors = new ReactiveVar([])
});

Template.newProject.onRendered(function () {
    //add your statement here
});

Template.newProject.onDestroyed(function () {
    //add your statement here
});

