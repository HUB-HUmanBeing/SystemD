import i18n from "meteor/universe:i18n";
import Axios from "axios";

Template.newsFeed.helpers({
    //add you helpers here
    issueUrl: function () {
        return Template.instance().issueUrl.get()
    },
    isOpen: function () {
        return Template.instance().isOpen.get()
    },
    isUpToDate: function() {
        return Template.instance().isUpToDate.get()
    }
});

Template.newsFeed.events({
    'click [openModal]' : function (event, instance) {
        event.preventDefault();
        instance.isOpen.set(true);
        instance.isUpToDate.set(true);
        window.localStorage.setItem('newsFeedHist', Date.now());
        $('.news').css({
          height: '300px',
          width: '200px',
          right: '0',
        });
    }
})

Template.newsFeed.onCreated(function () {
    //add your statement here
    this.issueUrl = new ReactiveVar(false);
    this.isOpen = new ReactiveVar(false);
    this.isUpToDate = new ReactiveVar(true);
    this.lastView = window.localStorage.getItem('newsFeedHist');
});

Template.newsFeed.onRendered(function () {
    //GET request for newsFeed
    var template = this;

    $.get(
      'news/newsFeed.json',
      'false',
      function (feed) {
        template.feed = feed;
        //TODO marche pas à cause de la mise en cache de FF
        console.log(template.feed['lastUpdate'],template.lastView,Date.now());
        if(feed['lastUpdate']>template.lastView){
          template.isUpToDate.set(false);
          console.log('Point rouge');
        }
      },
      'json'
    );

    //Define modal 
    $('#modalNewsFeed').modal({
      startingTop: '4%', // Starting top style attribute
      endingTop: '4%',
      complete: function() { 
        template.isOpen.set(false);
        console.log('closed');      
        $('.news').css({
          height: '30px',
          right: 'calc(30px - 100%)',
          /*TODO handle hover ? 
          hover{
            width: 200px;
            right: 0;
            opacity: 1;
          }*/
        });
      } 
    });
});

Template.newsFeed.onDestroyed(function () {
    //add your statement here
});

