Template.loginMenu.helpers({
    //add you helpers here
    passwordError: function () {
        return Template.instance().passwordError.get()
    }
});

Template.loginMenu.events({
    //add your events here
    'submit [login]': function (event) {
        event.preventDefault();
        let username = event.target.username.value;
        let password = event.target.password.value;
        Meteor.loginWithPassword(username, password, function (error) {
            if(error.message){
                Materialize.toast(error.message, 6000, 'red')();
            }
        });
    },
    'keyup [password-repeat]': function (event, instance) {
        let password = $('#signin-password').val();
        let passwordRepeat = $('#password-repeat').val()
        let errorMessage;
        if (passwordRepeat === password) {
            errorMessage = ""
        } else {
            errorMessage = "Les Passwords ne sont pas identiques"
        }
        instance.passwordError.set(errorMessage)
    },
    'submit [signin]': function (event, instance) {
        event.preventDefault();
        if(instance.passwordError.get() === ""){
            let password = event.target.password.value;
            let passwordRepeat = event.target.passwordRepeat.value;
            let username = event.target.signinUsername.value;
            if(passwordRepeat === password){
                let userAttribute = {
                    username : username,
                    password : password
                };
                Meteor.call('createNewUser', userAttribute, function (error, result) {
                    if(error){
                        Materialize.toast(error.message, 6000, 'red')
                    }else{
                        Meteor.loginWithPassword(username, password, function (error) {
                            Router.go("userSelfProfile");
                            Materialize.toast("Bienvenue sur HUmanBeing", 6000, 'green')
                        });
                    }
                } )
            }else{
                instance.passwordError.set("Le formulaire n'est pas valide");
            }
        }else{
            Materialize.toast("Le formulaire d'inscription n'est pas valide", 6000, 'red')
        }

    }
});

Template.loginMenu.onCreated(function () {
    //add your statement here
    this.passwordError = new ReactiveVar()

});

Template.loginMenu.onRendered(function () {
    //add your statement here
    $('input').characterCounter();
});

Template.loginMenu.onDestroyed(function () {
    //add your statement here
});

