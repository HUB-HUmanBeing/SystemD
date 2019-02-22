Template.projectLayout.helpers({
    //add you helpers here
    decripting : function () {
        return Template.instance().decripting.get()
    }
});

Template.projectLayout.events({
    //add your events here
});

Template.projectLayout.onCreated(function () {
    //add your statement here
    this.decripting = new ReactiveVar( [
        'Déchiffrement des informations projet',
    ])

});

Template.projectLayout.onRendered(function () {
    //add your statement here
});

Template.projectLayout.onDestroyed(function () {
    //add your statement here
});

