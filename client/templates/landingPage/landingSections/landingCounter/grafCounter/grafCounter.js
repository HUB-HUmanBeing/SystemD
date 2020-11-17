import Chart from 'chart.js'
import moment from "../../../../../lib/i18nMoment";

Template.grafCounter.helpers({
    //add you helpers here
    temporality: function () {
        return Template.instance().temporality.get() == "months"
    }
});

Template.grafCounter.events({
    //add your events here
    "change [chooseTemporality]": function (event, instance) {
        event.preventDefault()

        let val = event.currentTarget.checked ? "months" : "weeks"
instance.temporality.set(val)
    }
});

Template.grafCounter.onCreated(function () {
    //add your statement here
    this.temporality = new ReactiveVar("months")

    this.showGraff = (temporality) => {
        Meteor.call('getCounterArray', temporality, Meteor.Device.isPhone() ?10 : 18,  (err, res) => {
            let labels = []
            let data = []

            Meteor.setTimeout(()=>{
                res.forEach((count) => {
                    labels.push(moment(count.date).format(temporality == "months" ? "MMM YY" : "DD MMM"))
                    data.push(count.total)
                })
                let ctx = document.getElementById('graph').getContext('2d');
                let chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: labels,
                        datasets: [{
                            label: false,
                            backgroundColor: '#165261',
                            borderColor: '#165261',
                            data: data
                        }]
                    },

                    // Configuration options go here
                    options: {
                        legend: {
                            display: false
                        }
                    }
                });
            })

        })

    }
});

Template.grafCounter.onRendered(function () {
    //add your statement here
    this.autorun(() => {
        let temporality = this.temporality.get()
        this.showGraff(temporality)
    })
});

Template.grafCounter.onDestroyed(function () {
    //add your statement here
});

