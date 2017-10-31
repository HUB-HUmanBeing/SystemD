// On créer un controller de route personnalisé
isUserLogged = RouteController.extend({
    //On déclare une fonction qui sera éxécuter avant la fonction "action()" de la route
    onBeforeAction: function () {
        //On récupère l'utilisateur actuel
        this.currentUser = Meteor.userId();
        //On verifie si l'utilisateur est actuel bien connecté
        if (!this.currentUser) {
            //Si non on affiche le template 'access denied"
            this.render('accessDenied');
        } else {
            //Si oui on passe à la fonction "action()" de la route
            this.next();
        }
    },
});
