import Croppie from 'croppie';
import uploadFiles from "../../../../lib/uploadFiles";
import avatarStore from "../../../../lib/filesStore/avatarStore";
import User from "../../../../../imports/classes/User";

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
        let el = document.getElementById('cropAvatar');

        $('#modalEditAvatar').modal('open');
        instance.croppie= new Croppie(el, {
            viewport: { width: 200, height: 200, type:'circle' },
            boundary: { width: 300, height: 300 },
            showZoomer: true,
            enableOrientation: true
        });
        Meteor.setTimeout(()=>{
            let reader = new FileReader();
            reader.onload = function (e) {
                instance.croppie.bind({
                    url: e.target.result
                }).then(function () {
                });
            }
            reader.readAsDataURL(event.target.files[0]);
        },300)

//on button click
    },
    'click [chooseNewAvatar]' : function (event, instance) {
        event.preventDefault()
        instance.croppie.result({ type:'blob', format:'jpeg' , backgroundColor: '#FFFFFF'}).then((result)=>{
            const currentUser = User.findOne(Meteor.userId())
            uploadFiles.uploadBlob(result, Meteor.userId()+'.jpg',currentUser,  'getUpdateAvatarUrl', [],()=>{
                avatarStore.updateUserAvatar(Meteor.userId())
                $('#modalEditAvatar').modal('close');
            })
            event.preventDefault()
        })
    },
    'click [removeAvatar]' : function (event, instance) {
        event.preventDefault()
        console.log('coucou')
        const user = User.findOne(Meteor.userId())
        user.callMethod('deleteAvatar',(err)=>{
            if(!err){
                avatarStore.deleteUserAvatar(Meteor.userId())
            }else{
                console.log(err)
            }
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
    resetTooltips()
});

Template.editAvatar.onDestroyed(function () {
    //add your statement here
    if(this.croppie){
        this.croppie.destroy()
    }
});

