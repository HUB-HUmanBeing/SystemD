import Hashes from "jshashes";

const cryptoServer = {
    hash(string) {
        return new Hashes.SHA512().b64(string+ Meteor.settings.serverSalt)
    }
}

export default cryptoServer
