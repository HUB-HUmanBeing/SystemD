Template.layout.helpers({
    //add you helpers here
    contextualData : function () {

        let currentRouteArray = document.location.href.split("/");
        let contextualData = {}
        arborescenceStructure().forEach(function (item) {
            if (currentRouteArray[3] === item.id) {
                contextualData = item
            }
        })
        if (contextualData.id = "project") {
            Meteor.call('projectToolbarData', currentRouteArray[4], function (error, result) {
                if (!error) {
                    dump(result)

                    return result
                }
            })
        } else {
            return {}
        }
    }
});

Template.layout.events({
    //add your events here
});

Template.layout.onCreated(function () {
    //add your statement here
let string="aaaaaaaaaaazzzzzzzzzzeeeeeeeeeerrrrrrrrrrttttttttttyyyyyyyyyyuuuuuuuuuuiiiiiiiiiiooooooooooppppppppppqqqqqqqqqqqssssssssssdddddddddd"
    console.log(string)
    hubCrypto.generatePublicAndPrivateKey((key)=>{
        console.log(key)
        hubCrypto.getExportableKey(key.privateKey, (result)=>{
            console.log(result)
            hubCrypto.importKey(result,(result)=>{
                console.log(result)
            })
        })
        // hubCrypto.encrypt_data(string, key.publicKey, (encryptedData)=>{
        //     console.log(encryptedData)
        //     hubCrypto.decrypt_data(encryptedData, key.privateKey, (result)=>{
        //         console.log(result)
        //     })
        // })
    })

});

Template.layout.onRendered(function () {
    //add your statement here
});

Template.layout.onDestroyed(function () {
    //add your statement here
});

