Template.categoryItem.helpers({
    //add you helpers here
    categoryImg : function () {
        return CategoryList[Template.currentData().id].img
    },
    categoryLabel : function () {
        return CategoryList[Template.currentData().id].label
    }
});

Template.categoryItem.events({
    //add your events here
});

Template.categoryItem.onCreated(function () {
    //add your statement here
});

Template.categoryItem.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.categoryItem.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

