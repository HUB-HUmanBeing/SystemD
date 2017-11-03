import { Meteor } from 'meteor/meteor';

//pour que les meteor methds décrites dans les classes marchent, il faut penser a inclure les classes utilisées ici
import { Class } from 'meteor/jagi:astronomy';
import User from '/imports/classes/User';
import Project from '/imports/classes/Project';
Meteor.startup(() => {
  if(Meteor.isDevelopment){
      Accounts.removeDefaultRateLimit();
  }
});
