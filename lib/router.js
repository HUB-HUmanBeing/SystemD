import Project from '/imports/classes/Project';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});

Router.route('/', {
    name: 'home'
});

Router.route('/user/my_profile', {
    name: 'userSelfProfile',
    waitOn: function () {
        return Meteor.subscribe('UserPrivateInfo', Meteor.userId())

    },
});

Router.route('/project/:_id', {
    name: 'projectMainPage',
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.find({_id: this.params._id})

    }
})
Router.route('/project/:_id/admin/', {
    name: 'adminProject',
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.find({_id: this.params._id})

    }
})
Router.route('/project/:_id/members/', {
    name: 'membersProject',
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.find({_id: this.params._id})

    }
})

Router.route('/work_in_progress', {
    name: 'workInProgress'
});

let requireLogin = function () {
    if (!Meteor.user()) {
        this.render('accessDenied');
    } else {
        this.next();
    }
};
Router.onBeforeAction(requireLogin, {only: 'userSelfProfile'});