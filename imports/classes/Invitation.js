import {Class} from 'meteor/jagi:astronomy';
import Invitations from "../../lib/collections/Invitations";

const InvitationMember = Class.create({
    name: 'InvitationMember',
    fields:{
        memberId: String,
        hashedAdminSignature: String

    }
})

const Invitation = Class.create({
    name: 'Invitation',
    collection: Invitations,
    fields: {
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
            type: Number //in hour
        },
        remaining:{
            type: Number
        },
        invitationMembers: [InvitationMember]

    },
    helpers: {
        isAlwaysValable(){
            let remainingOk = this.remaining>0
            let timeOK = Date.now()- this.createdAt.getTime() <this.validityDuration*3600*1000
            return timeOK && remainingOk
        }
    }

});

export default Invitation
