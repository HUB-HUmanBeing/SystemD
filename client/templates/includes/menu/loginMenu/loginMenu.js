Template.loginMenu.helpers({
    //ce helper contients les message d'erreurs eventuels du formulaire de signin
    errorText: function () {
        return Template.instance().errorText.get()
    },
    pulse: function () {
        return Template.instance().pulse.get()
    }
});

Template.loginMenu.events({
    //soumission du form de login
    'submit [login]': function (event) {
        event.preventDefault();
        //on récupère les valeurs du formulaire
        let username = event.target.username.value;
        let password = event.target.password.value;
        //on soumet le login
        Meteor.loginWithPassword(username, password, function (error) {
            // si il y a une erreur, on "toast" le message d'erreur

            if (error) {
                Materialize.toast(error.message, 6000, 'red')();
            }else{
                hubCrypto.storePrivateKeyInSession(password, ()=>{
                })
            }
        });
    },
    'keyup [username], touchend [username]': function (event, instance) {
        let signinUsername = $('#signinUsername').val();
        let errorMessage;
        //si elles sont identiques on vire le message d'erreur
        if (signinUsername.length < 4 || signinUsername.length > 35) {
            errorMessage = "le nom d'utilisateur doit comporter entre 5 et 35 caractères"
        } else {
            //sinon on indique l'erreur
            errorMessage = ""
        }//et on met a jour la réactive var
        instance.errorText.set(errorMessage)
    },
    //quant on remplit le repeat password
    'keyup [password-repeat], touchend [password-repeat]': function (event, instance) {
        //on ecupere les valeurs
        let password = $('#signin-password').val();
        let passwordRepeat = $('#password-repeat').val();
        let errorMessage;
        //si elles sont identiques on vire le message d'erreur
        if (passwordRepeat === password) {
            errorMessage = ""
        } else {
            //sinon on indique l'erreur
            errorMessage = "Les Passwords ne sont pas identiques"
        }//et on met a jour la réactive var
        instance.errorText.set(errorMessage)
    },
    //à l'envoi du formulaire d'inscription
    'submit [signin]': function (event, instance) {
        event.preventDefault();
        //on commence par checker qu'il n'y a pas d'erreur
        if (instance.errorText.get() === "") {
            //on récupere les valeurs du form
            let password = event.target.password.value;
            let passwordRepeat = event.target.passwordRepeat.value;
            let username = event.target.signinUsername.value;
            //on verifie bien que les mots de passe dont identiques
            if (passwordRepeat === password) {
                hubCrypto.generateUserAsymKeys(password, (userAsymKeys) => {
                    //on préformate l'objet a envoyer
                    let userAttribute = {
                        username: username,
                        password: password,
                    };
                    //et on passe par une meteor method
                    Meteor.call('createNewUser', userAttribute,userAsymKeys, function (error, result) {
                        //si ca échoue on renvoie l'erreur en toast
                        if (error) {
                            Materialize.toast(error.message, 6000, 'red')
                        } else {
                            //si tout va bien on redirige vers la page pour completer le profil
                            Meteor.loginWithPassword(username, password, function (error) {
                                hubCrypto.storePrivateKeyInSession(password, ()=>{
                                })
                                Router.go("userSelfProfile");
                                //et on toast un petit message de bienvenue
                                Materialize.toast("Bienvenue sur HUmanBeing", 6000, 'green')
                            });
                        }
                    })
                })

                //sinon on renvoie un message d'erreur
            } else {
                instance.errorText.set("Le formulaire n'est pas valide");
            }
            // sinon, on toast que le form est invalide
        } else {
            Materialize.toast("Le formulaire d'inscription n'est pas valide", 6000, 'red')
        }

    }
});

Template.loginMenu.onCreated(function () {
    //add your statement here
    this.errorText = new ReactiveVar()
    this.pulse = new ReactiveVar(true)
    Meteor.setTimeout(() => {
        this.pulse.set(false)
    }, 7000)
});

Template.loginMenu.onRendered(function () {
    //on initialise le compteur de caractères de matérialize
    $('input').characterCounter();

});

Template.loginMenu.onDestroyed(function () {
    //add your statement here
});

