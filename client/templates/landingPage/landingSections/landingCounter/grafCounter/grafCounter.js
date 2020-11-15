import Chart from 'chart.js'
import moment from "../../../../../lib/i18nMoment";

Template.grafCounter.helpers({
    //add you helpers here
});

Template.grafCounter.events({
    //add your events here
});

Template.grafCounter.onCreated(function () {
    //add your statement here
});

Template.grafCounter.onRendered(function () {
    //add your statement here
    let labels = []
    let data = []

    this.data.counters.tenLastMonth.forEach((count)=>{
        labels.push(moment(count.date).format("MMM YY"))
        data.push(count.total)
    })
console.log(data, labels,this.data.counters.tenLastMonth)
    var ctx = document.getElementById('graph').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels:labels,
            datasets: [{
                label: __('general.userCount'),
                backgroundColor: '#165261',
                borderColor: '#165261',
                data: data
            }]
        },

        // Configuration options go here
        options: {}
    });
});

Template.grafCounter.onDestroyed(function () {
    //add your statement here
});

