import i18n from "meteor/universe:i18n";
import Axios from "axios";

Template.newsFeed.helpers({
    //add you helpers here
    isOpen: function () {
        return Template.instance().isOpen.get()
    },
    isUpToDate: function () {
        return false // Template.instance().isUpToDate.get()
    },
    newsArray: function () {
        return Template.instance().newsArray.get()
    }
});

Template.newsFeed.events({
    'click [openModal]': function (event, instance) {
        event.preventDefault();
        instance.isOpen.set(true);
        instance.isUpToDate.set(true);
        window.localStorage.setItem('newsFeedHist', Date.now());
    }
})

Template.newsFeed.onCreated(function () {
    //add your statement here
    this.isOpen = new ReactiveVar(false);
    this.isUpToDate = new ReactiveVar(true);
    this.lastView = window.localStorage.getItem('newsFeedHist');
    this.newsArray = new ReactiveVar([]);

    let url = Meteor.isDevelopment ? "news/newsFeed.json" :Meteor.settings.public.newsURL
    console.log(url)
    $.get(
        url,
        'false',
        (newsJson) => {
            //TODO marche pas à cause de la mise en cache de FF
           // console.log(this.newsJson['lastUpdate'], this.lastView, Date.now());
            if (newsJson['lastUpdate'] < this.lastView) {
                this.isUpToDate.set(false);
            }
            this.newsArray.set(newsJson['newsArray'])
            console.log(this.newsArray.get())
        },
        'json'
    );
});

Template.newsFeed.onRendered(function () {
    //GET request for newsFeed


    //Define modal
    $('#modalNewsFeed').modal({
        startingTop: '4%', // Starting top style attribute
        endingTop: '4%',
        complete: () => {
            this.isOpen.set(false);

        },
        ready: function (modal, trigger) {

        }
    });
});

Template.newsFeed.onDestroyed(function () {
    //add your statement here
});

