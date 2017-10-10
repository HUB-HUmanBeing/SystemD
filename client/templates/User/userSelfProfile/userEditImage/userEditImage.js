Template.userEditImage.helpers({
    //add you helpers here
    imageUrl : function () {
        return Meteor.user().profile.imgUrl
    },
    editingImg : function () {
        return Template.instance().editingImg.get()
    },
    urlPreview : function () {
        return Template.instance().urlPreview.get()
    }
});

Template.userEditImage.events({
    //add your events here
    'click [editImgBtn]' : function (event, instance) {

        instance.editingImg.set(!instance.editingImg.get());
        Meteor.setTimeout(function(){$('.tooltipped').tooltip({delay: 50})}, 200)
    },
    'change input[type=file]': function(event, instance) {
        let files = event.currentTarget.files;
        Resizer.resize(files[0], {width: 200, height: 200, cropSquare: true}, function(err, file) {
            var reader = new window.FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                base64data = reader.result;
                Imgur.upload({
                    apiKey: "ef8302a3a9f657e",
                    image: base64data,
                    type: "base64"
                }, function (error, data) {
                    console.log(error)
                    console.log(data)
                    instance.urlPreview.set(data.link)
                    Meteor.setTimeout(function () {
                        $('.modal').modal();
                        $('#imgPreview').modal('open')
                    }, 100)

                }
            )}

        })
    }
});

Template.userEditImage.onCreated(function () {
    //add your statement here
    this.editingImg = new ReactiveVar(false)
    this.urlPreview = new ReactiveVar(false)
});

Template.userEditImage.onRendered(function () {
    //add your statement here
});

Template.userEditImage.onDestroyed(function () {
    //add your statement here
});

