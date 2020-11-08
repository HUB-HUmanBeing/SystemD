import hubCrypto from '/client/lib/hubCrypto'
import cryptoTools from "../../../../lib/cryptoTools";
import inviteController from "../../../../lib/controllers/inviteController";
import i18n from "meteor/universe:i18n";

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
                Materialize.toast(__('loginFormJs.error'), 6000, 'toastError')
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
                errors.signinUsername = [__('signinFormJs.name4')]
                instance.errors.set(errors)
            } else if (signinUsername.length > 40) {
                errors.signinUsername = [__('signinFormJs.name40')]
                instance.errors.set(errors)
            } else if (regexMail.test(signinUsername)) {
                errors.signinUsername = [__('signinFormJs.errmail')]
                instance.errors.set(errors)
            } else {
                this.checkUnicity(signinUsername, (isOk) => {
                    if (isOk) {
                        errors.signinUsername = 'valid'
                        instance.errors.set(errors)
                    } else {
                        errors.signinUsername = [__('signinFormJs.alreadyTaken')]
                        instance.errors.set(errors)
                    }
                })
            }
        } else {
            errors.signinUsername = [__('signinFormJs.putName')]
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
        let passwordStrength = parseInt(cryptoTools.zxcvbn(signinPassword).guesses_log10 * 1.1)
        let preProgress = parseInt(passwordStrength * 2)
        let progress = ((preProgress * 5) < 100) ? (preProgress * 5) : 100;
        instance.passwordStrength.set({strength: passwordStrength, progress: progress})
        window.setTimeout(() => {
            $('.circle-container').tooltip({
                delay: 250,
                tooltip: `
                <div class="password-tooltip left-align" style="max-width: 200px">
                    <p>` + __('signinFormJs.crypt') + `</p>
                    <p class="infoQuotes">` + __('signinFormJs.use') + `<b>` + __('signinFormJs.characters') + `</b>` + __('signinFormJs.des') + `<b>` + __('signinFormJs.capital') + `</b>` + __('signinFormJs.and') + `<b>` + __('signinFormJs.number') + `</b>` + __('signinFormJs.up') + `</p>
                </div>
                `,
                html: true,
                position: 'left',
            });
        }, 100)
        let errors = instance.errors.get()
        if (signinPassword) {
            if (passwordStrength < 10) {
                errors.signinPassword = [__('signinFormJs.strength')]
                instance.errors.set(errors)
            } else {
                errors.signinPassword = 'valid'
                instance.errors.set(errors)
            }
            let signinPasswordRepeat = $('#signinPasswordRepeat').val();
            if (signinPassword !== signinPasswordRepeat) {
                errors.signinPasswordRepeat = [__('signinFormJs.samePwd')]
                instance.errors.set(errors)
            } else {
                errors.signinPasswordRepeat = 'valid'
                instance.errors.set(errors)
            }
        } else {
            errors.signinPassword = [__('signinFormJs.typePwd')]
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
            errors.signinPasswordRepeat = [__('signinFormJs.confirm')]
            instance.errors.set(errors)
        } else if (signinPassword !== signinPasswordRepeat) {
            errors.signinPasswordRepeat = [__('signinFormJs.samePwd')]
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
                    errorList.push(__('signinFormJs.form'))
                }
                if (errors[key].length) {
                    errorList = [...errorList, ...errors[key]]
                } else {
                    missingFields = true
                }
            }
        })
        if (missingFields) {
            errorList.push(__('signinFormJs.miss'))
        }
        if (errorList.length) {
            errorList.forEach((err, i) => {
                Meteor.setTimeout(() => {
                    Materialize.toast(err, 6000, 'toastError')
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
    },
    captcha: function () {
        return Template.instance().captcha.get().data
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
    /*****
     * Au submit du formulaire de login
     * @param event
     * @param instance
     */
    'submit #signinForm ': function (event, instance) {
        event.preventDefault()
        let captcha = {
            hashControl: instance.captcha.get().text,
            userInput: $("#SignInCaptcha").val()
        }
        if (validateSigninForm.isValid(instance)) {
            let username = $('#signinUsername').val();
            let password = $('#signinPassword').val()
            //on génére les clefs de ckiffrement
            //ca lance le loader avec les infos de chiffrement pour l'utilisateur
            instance.signinComplete.set([
                __('signinFormJs.generation'),
                __('signinFormJs.creation'),
                __('signinFormJs.initialization')
            ])
            hubCrypto.generateUserAsymKeys(password, username, (userAsymKeys) => {
                //on préformate l'objet a envoyer
                let userAttribute = {
                    username: username,
                    password: password,
                    language: window.localStorage.getItem("lang")
                };

                //et on passe par une meteor method pour creer notre user et stocker ses clefs
                Meteor.call('createNewUser', userAttribute, userAsymKeys, i18n.getLocale(), captcha,function (error, result) {
                    //si ca échoue on renvoie l'erreur en toast
                    if (error) {
                        instance.signinComplete.set(false)
                        Materialize.toast(error.message, 6000, 'toastError')
                    } else {
                        //on laisse les infos de chiffrement plus que de raison pour que l'utilisateur puisse bien voir
                        Meteor.setTimeout(() => {

                            Meteor.loginWithPassword(username, password, function (error) {
                                if (!error) {//si ya pas de bug,on récupere les infos utilisateurs puis on initie une session chiffrée pour l'utilisateur
                                    Meteor.subscribe("UserPrivateInfo", Meteor.userId(), () => {
                                        let hashedPassword = cryptoTools.heavyHash(password, username)

                                        window.localStorage.setItem('hashedPassword', hashedPassword)
                                        hubCrypto.initCryptoSession(hashedPassword, username, () => {
                                            let invitationId = FlowRouter.current().queryParams.invitationId
                                            let invitationPassword = FlowRouter.current().queryParams.password
                                            if (invitationId && invitationPassword) {
                                                inviteController.acceptInvitationId(invitationId, invitationPassword, (projectId) => {
                                                    hubCrypto.decryptAndStoreProjectListInSession(() => {
                                                        Materialize.toast(__('loginFormJs.welcome'), 6000, 'toastOk')
                                                        Materialize.toast(__('loginPage.invitationAccepted'), 6000, 'toastOk')
                                                        //si tout va bien on redirige vers la page pour completer le profil
                                                        FlowRouter.go('/user-params')
                                                        window.localStorage.setItem("lastOpenedProjectId", projectId)
                                                    })

                                                })
                                            } else {
                                                //si tout va bien on redirige vers la page pour completer le profil
                                                FlowRouter.go('/user-params')
                                                Materialize.toast(__('loginFormJs.welcome'), 6000, 'toastOk')
                                            }

                                        })
                                    })
                                } else {

                                    console.log(error)
                                }
                            });
                        }, 3000)
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
    this.captcha = new ReactiveVar({data: null, text: null})
    Meteor.call("getCaptcha", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(res)
            this.captcha.set(res)
        }
    })
});

Template.signinForm.onRendered(function () {
    resetTooltips()
});

Template.signinForm.onDestroyed(function () {
    //add your statement here
    $('.circle-container').tooltip('remove');
});

