import QRious from "qrious";

Template.donate.helpers({
    //add you helpers here
    cryptos: function () {


        return [{
            label: "Bitcoin",
            img: "/images/icon/sauvegarde/btc.png",

            address: Meteor.settings.public.cryptos.btc,
            short: "btc"
        }, {
            label: "Eutherum",
            img: "/images/icon/sauvegarde/eth.png",

            address: Meteor.settings.public.cryptos.eth,
            short: "eth"
        }, {
            label: "XRP",
            img: "/images/icon/sauvegarde/xrp.png",

            address: Meteor.settings.public.cryptos.xrp,
            short: "xrp"
        }

        ]
    }

});

Template.donate.events({
    //add your events here
    "click [copyMagicLink]": function (event, instance) {
        const el = document.createElement('textarea');
        el.value = event.currentTarget.id.split('-')[1]
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        Materialize.toast(__("donate.copied"), 6000, "toastOk")
        instance.copied.set(true)
    },
    "click [openLink]": function (event, instance) {
       if(Meteor.isCordova){
           let href= event.currentTarget.getAttribute("href")
           document.addEventListener("deviceready", onDeviceReady, false);

           // device APIs are available
           //
           function onDeviceReady() {
               // external url
               window.open(encodeURI(href), '_system');

           }
       }


    },
});

Template.donate.onCreated(function () {
    //add your statement here
    this.copied = new ReactiveVar(false)
});

Template.donate.onRendered(function () {
    //add your statement here
    Meteor.setTimeout(() => {
        $('#donateCollapse').collapsible();
        Meteor.setTimeout(() => {
            $('#cryptoTabs').tabs();
            Meteor.setTimeout(() => {
                let getQR = function (adress, label) {

                    let qr = new QRious({
                        element: document.getElementById(label + '-qrCode'),
                        value: adress,
                        level: "Q",
                        background: "#ffffff",
                        foreground: "#263238",
                        size: 300,

                    })
                    console.log(qr)
                }
                let cryptos = ["btc", "eth", "xrp"]
                cryptos.forEach((crypto) => {
                    getQR(Meteor.settings.public.cryptos[crypto], crypto)
                })


            }, 100)
        }, 100)
    }, 1000)
})
;

Template.donate.onDestroyed(function () {
    //add your statement here
    $('#donateCollapse').collapsible('destroy');

});

