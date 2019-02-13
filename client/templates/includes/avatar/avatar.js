import Avatars from '@dicebear/avatars';
//https://www.npmjs.com/package/@dicebear/avatars-identicon-sprites
import sprites from '@dicebear/avatars-identicon-sprites';

Template.avatar.helpers({
    //add you helpers here

    avatar : function () {
        let user = Template.currentData().user
        if(!user.public.avatar){
            let options = { padding: 0, background:'#DBDBDB'};
            let avatars = new Avatars(sprites(options));
            return  avatars.create(user.username);
        }else{
            return 'user-picture'
        }
    }
});

Template.avatar.events({
    //add your events here
});

Template.avatar.onCreated(function () {
    //add your statement here
});

Template.avatar.onRendered(function () {
    //add your statement here
});

Template.avatar.onDestroyed(function () {
    //add your statement here
});

