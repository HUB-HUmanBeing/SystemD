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
        console.log(res)
        this.counters.set(res)
    })


});

Template.landingCounter.onRendered(function () {
    //add your statement here
    // this.memberCounter = new CountUp('myTargetElement', 5844);
    // if (!this.memberCounter.error) {
    //     this.memberCounter.start();
    // } else {
    //     console.error(this.memberCounter.error);
    // }
    // this.projectCounter = new CountUp('myTargetElement', 5844);
    // if (!this.projectCounter.error) {
    //     this.projectCounter.start();
    // } else {
    //     this.projectCounter.error(this.projectCounter.error);
    // }
});

Template.landingCounter.onDestroyed(function () {
    //add your statement here
});

