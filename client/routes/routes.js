/********
 * GENERAL ROUtES
 */
FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('mainLayout', {main: 'landingPage', header: 'landingHead'});
    },
});
FlowRouter.route('/donate', {
    name: 'App.home',
    action() {
        BlazeLayout.render('mainLayout', {main: 'donate'});
    },
});
FlowRouter.route('/login', {
    name: 'App.login',
    action() {
        if (!Meteor.userId()) {
            BlazeLayout.render('noLayout', {main: 'loginPage'});
        } else {
            FlowRouter.go("/")
        }

    },
});

FlowRouter.notFound = {
    name:'notFound',
    action() {
        BlazeLayout.render('noLayout', {main: 'notFound'});
    },
};

FlowRouter.route('/403', {
    name: 'App.login',
    action() {
        BlazeLayout.render('noLayout', {main: 'forbidden'});
    },
});
function checkLoggedOrReroute(context, redirect) {
    // context is the output of `FlowRouter.current()`
    if(!Meteor.userId()){
        redirect('/login')
    }
}
/*************
 * UserRoutes
 */
FlowRouter.route('/user-params', {
    name: 'App.userParams',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('mainLayout', {main: 'userParams'});
    },
});
/***********
 * invitation Route
 */
FlowRouter.route('/invitation/:invitationId', {
    name: 'App.userParams',
    action() {
        if (!Meteor.userId()) {
            BlazeLayout.render('noLayout', {main: 'invitation'});
        } else {
            BlazeLayout.render('mainLayout', {main: 'invitation'});
        }

    },
});

