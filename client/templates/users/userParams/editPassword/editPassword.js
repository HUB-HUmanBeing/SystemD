import hubCrypto from '/client/lib/hubCrypto'

import User from "/imports/classes/User";
import cryptoTools from "../../../../lib/cryptoTools";

/**
 * Object in order to validate the signin form
 * @type {{checkUnicity(*, *): void, validatenewPassword(*, *): void, isValid(*): *, validateoldPassword(*, *): void, validatenewPasswordRepeat(*, *): void}}
 */
const validateUpdatePassword = {
    /****
     * check if the username given by the user is valid
     * @param event
     * @param instance
     */
    validateOldPassword(event, instance) {
        let oldPassword = $('#oldPassword').val();
        let errors = instance.errors.get()
        if (!oldPassword) {
            errors.oldPassword = [__('deleteAccountJs.previousPwd')]
            instance.errors.set(errors)
        } else {
            errors.oldPassword = "valid"
            instance.errors.set(errors)
        }
    },
    /**********
     * check if the password given by the user is valid
     * @param event
     * @param instance
     */
    validateNewPassword
        (event, instance) {

        let newPassword = $('#newPassword').val();
        let passwordStrength = parseInt(cryptoTools.zxcvbn(newPassword).guesses_log10 * 1.1)
        let preProgress = parseInt(passwordStrength * 2)
        let progress = ((preProgress * 5) < 100) ? (preProgress * 5) : 100;
        instance.passwordStrength.set({strength: passwordStrength, progress: progress})
        window.setTimeout(() => {
            $('.circle-container').tooltip({
                delay: 250,
                tooltip: `
                <div class="password-tooltip left-align" style="max-width: 200px">
                    <p>` + __('editPasswordJs.crypt') + `(</p>
                    <p class="infoQuotes">` + __('editPasswordJs.use') + `<b>` + __('editPasswordJs.characters') + `</b>` + __('editPasswordJs.des') + `<b>` + __('editPasswordJs.capital') + `</b>` + __('editPasswordJs.des') + `<b>` + __('editPasswordJs.number') + `</b>` + __('editPasswordJs.up') + `</p>
                </div>
                `,
                html: true,
                position: 'left',
            });
        }, 100)
        let errors = instance.errors.get()
        if (newPassword) {
            if (passwordStrength < 10) {
                errors.newPassword = [__('editPasswordJs.strength')]
                instance.errors.set(errors)
            } else {
                errors.newPassword = 'valid'
                instance.errors.set(errors)
            }
            let newPasswordRepeat = $('#newPasswordRepeat').val();
            if (newPassword !== newPasswordRepeat) {
                errors.newPasswordRepeat = [__('editPasswordJs.samePwd')]
                instance.errors.set(errors)
            } else {
                errors.newPasswordRepeat = 'valid'
                instance.errors.set(errors)
            }
        } else {
            errors.newPassword = [__('editPasswordJs.typePwd')]
            instance.errors.set(errors)
        }
    }
    ,
    /*********
     * check if the password repeat is ok
     * @param event
     * @param instance
     */
    validateNewPasswordRepeat(event, instance) {
        let newPassword = $('#newPassword').val();
        let newPasswordRepeat = $('#newPasswordRepeat').val();
        let errors = instance.errors.get()
        if (!newPasswordRepeat) {
            errors.newPasswordRepeat = [__('editPasswordJs.confirm')]
            instance.errors.set(errors)
        } else if (newPassword !== newPasswordRepeat) {
            errors.newPasswordRepeat = [__('editPasswordJs.samePwd')]
            instance.errors.set(errors)
        } else {
            errors.newPasswordRepeat = 'valid'
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
                if (errorList.length === 0) {
                    errorList.push(__('editPasswordJs.form'))
                }
                if (errors[key].length) {
                    errorList = [...errorList, ...errors[key]]
                } else {
                    missingFields = true
                }
            }
        })
        if (missingFields) {
            errorList.push(__('editPasswordJs.miss'))
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


Template.editPassword.helpers({
    //add you helpers here
    //add you helpers here
    errors: function () {
        return Template.instance().errors.get()
    },
    passwordStrength: function () {
        return Template.instance().passwordStrength.get()
    },
    updatePasswordComplete: function () {
        return Template.instance().updatePasswordComplete.get()

    },
    securized: function () {
        return Template.instance().securized.get()
    },
    securizeModal: function () {
        return Template.instance().securizeModal.get()
    },
    showSecurize: function () {

        return Template.instance().errors.get().newPasswordRepeat === 'valid' && Template.instance().errors.get().newPassword === 'valid'
    },
    parentInstance: function () {
        return Template.instance()
    },
    verifiedPassword: function () {
        return Template.instance().verifiedPassword.get()
    },
    pinCode: function () {
        return Template.instance().pinCode.get()
    },
    forceSecurize: function () {
        return Template.instance().forceSecurize.get()
    },
    isSubmitable: function () {
        return !Template.instance().forceSecurize.get() || Template.instance().pinCode.get().length===4
    }
});

Template.editPassword.events({
    //add your events here
    //add your events here
    'keyup #oldPassword, touchend #oldPassword , blur #oldPassword ': function (event, instance) {
        validateUpdatePassword.validateOldPassword(event, instance)
    },
    'keyup #newPassword , touchend #newPassword , blur #newPassword ': function (event, instance) {
        validateUpdatePassword.validateNewPassword(event, instance)
    },
    'keyup #newPasswordRepeat , touchend #newPasswordRepeat , blur #newPasswordRepeat ': function (event, instance) {
        validateUpdatePassword.validateNewPasswordRepeat(event, instance)
    },
    "click [closeSecurizeModal]": function (event, instance) {
        event.preventDefault()
        $("#securizedSwitch").prop('checked', false);
        instance.securizeModal.set(false)
        instance.securized.set(false)
        resetTooltips()
        instance.verifiedPassword.set(false)
        instance.pinCode.set("")
    },
    'change [securizedSwitch]': function (event, instance) {
        event.preventDefault()
        instance.securizeModal.set(true)
        cryptoTools.verifyPwned($('#newPassword').val(), (err, res) => {
            Meteor.setTimeout(() => {
                if (err) {
                    console.log(err)
                    instance.verifiedPassword.set("err")
                } else {
                    if (res === "verified") {
                        instance.verifiedPassword.set("verified")
                        resetTooltips()
                    } else {
                        console.log(res)
                        instance.verifiedPassword.set(res)
                    }
                }
            }, 1700)
        })
        resetTooltips()
    },
    'click [validateSecurize]': function (event, instance) {
        event.preventDefault()
        $("#securizedSwitch").prop('checked', true);
        instance.securizeModal.set(false)
        instance.securized.set(true)
        resetTooltips()
        instance.verifiedPassword.set(true)
    },
    'submit #editPasswordForm ': function (event, instance) {
        event.preventDefault()
        if (validateUpdatePassword.isValid(instance) && (!Template.instance().forceSecurize.get() || Template.instance().pinCode.get().length===4)) {
            let oldPassword = $('#oldPassword').val();
            let newPassword = $('#newPassword').val()
            let pinCode = instance.pinCode.get()
            Accounts.changePassword(oldPassword, newPassword, function (error, result) {
                //si ca échoue on renvoie l'erreur en toast
                if (error) {
                    Materialize.toast(error.message, 6000, 'toastError')
                } else {
                    hubCrypto.encryptAsymKeyWithPassword(newPassword, Session.get('stringifiedAsymPrivateKey'), Meteor.user().username, pinCode, (encryptedAsymPrivateKey, salt, superPassword) => {
                        let user = User.findOne(Meteor.userId())
                        user.callMethod('updateEncryptedAsymPrivateKey', encryptedAsymPrivateKey, salt, pinCode, (err, res) => {
                            if (err) {
                                console.log(err)
                            } else {
                                if (pinCode) {
                                    //Session.set("superPassword", superPassword)
                                    window.localStorage.setItem('hashedPassword', cryptoTools.heavyHash(newPassword, Meteor.user().username))
                                    hubCrypto.decryptAndStorePrivateKeyInSession(superPassword, Meteor.user().username, () => {
                                        hubCrypto.decryptAndStoreProjectListInSession(() => {

                                            instance.updatePasswordComplete.set([
                                                __('editPasswordJs.pwdChange'),
                                                __('editPasswordJs.encryptionKey'),
                                                __('editPasswordJs.initialization')
                                            ])
                                            Meteor.setTimeout(() => {
                                                //si tout va bien on redirige vers la page pour completer le profil
                                                instance.updatePasswordComplete.set(false)
                                                $('editPasswordCollapse').collapsible('close', 0);
                                            }, 4000)
                                        })
                                    })
                                } else {
                                    hubCrypto.initCryptoSession(cryptoTools.heavyHash(newPassword, Meteor.user().username), Meteor.user().username, () => {
                                        instance.updatePasswordComplete.set([
                                            __('editPasswordJs.pwdChange'),
                                            __('editPasswordJs.encryptionKey'),
                                            __('editPasswordJs.initialization')
                                        ])
                                        Meteor.setTimeout(() => {
                                            //si tout va bien on redirige vers la page pour completer le profil
                                            instance.updatePasswordComplete.set(false)
                                            $('editPasswordCollapse').collapsible('close', 0);
                                        }, 4000)
                                    })
                                }


                            }


                        })
                    })
                }
            })
        }
    }

})
;

Template.editPassword.onCreated(function () {

    //add your statement here
    this.forceSecurize= new ReactiveVar(false)
    this.securized = new ReactiveVar(false)
    this.securizeModal = new ReactiveVar(false)
    this.verifiedPassword = new ReactiveVar("waiting")
    this.pinCode = new ReactiveVar("")
    this.updatePasswordComplete = new ReactiveVar(false)
    this.passwordStrength = new ReactiveVar({
        strength: 0,
        progress: 0
    })
    this.errors = new ReactiveVar({
        oldPassword: [],
        newPassword: [],
        newPasswordRepeat: []
    })
    this.autorun(()=>{
        Session.get("projects").forEach(project=>{
            if(project.securized){
                this.forceSecurize.set(true)
            }
        })
    })
});

Template.editPassword.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.editPassword.onDestroyed(function () {
    //add your statement here
    resetTooltips()
    $('.circle-container').tooltip('remove');
});

