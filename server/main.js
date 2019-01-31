import { Meteor } from 'meteor/meteor';

//pour que les meteor methds décrites dans les classes marchent, il faut penser a inclure les classes utilisées ici
import { Class } from 'meteor/jagi:astronomy';
Meteor.startup(() => {
  if(Meteor.isDevelopment){
      Accounts.removeDefaultRateLimit();
  }
});
