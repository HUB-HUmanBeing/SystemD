Template.searchModal.helpers({
    searchedInput : function () {
        return Session.get("searchedInput")
    },
    openSearchModal : function () {

        if(Session.get("openSearchModal")){
          Meteor.setTimeout( ()=>{
              $('.swipable').tabs(
                  // { 'swipeable': true }
              );
          },50)
        }
        return Session.get("openSearchModal")
    }
});

Template.searchModal.events({
    //add your events here
});

Template.searchModal.onCreated(function () {
    //add your statement here
});

Template.searchModal.onRendered(function () {
    //add your statement here
    $('.swipable').tabs(
        // { 'swipeable': true }
    );
});

Template.searchModal.onDestroyed(function () {
    //add your statement here
});

