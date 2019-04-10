Template.beautyfullTextarea.helpers({
    //add you helpers here
    showEmojiPicker: function () {
        return Template.instance().showEmojiPicker.get()
    }
});

Template.beautyfullTextarea.events({
    //add your events here
    'click [toggleEmojiPicker]': function (event, instance) {
        event.preventDefault()
        instance.showEmojiPicker.set(!instance.showEmojiPicker.get())
    },
    'click [selectEmoji]': function (event, instance) {
        event.preventDefault()
        instance.showEmojiPicker.set(!instance.showEmojiPicker.get())
        let emoji = event.currentTarget.id.split('-')[1]
        $("#" + instance.data.id).val($("#" + instance.data.id).val() + emoji)
    },
});

Template.beautyfullTextarea.onCreated(function () {
    //add your statement here
    this.showEmojiPicker = new ReactiveVar(false)
});

Template.beautyfullTextarea.onRendered(function () {
    //add your statement here
    $('#newPublicationText').trigger('autoresize');
    $('#newPublicationText').characterCounter();
    $('#newPublicationText').focus()
});

Template.beautyfullTextarea.onDestroyed(function () {
    //add your statement here
});

