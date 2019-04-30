import mapParams from "../../../../../lib/controllers/mapParams";
import cryptoTools from "../../../../../lib/cryptoTools";

Template.colorLegend.helpers({
    //add you helpers here
    colors: function () {
        return mapParams.colors
    },
    valueArray:function () {
        return []
    },
    showValidate:function () {
        return Template.instance().showValidate.get()
    }
});

Template.colorLegend.events({
    //add your events here
    'keypress [colorInput]': function (event, instance) {
        instance.showValidate.set(true)
    },
    'submit [saveLegend]':function (event, instance) {
        event.preventDefault()
        let colorLegends = []
        for (let i = 0; i <7 ; i++) {
            colorLegends.push($('#colorLegend-'+i).val())
        }
        //console.log(colorLegends)
        cryptoTools.encryptStringArray(colorLegends,Session.get("currentProjectSimKey"), encryptedColorLegend=>{
            instance.data.callback(encryptedColorLegend)
            instance.showValidate.set(false)
        })

    }
});

Template.colorLegend.onCreated(function () {
    //add your statement here
    this.showValidate = new ReactiveVar(false)
});

Template.colorLegend.onRendered(function () {
    //add your statement here
});

Template.colorLegend.onDestroyed(function () {
    //add your statement here
});

