//

const validateSigninForm = {
    checkUnicity(username, callback) {
        callback(true)
    },
    validateSigninUsername(event, instance, callback) {
        let signinUsername = $('#signinUsername').val();
        let errors = instance.errors.get()
        if (signinUsername) {
            if (signinUsername.length < 5) {
                errors.signinUsername = ["votre nom d'utilisateur doit comporter au moins 5 caractères"]
                instance.errors.set(errors)
            } else if (signinUsername.length > 40) {
                errors.signinUsername = ["votre nom d'utilisateur ne doit pas faire plus de 40 caractères"]
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
    validateSigninPassword(event, instance) {
        let signinPassword = $('#signinPassword').val();
        let errors = instance.errors.get()
        const regexPassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")
        if (signinPassword) {
            if (signinPassword.length < 8) {
                errors.signinPassword = ["votre mot de passe doit comporter au moins 8 caractères"]
                instance.errors.set(errors)
            } else if (!regexPassword.test(signinPassword)) {
                console.log('co')
                errors.signinPassword = ["votre mot de passe doit comporter au moins une lettre majuscule, une lettre minuscule, et un chiffre"]
                instance.errors.set(errors)
            } else {
                errors.signinPassword = 'valid'
                instance.errors.set(errors)
            }
        } else {
            errors.signinPassword = ["veuillez saisir un mot de passe"]
            instance.errors.set(errors)
        }
    },
    validateSigninPasswordRepeat(event, instance) {
        let signinPassword = $('#signinPassword').val();
        let signinPasswordRepeat = $('#signinPasswordRepeat').val();
        let errors = instance.errors.get()
        if (!signinPasswordRepeat) {
            errors.signinPasswordRepeat = ["veuillez confirmer votre mot de passe"]
            instance.errors.set(errors)
        } else if (signinPassword !== signinPasswordRepeat) {
            errors.signinPasswordRepeat = ["Les mots de passes ne sont pas identiques"]
            instance.errors.set(errors)
        } else {
            errors.signinPasswordRepeat = 'valid'
            instance.errors.set(errors)
        }
    }
}

Template.signinForm.helpers({
    //add you helpers here
    errors: function () {
        return Template.instance().errors.get()
    }
});

Template.signinForm.events({
    //add your events here
    'keyup #signinUsername ': function (event, instance) {
        if (instance.timeout) {
            Meteor.clearTimeout(instance.timeout)
        }
        instance.timeout = Meteor.setTimeout(() => {
            validateSigninForm.validateSigninUsername(event, instance)
        }, 400)
    },
    'keyup #signinPassword , touchend #signinPassword , blur #signinPassword ': function (event, instance) {
        if (instance.timeout) {
            Meteor.clearTimeout(instance.timeout)
        }
        instance.timeout = Meteor.setTimeout(() => {
            validateSigninForm.validateSigninPassword(event, instance)
        }, 600)

    },
    'keyup #signinPasswordRepeat , touchend #signinPasswordRepeat , blur #signinPasswordRepeat ': function (event, instance) {
        if (instance.timeout) {
            Meteor.clearTimeout(instance.timeout)
        }
        instance.timeout = Meteor.setTimeout(() => {
            validateSigninForm.validateSigninPasswordRepeat(event, instance)
        }, 600)

    },
});

Template.signinForm.onCreated(function () {
    //add your statement here
    this.timeout = null
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

