
// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('layout', { main: 'landingPage' });
  },
});

FlowRouter.route('/login', {
  name: 'App.login',
  action() {
    if(!Meteor.userId()){
      BlazeLayout.render('noLayout', { main: 'loginPage' });
    }else{
      FlowRouter.go("/")
    }

  },
});


FlowRouter.notFound = {
  action() {
    BlazeLayout.render('noLayout', { main: 'notFound' });
  },
};
