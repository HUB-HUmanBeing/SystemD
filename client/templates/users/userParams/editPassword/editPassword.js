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
        }else{
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
                    <p>` + __('editPasswordJs.crypt') +`(</p>
                    <p class="infoQuotes">` + __('editPasswordJs.use') +`<b>` + __('editPasswordJs.characters') +`</b>` + __('editPasswordJs.des') +`<b>` + __('editPasswordJs.capital') +`</b>` + __('editPasswordJs.des') +`<b>` + __('editPasswordJs.number') +`</b>` + __('editPasswordJs.up') +`</p>
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
    'submit #editPasswordForm ': function (event, instance) {
        event.preventDefault()
        if (validateUpdatePassword.isValid(instance)) {
            let oldPassword = $('#oldPassword').val();
            let newPassword = $('#newPassword').val()
            Accounts.changePassword(oldPassword, newPassword, function (error, result) {
                //si ca échoue on renvoie l'erreur en toast
                if (error) {
                    Materialize.toast(error.message, 6000, 'toastError')
                } else {
                    hubCrypto.encryptAsymKeyWithPassword(newPassword, Session.get('stringifiedAsymPrivateKey'), Meteor.user().username,(encryptedAsymPrivateKey)=>{
                        let  user = User.findOne(Meteor.userId())
                        user.callMethod('updateEncryptedAsymPrivateKey',encryptedAsymPrivateKey , (err, res)=> {
                            if(err){
                                console.log(err)
                            }else{

                                    hubCrypto.initCryptoSession(cryptoTools.heavyHash(newPassword, Meteor.user().username),Meteor.user().username, ()=>{
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
});

Template.editPassword.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.editPassword.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

