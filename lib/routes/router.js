Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});

/***************************
 * page d'acceuil du site
 */
Router.route('/', {
    name: 'showcase'
});

/***************************
 * homepage
 */
Router.route('/home', {
    name: 'home'
});

/*********************************
 * page work in progess
 */
Router.route('/work_in_progress', {
    name: 'workInProgress'
});
