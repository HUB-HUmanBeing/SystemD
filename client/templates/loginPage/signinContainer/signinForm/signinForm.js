import hubCrypto from '/client/lib/hubCrypto'
import zxcvbn from 'zxcvbn'
import cryptoTools from "../../../../lib/cryptoTools";

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
        let passwordStrength = parseInt(zxcvbn(signinPassword).guesses_log10 * 1.1)
        let preProgress = parseInt(passwordStrength * 2)
        let progress = ((preProgress * 5) < 100) ? (preProgress * 5) : 100;
        instance.passwordStrength.set({strength: passwordStrength, progress: progress})
        window.setTimeout(() => {
            $('.circle-container').tooltip({
                delay: 250,
                tooltip: `
                <div class="password-tooltip left-align" style="max-width: 200px">
                    <p>Le chiffrement de vos contenus sur System-D est basé sur votre mot de passe, c'est pourquoi nous vous invitons à utiliser un mot de passe fort.</p>
                    <p class="infoQuotes">Utilisez des <b>caractères spéciaux</b>, des <b>majuscules</b> et des <b>chiffres</b> afin d'augmenter la force de votre mot de passe.</p>
                </div>
                `,
                html: true,
                position: 'left',
            });
        }, 100)
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
            if (signinPassword !== signinPasswordRepeat) {
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
    signinComplete: function () {
        return Template.instance().signinComplete.get()

    }
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
    /*****
     * Au submit du formulaire de login
     * @param event
     * @param instance
     */
    'submit #signinForm ': function (event, instance) {
        event.preventDefault()
        if (validateSigninForm.isValid(instance)) {
            let username = $('#signinUsername').val();
            let password = $('#signinPassword').val()
            //on génére les clefs de ckiffrement
            hubCrypto.generateUserAsymKeys(password, username, (userAsymKeys) => {
                //on préformate l'objet a envoyer
                let userAttribute = {
                    username: username,
                    password: password,
                };
                //et on passe par une meteor method pour creer notre user et stocker ses clefs
                Meteor.call('createNewUser', userAttribute, userAsymKeys, function (error, result) {
                    //si ca échoue on renvoie l'erreur en toast
                    if (error) {
                        console.log(error, userAttribute, userAsymKeys)
                        Materialize.toast(error.message, 6000, 'red darken-3')
                    } else {
                        //ca lance le loader avec les infos de chiffrement pour l'utilisateur
                        instance.signinComplete.set([
                            'Génération des clefs de chiffrement',
                            'Création du compte utilisateur',
                            'Initialisation d\'une nouvelle session chiffrée'
                        ])

                        //on laisse les infos de chiffrement plus que de raison pour que l'utilisateur puisse bien voir
                        Meteor.setTimeout(() => {

                            Meteor.loginWithPassword(username, password, function (error) {
                                if(!error){//si ya pas de bug,on récupere les infos utilisateurs puis on initie une session chiffrée pour l'utilisateur
                                    Meteor.subscribe("UserPrivateInfo", Meteor.userId(), ()=>{
                                        cryptoTools.hash(password, (hashedPassword)=>{
                                            window.localStorage.setItem('hashedPassword',hashedPassword)
                                            hubCrypto.initCryptoSession(hashedPassword, username, () => {
                                                //si tout va bien on redirige vers la page pour completer le profil
                                                FlowRouter.go('/user-params')
                                                Materialize.toast("Bienvenue sur System-D", 6000, 'lighter-bg')
                                            })
                                        })

                                    } )

                                }
                            });
                        }, 4500)
                    }
                })
            })
        }

    }
});

Template.signinForm.onCreated(function () {
    //add your statement here
    this.signinComplete = new ReactiveVar(false)
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
    $('.circle-container').tooltip('remove');
});

