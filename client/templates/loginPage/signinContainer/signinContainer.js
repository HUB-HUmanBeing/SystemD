Template.signinContainer.helpers({
    //add you helpers here
    page : function () {
        return Template.instance().signinPage.get()
    },
    left : function () {
        return ((Template.instance().signinPage.get()%3 )*-100 )+ "%"
    }
});

Template.signinContainer.events({
    //add your events here
    'click [next] , touch [next]' : function (event, instance) {
        instance.signinPage.set(instance.signinPage.get() +1)
    }
});

Template.signinContainer.onCreated(function () {
    //add your statement here
    this.signinPage = new ReactiveVar(0)
});

Template.signinContainer.onRendered(function () {
    //add your statement here
});

Template.signinContainer.onDestroyed(function () {
    //add your statement here
});

