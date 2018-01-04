import UsersIndex from '/lib/collections/User'

Template.newConversationModal.helpers({
    //add you helpers here
    results : function () {
        return Template.instance().results.get()
    }
});

Template.newConversationModal.events({
    //add your events here
    'keyup #new-conv-name, touchend #new-conv-name': function (event, instance) {
        //on recupere la valeur entrée par l'utilisateur
        let name = event.target.value;
        //si la longueur est bonne
        if (name.length >= 4 && name.length <= 50) {
            //on garde en memoir le timestamp du dernier keyup
            instance.lastKeyUpTime.set(event.timeStamp);
            //on attends un peu
            Meteor.setTimeout(function () {
                //si le dernier keyup est celui de l'event
                if (instance.lastKeyUpTime.get() === event.timeStamp) {
                    //on appelle la methode qui renvoie un boolen en fonction de la disponibilité du nom demandé
                    Meteor.call('NewConvSearch', name, function (error, result) {
                        //si c'est bon en eface les message d'erreur et le disabled
                        if (error) {
                             console.log(error)
                        } else {
                            instance.results.set(result)
                        }
                    })
                }
            }, 350)
        }else{
            instance.results.set(false)
        }
    },
});

Template.newConversationModal.onCreated(function () {
    //add your statement here
    //chek de la derniere touche pressée pour eviter la surcharge de requetes
    this.lastKeyUpTime = new ReactiveVar();
    this.results = new ReactiveVar(false)
});

Template.newConversationModal.onRendered(function () {
    //add your statement here
    $('#new-conversation-modal').modal()
    resetTooltips()
});

Template.newConversationModal.onDestroyed(function () {
    //add your statement here
});

