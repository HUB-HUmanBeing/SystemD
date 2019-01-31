
// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('layout', { main: 'landingPage' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('layout', { main: 'notFound' });
  },
};
