
import { Class } from 'meteor/jagi:astronomy';

const Profile = Class.create({
    name : 'Profile',
    fields : {
        description: {
            type: String,
            optional : true,
            validator : [
                {type : 'maxLength',
                    param : 1000}
            ],
        }
    },
});

const User = Class.create({
    name: 'User',
    collection: Meteor.users,
    fields: {
        emails: {
           type: [String],
            optional : true
        } ,
        services: Object,
        createdAt: Date,
        profile : {
            type: Profile
        }
    },
    meteorMethods: {
    updateDescription(value) {
        this.profile.description = value;
        return this.save()

    }
}
});

export default User;