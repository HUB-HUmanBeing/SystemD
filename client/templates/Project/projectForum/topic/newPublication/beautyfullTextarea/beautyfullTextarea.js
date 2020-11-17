Template.beautyfullTextarea.helpers({
    //add you helpers here
    showEmojiPicker: function () {
        return Template.instance().showEmojiPicker.get()
    },
    initialContent: function () {
        return Template.instance().data.content
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
    $('#'+this.data.id).trigger('autoresize');
    $('#'+this.data.id).characterCounter();
   // $('#'+this.data.id).focus()
});

Template.beautyfullTextarea.onDestroyed(function () {
    //add your statement here
});

