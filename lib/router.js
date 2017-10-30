import Project from '/imports/classes/Project';
import User from '/imports/classes/User';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    onBeforeAction: 'loading',
});

Router.route('/', {
    name: 'home'
});

Router.route('/user/my_profile', {
    name: 'userSelfProfile',
    onBeforeAction : function () {
        if (!Meteor.user()) {
            this.render('accessDenied');
        } else {
            this.next();
        }
    },
    waitOn: function () {
        return Meteor.subscribe('UserPrivateInfo', Meteor.userId())
    },
});
Router.route('/user/my_projects', {
    name: 'userSelfProjects',
    onBeforeAction : function () {
        if (!Meteor.user()) {
            this.render('accessDenied');
        } else {
            this.next();
        }
    },
    waitOn: function () {
        return Meteor.subscribe('UserPrivateInfo', Meteor.userId())
    }
});

Router.route('/user/:_id', {
    name: 'userMainPage',
    waitOn: function () {
        return Meteor.subscribe('userPublicInfo', this.params._id)
    },
    data: function () {
        return User.find({_id: this.params._id})
    }
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
    onBeforeAction : function () {
        if(Meteor.userId()){
            let project = Project.findOne({_id: this.params._id})
            if (!project.isMember(Meteor.userId())) {
                this.render('accessDenied');
            } else {
                this.next();
            }
        }else{
            this.render('accessDenied');
        }
    } ,
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.find({_id: this.params._id})

    }
})
Router.route('/project/:_id/organise/', {
    name: 'orgProject',
    onBeforeAction : function () {
        if(Meteor.userId()){
            let project = Project.findOne({_id: this.params._id})
            if (!project.isMember(Meteor.userId())) {
                this.render('accessDenied');
            } else {
                this.next();
            }
        }else{
            this.render('accessDenied');
        }
    } ,
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

Router.onBeforeAction('dataNotFound')