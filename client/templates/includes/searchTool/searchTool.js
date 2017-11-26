Template.searchTool.helpers({
    //add you helpers here
    //distance a partir de laquelle on retourne les posts
    range: function () {
        return Template.instance().range.get()
    },
    //spécifique a l'affichage, si c'est false, ca
    shownRange: function () {
        return Template.instance().range.get() === 150 ?
            "Rechercher Partout" :
            'à moins de '+Template.instance().range.get()+'km'
    },
    categories : function () {
        return CategoryList
    },
    ownerCategories : function () {
        let ownerCategories = []
        let owner = Template.instance().data.callingFrom

        if(owner === "userProjects" ){
            ownerCategories = Meteor.user().profile.categories
        }else if(owner === "projectMembers"){
            ownerCategories = Template.instance().data.project.publicInfo.categories
        }
        return ownerCategories
    }
});

Template.searchTool.events({
    //add your events here
    //lorsque l'utilisateur modifie la distance
    'change [range]': function (event, instance) {
        //on passe la nouvelle valeur dans la réactive var
        instance.range.set(parseInt($('.range-field input').val()))
    }
});

Template.searchTool.onCreated(function () {
    //add your statement here
    let range = this.data.callingFrom === "menu"? 150 : 30;


    this.range = new ReactiveVar(range);
});

Template.searchTool.onRendered(function () {
    //add your statement here
    $('#chosenCategory').material_select();
    Meteor.setTimeout(()=>{
        Materialize.updateTextFields();
        resetTooltips()

    },150)

});

Template.searchTool.onDestroyed(function () {
    $('#chosenCategory').material_select('destroy');
});

