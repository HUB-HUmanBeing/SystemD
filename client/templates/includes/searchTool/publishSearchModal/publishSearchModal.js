Template.publishSearchModal.helpers({
    //add you helpers here
    //liste des catégories telle qu'elle est définie dans le tableau catégoryList
    categories: function () {
        return CategoryList
    },
});

Template.publishSearchModal.events({
    //add your events here
});

Template.publishSearchModal.onCreated(function () {
    //add your statement here
    console.log(this.data)
});

Template.publishSearchModal.onRendered(function () {
    //add your statement here
    $('#publishSearchModal').modal()
    Meteor.setTimeout(()=>{
        $('#publishSearchModal').modal('open')
    },50)
    resetTooltips()
});

Template.publishSearchModal.onDestroyed(function () {

});

