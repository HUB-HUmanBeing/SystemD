import {Class} from 'meteor/jagi:astronomy';
import Invitations from "../../lib/collections/Invitations";



const Invitation = Class.create({
    name: 'Invitation',
    collection: Invitations,
    fields: {
        symEnc_message:{
            type:String,
            optional: true,
        },
        hashedPassword: {
            type: String
        },
        projectId: {
            type: String,
            index:1
        },
        emittedBy: { //memberId of the admin who emit the invitation
            type: String
        },
        symEnc_projectSymKey: {
            type:String
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        validityDuration: {
            type: Number
        },
        remaining:{
            type: Number
        },

    },
    helpers: {

    }

});

export default Invitation
