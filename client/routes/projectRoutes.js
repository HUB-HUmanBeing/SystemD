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
    name: 'newProject',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('mainLayout', {main: 'newProject'});
    },
});

FlowRouter.route('/project/:projectId/home', {
    name: 'project-home',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'projectHome'});
    },
});
FlowRouter.route('/project/:projectId/forum', {
    name: 'project-forum',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'projectForum'});
    },
});

FlowRouter.route('/project/:projectId/calendar', {
    name: 'project-calendar',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'projectCalendar'});
    },
});
FlowRouter.route('/project/:projectId/tasks', {
    name: 'project-tasks',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'projectTasks'});
    },
});
FlowRouter.route('/project/:projectId/maps', {
    name: 'project-maps',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'projectMaps'});
    },
});
FlowRouter.route('/project/:projectId/members', {
    name: 'project-members',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'projectMembers'});
    },
});
FlowRouter.route('/project/:projectId/params', {
    name: 'project-params',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'projectParams'});
    },
});
FlowRouter.route('/project/:projectId/new-invitation', {
    name: 'project-new-invitation',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'newInvitation'});
    },
});
FlowRouter.route('/project/:projectId/invitation/:invitationId', {
    name: 'project-show-invitation',
    triggersEnter: [checkLoggedOrReroute],
    action() {
        BlazeLayout.render('projectLayout', {main: 'showInvitation'});
    },
});
