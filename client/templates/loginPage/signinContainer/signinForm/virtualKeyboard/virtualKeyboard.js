Template.virtualKeyboard.helpers({
    //add you helpers here
    pinCode: function () {
        return Template.currentData().pinCode
    },
    keys: function () {
        let keys = []
        for (let i = 1; i < 10; i++) {
            keys.push(i)
        }
        keys.push(0)
        return keys
    }
});

Template.virtualKeyboard.events({
    //add your events here
    'click [keyInput]': function (event, instance) {
        event.preventDefault()
        let key = event.currentTarget.id.split('-')[1]
        let newPinCode = instance.data.parentInstance.pinCode.get() + key
        if(newPinCode.length<5){
            instance.data.parentInstance.pinCode.set(newPinCode)
        }


    },
    "click [clearPinCode]": function (event, instance) {
        event.preventDefault()
        instance.data.parentInstance.pinCode.set("")
    }
});

Template.virtualKeyboard.onCreated(function () {
    //add your statement here
});

Template.virtualKeyboard.onRendered(function () {
    //add your statement here
});

Template.virtualKeyboard.onDestroyed(function () {
    //add your statement here
});

