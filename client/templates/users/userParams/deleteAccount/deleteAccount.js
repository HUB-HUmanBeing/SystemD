import hubCrypto from "../../../../lib/hubCrypto";
import User from "../../../../../imports/classes/User";

Template.deleteAccount.helpers({
    //add you helpers here
});

Template.deleteAccount.events({
    //add your events here
    'submit #deleteAccountForm ': function (event, instance) {
        event.preventDefault()
        let passwordConfirmation = $('#passwordConfirmation').val();
        // on récupere l'utilisateur courant
        FlowRouter.go('/')
        const currentUser = User.findOne({_id: Meteor.userId()});
        hubCrypto.destroyCryptoSession(()=>{
            Meteor.call(
                'deleteUserAccount',
                passwordConfirmation,
                (error, res) => {
                    console.log("truc")
                    // si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        Materialize.toast("une erreur s'est produite", 4000, 'red');
                    } else {
                        console.log(res)
                    }
                },
            );

                Materialize.toast('Votre compte utilisateur à été définitivement supprimé', 6000, 'light-bg');
                window.location.reload()


        })

    }
});

Template.deleteAccount.onCreated(function () {
    //add your statement here
});

Template.deleteAccount.onRendered(function () {
    //add your statement here
});

Template.deleteAccount.onDestroyed(function () {
    //add your statement here
});

