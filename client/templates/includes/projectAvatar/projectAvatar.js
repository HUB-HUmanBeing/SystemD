
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';
import avatarStore from "../../../lib/avatarStore";


Template.projectAvatar.helpers({
    //add you helpers here
    avatarSvg : function () {

        let options = { padding: .04, background:'#314549', hues:[1, 4, 84, 36 , 200, 105, 33], colorLightness :90, grayscaleLightness:90,};
        let avatars = new Avatars(sprites(options));
        return  avatars.create(Template.currentData().projectId);
    },
    avatarUrl : function () {
        //return avatarStore.getUserAvatar(Template.currentData().user._id)
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

