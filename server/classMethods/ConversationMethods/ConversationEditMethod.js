import {check} from "meteor/check";

import Conversation from "../../../imports/classes/Conversation";

Conversation.extend({
    meteorMethods: {

        editName(authInfo, symEnc_name) {
            check(symEnc_name, String)
            check(authInfo, {memberId: String, userSignature: String})
            let conv = Conversation.findOne(this._id)
            check(conv.isMember(authInfo), true)
            conv.symEnc_name = symEnc_name
            return conv.save()
        },
    }
})
