//pour que les meteor methds décrites dans les classes marchent, il faut penser a inclure les classes utilisées ici
import { Meteor } from 'meteor/meteor';
import minioTools from '/imports/minioTools'
//pour que les meteor methds décrites dans les classes marchent, il faut penser a inclure les classes utilisées ici
import { Class } from 'meteor/jagi:astronomy';
import User from '/imports/classes/User';


Meteor.startup(() => {
  if(Meteor.isDevelopment){
      Accounts.removeDefaultRateLimit();

  }
  minioTools.initialize()

});
if(Meteor.isDevelopment){
    let key = process.env.PWD + '/private/localhost.key';
    let cert = process.env.PWD + '/private/localhost.cert';
    SSL(key, cert, 3003);
}

