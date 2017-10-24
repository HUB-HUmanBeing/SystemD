import User from '/imports/classes/User';

User.extend({
    meteorMethods: {
        computedInfo() {
            user= User.findOne(this._id)
            return {
                nbOfProjects: user.nbOfProjects(),
                distance: user.distance()
            }
        }
    }
});