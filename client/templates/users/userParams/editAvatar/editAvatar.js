import Croppie from 'croppie';

Template.editAvatar.helpers({
    //add you helpers here
});

Template.editAvatar.events({
    //add your events here
    'click [editUserAvatarBtn]' : function (event, instance) {
        event.preventDefault()
        $('#editUserAvatar').click()
    },
    'click [closeEditUserAvatar]' : function (event, instance) {

        $('#modalEditAvatar').modal('close');
    },
    'change #editUserAvatar' : function (event, instance) {
        event.preventDefault()
        $('#modalEditAvatar').modal('open');
        let reader = new FileReader();
        reader.onload = function (e) {
            instance.croppie.bind({
                url: e.target.result
            }).then(function () {
            });
        }
        reader.readAsDataURL(event.target.files[0]);
//on button click
    },
    'click [chooseNewAvatar]' : function (event, instance) {
        event.preventDefault()
        console.log('test')
        instance.croppie.result({ type:'base64', size:'viewport', format:'jpeg', quality:0.6, circle:true }).then((result)=>{
            console.log(result)
            event.preventDefault()
        })
    }

});

Template.editAvatar.onCreated(function () {
    //add your statement here
    this.croppie = null

});

Template.editAvatar.onRendered(function () {
    //add your statement here
    $('.modal').modal({ opacity: .3,});
    let el = document.getElementById('cropAvatar');
    this.croppie= new Croppie(el, {
        viewport: { width: 150, height: 150, type:'circle' },
        boundary: { width: 300, height: 300 },
        showZoomer: true,
        enableOrientation: true
    });
    $('.tooltipped').tooltip({delay: 50});
});

Template.editAvatar.onDestroyed(function () {
    //add your statement here
    if(this.crop){
        this.crop.destroy()
    }
});

