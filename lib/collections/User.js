import { Index, MinimongoEngine } from 'meteor/easy:search'

const UsersIndex = new Index({
    collection: Meteor.users,
    fields: ['username'],
    engine: new MinimongoEngine(),
})

export default UsersIndex