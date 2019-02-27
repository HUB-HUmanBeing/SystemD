import Hashes from "jshashes";
import * as bcrypt from "bcrypt";

const cryptoServer = {
    hash(string) {
        return bcrypt.hashSync(string+ Meteor.settings.serverSalt, Meteor.settings.serverSaltRounds)

    },
    compare(elementToVerity, hash){
        return bcrypt.compareSync(elementToVerity+ Meteor.settings.serverSalt , hash);
}
}

export default cryptoServer
