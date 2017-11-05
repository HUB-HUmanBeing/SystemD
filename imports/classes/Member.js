import {Class} from 'meteor/jagi:astronomy';
const Member = Class.create({
    name: 'Member',
    fields: {
        user_id: String,
        joinedAt: {
            type : Date,
            default : function () {
                return new Date()
            }
        },
        roles: {
            type: [String],
            default: ["member"]
        }

    },
});
export default Member