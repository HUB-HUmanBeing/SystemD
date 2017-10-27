import { Meteor } from 'meteor/meteor';

//pour que les meteor methds décrites dans les classes marchent, il faut penser a inclure les classes utilisées ici
import { Class } from 'meteor/jagi:astronomy';
import User from '/imports/classes/User';
import Project from '/imports/classes/Project';
Meteor.startup(() => {
  // Todo a enlever avant la publication, evite le spam mais genere des bugs lorsqu'on teste vite
    Accounts.removeDefaultRateLimit();

});
