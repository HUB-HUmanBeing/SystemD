
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';
import projectAvatarStore from "../../../lib/filesStore/projectAvatarStore";



Template.projectAvatar.helpers({
    //add you helpers here
    avatarSvg : function () {

        let options = { padding: .04, background:'#314549', hues:[1, 100, 84, 90, 36 , 200, 210, 270, 150, 350], colorLightness :40, grayscaleLightness:90,};
        let avatars = new Avatars(sprites(options));
        return  avatars.create(Template.currentData().projectId);
    },
    avatarUrl : function () {
        if(Template.currentData().projectId){
            return projectAvatarStore.getProjectAvatar(Template.currentData().projectId)
        }

    }
});

Template.projectAvatar.events({
    //add your events here
});

Template.projectAvatar.onCreated(function () {
    //add your statement here
});

Template.projectAvatar.onRendered(function () {
    //add your statement here
});

Template.projectAvatar.onDestroyed(function () {
    //add your statement here
});

