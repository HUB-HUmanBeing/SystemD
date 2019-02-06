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
    $("#signInForm").validate({
        rules: {
            uname: {
                required: true,
                minlength: 5
            },
            cemail: {
                required: true,
                email:true
            },
            password: {
                required: true,
                minlength: 5
            },
            cpassword: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            },
            curl: {
                required: true,
                url:true
            },
            crole:"required",
            ccomment: {
                required: true,
                minlength: 15
            },
            cgender:"required",
            cagree:"required",
        },
        //For custom messages
        messages: {
            uname:{
                required: "Enter a username",
                minlength: "Enter at least 5 characters"
            },
            curl: "Enter your website",
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });
});

Template.signinContainer.onRendered(function () {
    //add your statement here
});

Template.signinContainer.onDestroyed(function () {
    //add your statement here
});

