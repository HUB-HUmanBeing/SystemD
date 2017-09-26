Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});

Router.route('/', {
    name : 'home'
});

Router.route('/user/my_profile', {
    name: 'userSelfProfile',
    waitOn: function() {
        return Meteor.subscribe('UserPrivateInfo', Meteor.userId())

    },
});

Router.route('/work_in_progress', {
    name: 'workInProgress'
});

let requireLogin = function() {
    if (! Meteor.user()) {
        this.render('accessDenied');
    } else {
        this.next();
    }
};
Router.onBeforeAction(requireLogin, {only: 'userSelfProfile'});