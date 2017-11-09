// module.exports = function () {
//
//     // Hooks
//     // this function is run before testing each scenario.
//     // it makes sure that we're using a test (i.e. empty) database.
//     this.Before(function (scenario) {
//
//         console.log('meteor running on:',
//             server._original.host + ':' + server._original.port);
//         console.log('about to test:', scenario.getName());
//         let result = server.execute(function () {
//             Meteor.call('clearDb');
//             // const cleanDB = require('server/methods/DevOnly.js').cleanDB;
//             console.log('counting...'); // displays in Meteor's console
//             return Meteor.users.find().fetch().length;
//         });
//         expect(result).toEqual(0);
//     });
//
//     // Tests
//
//     this.Given(/^I have visited "([^"]*)"$/, function (arg1) {
//         browser.url('http://localhost:3000');
//     });
//
//     this.When(/^I click on the connexion button$/, function () {
//         browser.moveToObject('ul li:nth-child(4)');
//         browser.click('ul li:nth-child(4)');
//     });
//
//     this.When(/^I signin as "([^"]*)" with password "([^"]*)"$/, function (name, password) {
//         browser.waitForExist('#signinUsername', 3000);
//         browser.setValue('#signinUsername', name);
//         browser.setValue('#signin-password', password);
//         browser.setValue('#password-repeat', password);
//         browser.click('form[signin] .btn-validation');
//     });
//
//     this.Then(/^I am on the "([^"]*)" page$/, function (path) {
//         browser.waitUntil(function () {
//             return browser.getUrl() === "http://localhost:3000" + path
//         }, 1000, 'some text');
//     });
//
//     this.Then(/^"([^"]*)" is registered$/, function (username) {
//
//         let signedUser = server.execute(function(){
//             return Meteor.users.findOne({}).username;
//         });
//         expect(signedUser).toEqual(username);
//     });
// };

describe('Sign in @watch', function () {

  before(function() {
    let userNumber = server.execute(function () {
      Meteor.call('clearDb');
      console.log('counting...'); // displays in Meteor's console
      return Meteor.users.find().fetch().length;
    });
    expect(userNumber).to.equal(0);
  });

  describe("I'm on HumanBeing", function () {
    it("should display the website", function () {
      browser.url('http://localhost:3000');
      let url = browser.getUrl();
      expect(url).to.equal('http://localhost:3000/');
    });
  });

  describe("I click on the connexion button", function () {
    it("should open the connexion accordion", function () {
      browser.click('#inscription');
    });
  });

  describe("I enter my username and password", function () {

    it("should register me", function () {
      browser.waitForExist('#signinUsername', 3000);
      browser.setValue('#signinUsername', 'jeremy');
      browser.setValue('#signin-password', 123456);
      browser.setValue('#password-repeat', 123456);
      browser.click('form[signin] .btn-validation');
    });

    it("should redirect me", function() {
      browser.waitUntil(function () {
        return browser.getUrl() === "http://localhost:3000/user/my_profile"
      }, 4000, 'some text');
    });

    it("should display my username in the first button on the left menu", function() {
      let username = browser.getText("#user div span");
      expect(username).to.equal("JEREMY");

      it("should push the user in the collection", function(){
        let user = server.execute(function () {
          return Meteor.users.findOne({"username":"jeremy"});
        });
        expect(user.username).to.equal("jeremy");
      })

    });
  });
});

