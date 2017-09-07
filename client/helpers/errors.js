Errors = new Meteor.Collection(null);

throwError = function(message) {
    Errors.insert({message: message});
};