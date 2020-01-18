import Croppie from 'croppie';
import uploadFiles from "../../../../lib/uploadFiles";
import hubCrypto from "../../../../lib/hubCrypto";
import projectAvatarStore from "../../../../lib/filesStore/projectAvatarStore";
import Project from "../../../../../imports/classes/Project";
import projectController from "../../../../lib/controllers/projectController";


Template.editProjectAvatar.helpers({
    //add you helpers here

});

Template.editProjectAvatar.events({
    //add your events here
    'click [editProjectAvatarBtn]': function (event, instance) {
        event.preventDefault()
        $('#editProjectAvatar').click()
    },
    'click [closeEditProjectAvatar]': function (event, instance) {

        $('#modalEditProjectAvatar').modal('close');
    },
    'change #editProjectAvatar': function (event, instance) {
        event.preventDefault()
        let el = document.getElementById('cropAvatar');
        $('#modalEditProjectAvatar').modal('open');
        instance.croppie = new Croppie(el, {
            viewport: {width: 200, height: 200, type: 'square'},
            boundary: {width: 300, height: 300},
            showZoomer: true,
            enableOrientation: true
        });
        Meteor.setTimeout(() => {
            let reader = new FileReader();
            reader.onload = function (e) {
                instance.croppie.bind({
                    url: e.target.result
                }).then(function () {
                });
            }
            reader.readAsDataURL(event.target.files[0]);
        }, 300)

//on button click
    },
    'click [chooseNewProjectAvatar]': function (event, instance) {
        event.preventDefault()
        instance.croppie.result({type: 'blob', format: 'jpeg', backgroundColor: '#FFFFFF'}).then((result) => {
            const currentProject = instance.data.currentProject
            uploadFiles.uploadBlob(result, currentProject._id + '.jpg', currentProject, 'getUpdateProjectAvatarUrl', [projectController.getAuthInfo(instance.data.currentProject._id)], () => {
                projectAvatarStore.updateProjectAvatar(currentProject._id)
                $('#modalEditProjectAvatar').modal('close');
            })
        })

    },
    'click [removeProjectAvatar]': function (event, instance) {
        event.preventDefault()
        const project = Project.findOne(instance.data.currentProject._id)
        project.callMethod('deleteAvatar', projectController.getAuthInfo(instance.data.currentProject._id), (err) => {
            if (!err) {
                projectAvatarStore.deleteProjectAvatar(instance.data.currentProject._id)
            } else {
                console.log(err)
            }
        })
    }

});

Template.editProjectAvatar.onCreated(function () {


});

Template.editProjectAvatar.onRendered(function () {
    $('#modalEditProjectAvatar').modal({opacity: .3,});
    resetTooltips()
});

Template.editProjectAvatar.onDestroyed(function () {
    //add your statement here
    if (this.croppie) {
        this.croppie.destroy()
    }
    resetTooltips()
});

