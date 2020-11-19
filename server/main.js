//pour que les meteor methds décrites dans les classes marchent, il faut penser a inclure les classes utilisées ici
import {Meteor} from 'meteor/meteor';
import minioTools from '/imports/minioTools'
//pour que les meteor methds décrites dans les classes marchent, il faut penser a inclure les classes utilisées ici
import {Class} from 'meteor/jagi:astronomy';
import User from '/imports/classes/User';


Meteor.startup(() => {
    if (Meteor.isDevelopment) {
        Accounts.removeDefaultRateLimit();

    }
    let path = Npm.require('path');
    Meteor.absolutePath = path.resolve('.').split(path.sep + '.meteor')[0];
    minioTools.initialize()

});
// Listen to incoming HTTP requests, can only be used on the server
WebApp.connectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});


