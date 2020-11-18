//import { CountUp } from 'countup.js'

Template.landingCounter.helpers({
    //add you helpers here
    counters: function () {
        return Template.instance().counters.get()
    }
});

Template.landingCounter.events({
    //add your events here
});

Template.landingCounter.onCreated(function () {
    //add your statement here

    this.counters = new ReactiveVar({})

    Meteor.call('getCounter', (err,res)=>{
        this.counters.set(res)
    })


});

Template.landingCounter.onRendered(function () {

});

Template.landingCounter.onDestroyed(function () {
    //add your statement here
});

