import hubCrypto from '/client/lib/hubCrypto'
import zxcvbn from 'zxcvbn'

/**
 * Object in order to validate the signin form
 * @type {{checkUnicity(*, *): void, validateSigninPassword(*, *): void, isValid(*): *, validateSigninUsername(*, *): void, validateSigninPasswordRepeat(*, *): void}}
 */
const validateSigninForm = {
    /**
     *check if the name of the user is not already taken
     * @param username
     * @param callback
     */
    checkUnicity(username, callback) {
        Meteor.call('alreadyExists', username, function (error, result) {
            if (error) {
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
    validateSigninUsername(event, instance) {
        let signinUsername = $('#signinUsername').val();
        let errors = instance.errors.get()
        const regexMail = RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        if (signinUsername) {
            if (signinUsername.length < 4) {
                errors.signinUsername = ["votre nom d'utilisateur doit comporter au moins 4 caractères"]
                instance.errors.set(errors)
            } else if (signinUsername.length > 40) {
                errors.signinUsername = ["votre nom d'utilisateur ne doit pas faire plus de 40 caractères"]
                instance.errors.set(errors)
            } else if (regexMail.test(signinUsername)) {
                errors.signinUsername = ["votre nom d'utilisateur ne peut être une adresse e-mail"]
                instance.errors.set(errors)
            } else {
                this.checkUnicity(signinUsername, (isOk) => {
                    if (isOk) {
                        errors.signinUsername = 'valid'
                        instance.errors.set(errors)
                    } else {
                        errors.signinUsername = ["ce nom d'utilisateur est déjà pris"]
                        instance.errors.set(errors)
                    }
                })
            }
        } else {
            errors.signinUsername = ["veuillez inscrire votre nom d'utilisateur"]
            instance.errors.set(errors)
        }
    },
    /**********
     * check if the password given by the user is valid
     * @param event
     * @param instance
     */
    validateSigninPassword
        (event, instance) {

        let signinPassword = $('#signinPassword').val();
        let passwordStrength = parseInt(zxcvbn(signinPassword).guesses_log10 * 1.3)
        let preProgress = parseInt(passwordStrength*1.5)
        let progress = ((preProgress * 5)<100) ? (preProgress * 5) :100;
console.log(zxcvbn(signinPassword).guesses_log10)
            instance.passwordStrength.set({strength: passwordStrength, progress: progress})
        let errors = instance.errors.get()
        if (signinPassword) {
            if (passwordStrength < 10) {
                errors.signinPassword = ["La force du mot de passe doit au moins être de 1O"]
                instance.errors.set(errors)
            } else {
                errors.signinPassword = 'valid'
                instance.errors.set(errors)
            }
            let signinPasswordRepeat = $('#signinPasswordRepeat').val();
            if (signinPasswordRepeat && signinPassword !== signinPasswordRepeat) {
                errors.signinPasswordRepeat = ["Les mots de passes ne sont pas identiques"]
                instance.errors.set(errors)
            } else {
                errors.signinPasswordRepeat = 'valid'
                instance.errors.set(errors)
            }
        } else {
            errors.signinPassword = ["Veuillez saisir un mot de passe"]
            instance.errors.set(errors)
        }
    }
    ,
    /*********
     * check if the password repeat is ok
     * @param event
     * @param instance
     */
    validateSigninPasswordRepeat(event, instance) {
        let signinPassword = $('#signinPassword').val();
        let signinPasswordRepeat = $('#signinPasswordRepeat').val();
        let errors = instance.errors.get()
        if (!signinPasswordRepeat) {
            errors.signinPasswordRepeat = ["Veuillez confirmer votre mot de passe"]
            instance.errors.set(errors)
        } else if (signinPassword !== signinPasswordRepeat) {
            errors.signinPasswordRepeat = ["Les mots de passes ne sont pas identiques"]
            instance.errors.set(errors)
        } else {
            errors.signinPasswordRepeat = 'valid'
            instance.errors.set(errors)
        }
    }
    ,
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
                    errorList.push("Le formulaire d'inscription n'est pas valide")
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

Template.signinForm.helpers({
    //add you helpers here
    errors: function () {
        return Template.instance().errors.get()
    },
    passwordStrength: function () {
        return Template.instance().passwordStrength.get()
    },
});

Template.signinForm.events({
    //add your events here
    'keyup #signinUsername, touchend #signinUsername , blur #signinUsername ': function (event, instance) {
        if (instance.timeout) {
            Meteor.clearTimeout(instance.timeout)
        }
        instance.timeout = Meteor.setTimeout(() => {
            validateSigninForm.validateSigninUsername(event, instance)
        }, 400)
    },
    'keyup #signinPassword , touchend #signinPassword , blur #signinPassword ': function (event, instance) {
        validateSigninForm.validateSigninPassword(event, instance)
    },
    'keyup #signinPasswordRepeat , touchend #signinPasswordRepeat , blur #signinPasswordRepeat ': function (event, instance) {
        validateSigninForm.validateSigninPasswordRepeat(event, instance)
    },
    'submit #signinForm ': function (event, instance) {
        event.preventDefault()
        if (validateSigninForm.isValid(instance)) {
            let username = $('#signinUsername').val();
            let password = $('#signinPassword').val()
            hubCrypto.generateUserAsymKeys(password, username, (userAsymKeys) => {
                //on préformate l'objet a envoyer
                let userAttribute = {
                    username: username,
                    password: password,
                };
                //et on passe par une meteor method

                Meteor.call('createNewUser', userAttribute, userAsymKeys, function (error, result) {
                    //si ca échoue on renvoie l'erreur en toast
                    if (error) {
                        console.log(error, userAttribute, userAsymKeys)
                        Materialize.toast(error.message, 6000, 'red darken-3')
                    } else {
                        console.log(result)
                        // //si tout va bien on redirige vers la page pour completer le profil
                        // Meteor.loginWithPassword(username, password, function (error) {
                        //
                        //     hubCrypto.initCryptoSession(password,username, ()=>{
                        //
                        //     })
                        //     Router.go("userSelfProfile");
                        //     //et on toast un petit message de bienvenue
                        //     Materialize.toast("Bienvenue sur HUmanBeing", 6000, 'green')
                        // });
                    }
                })
            })
        }

    }
});

Template.signinForm.onCreated(function () {
    //add your statement here
    this.timeout = null
    this.passwordStrength = new ReactiveVar({
        strength: 0,
        progress: 0
    })
    this.errors = new ReactiveVar({
        signinUsername: [],
        signinPassword: [],
        signinPasswordRepeat: []
    })
});

Template.signinForm.onRendered(function () {
});

Template.signinForm.onDestroyed(function () {
    //add your statement here
});

