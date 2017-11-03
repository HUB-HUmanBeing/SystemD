// module.exports = function() {
//     // Hooks
//     // this function is run before testing each scenario.
//     // it makes sure that we're using a test (i.e. empty) database.
//     this.Before(function(scenario) {
//         console.log('meteor running on:',
//             server._original.host + ':' + server._original.port);
//         console.log('about to test:', scenario.getName());
//         var result = server.execute(function() {
//             console.log('counting...'y); // displays in Meteor's console
//             return Meteor.users.find().fetch().length;
//         });
//         expect(result).toEqual(0);
//     });
//     // // this function is run after testing each scenario
//     // this.After(function(scenario) {
//     //     //
//     // });
//     // Tests
//     this.Given(/^I have visited "([^"]*)"$/, function (arg1) {
//         browser.url('http://google.com'); // ...or localhost:3000 ^^
//         // browser = WebdriverIO instance
//     });
//
//     this.When(/^I search for "([^"]*)"$/, function (searchTerm) {
//         browser.setValue('input[name="q"]'
//
module.exports = function () {
    // Hooks
    // this function is run before testing each scenario.
    // it makes sure that we're using a test (i.e. empty) database.
    this.Before(function (scenario) {
        console.log('meteor running on:',
            server._original.host + ':' + server._original.port);
        console.log('about to test:', scenario.getName());
        let result = server.execute(function () {
            console.log('counting...'); // displays in Meteor's console
            return Meteor.users.find().fetch().length;
        });
        expect(result).toEqual(0);
    });
    // // this function is run after testing each scenario
    // this.Before(function() {
    //     server.execute(function(){
    //         Meteor.call('clearDb');
    //     });

    // });
    // Tests
    this.Given(/^I have visited "([^"]*)"$/, function (arg1) {
        browser.url('http://localhost:3000'); // ...or localhost:3000 ^^
        // browser = WebdriverIO instance
    });

    this.When(/^I click on inscription$/, function () {
        browser.click('ul li:nth-child(4)');
    });

    this.Then(/^I signin as "([^"]*)" with password "([^"]*)"$/, function (name, password) {
        browser.setValue('#signinUsername', name);
        browser.setValue('#signin-password', password);
        browser.setValue('#password-repeat', password);
        browser.click('form[signin] .btn-validation');
        // console.log(Template.instance().completed());
    });
};