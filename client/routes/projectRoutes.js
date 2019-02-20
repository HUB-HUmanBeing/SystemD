function checkLoggedOrReroute(context, redirect) {
    // context is the output of `FlowRouter.current()`
    if(!Meteor.userId()){
        redirect('/login')
    }
}
/****************
 * ProjectRoutes
 */
FlowRouter.route('/new-project', {
    name: 'App.newProject',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('mainLayout', {main: 'newProject'});
    },
});
FlowRouter.route('/new-project', {
    name: 'App.newProject',
    triggersEnter: [checkLoggedOrReroute],
    action() {

        BlazeLayout.render('projectLayout', {main: 'newProject'});
    },
});
