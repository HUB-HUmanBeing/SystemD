import Hashes from "jshashes";
import * as bcrypt from "bcrypt";

const cryptoServer = {
    hash(string) {
        return bcrypt.hashSync(string+ Meteor.settings.serverSalt, Meteor.settings.serverSaltRounds)

    },
    compare(elementToVerity, hash){
        return bcrypt.compareSync(elementToVerity+ Meteor.settings.serverSalt , hash);
},
    fastHash(string){
        return new Hashes.SHA512().b64(string + Meteor.settings.serverSalt)
    },
    fastCompare(elementToVerity, hash){
        return bcrypt.compareSync(elementToVerity , hash);
    }
}

export default cryptoServer
