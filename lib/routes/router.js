


Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    onBeforeAction: 'loading',
});

Router.route('/', {
    name: 'home'
});

/*********************************
 * page work in progess
 */
Router.route('/work_in_progress', {
    name: 'workInProgress'
});

Router.onBeforeAction('dataNotFound')