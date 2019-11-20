import i18n from "meteor/universe:i18n";
import Axios from "axios";

Template.newsFeed.helpers({
    //add you helpers here
    isOpen: function () {
        return Template.instance().isOpen.get()
    },
    isUpToDate: function() {
        return false// Template.instance().isUpToDate.get()
    },
    getContent: function () {
        console.log(Template.instance())
        return Template.instance().content.get()
    }
});

Template.newsFeed.events({
    'click [openModal]' : function (event, instance) {
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
    this.content = new ReactiveVar('');
});

Template.newsFeed.onRendered(function () {
    //GET request for newsFeed
    var template = this;

    $.get(
      'news/newsFeed.json',
      'false',
      function (newsJson) {
        template.newsJson = newsJson;
        //TODO marche pas à cause de la mise en cache de FF
        console.log(template.newsJson['lastUpdate'],template.lastView,Date.now());
        if(newsJson['lastUpdate']<template.lastView){
          template.isUpToDate.set(false);
        }
        template.content=newsJson['new1']
        console.log(template.content)
      },
      'json'
    );

    //Define modal 
    $('#modalNewsFeed').modal({
      startingTop: '4%', // Starting top style attribute
      endingTop: '4%',
      complete: function() { 
        template.isOpen.set(false);
      } 
    });
});

Template.newsFeed.onDestroyed(function () {
    //add your statement here
});

