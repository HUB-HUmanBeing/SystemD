Template.searchModal.helpers({
    isSearchingUser: function () {
        return Template.instance().isSearchingUser.get()
    },
    searchedInput: function () {
        return Session.get("searchedInput")
    },
    openSearchModal: function () {
        let isSearchingUser = Template.instance().isSearchingUser
        if (Session.get("openSearchModal")) {
            Meteor.setTimeout(() => {
                $('.swipable').tabs(
                    {
                        onShow(param) {
                            if (param.selector.split('#')[1] === "searchUserTab") {
                                isSearchingUser.set(true)

                            } else if (param.selector.split('#')[1] === "searchProjectTab") {
                                isSearchingUser.set(false)
                            }
                        }
                    }
                );
                Meteor.setTimeout(() => {
                    $('#searchUserTabSelector').click()
                }, 150)
            }, 150)
        }
        return Session.get("openSearchModal")
    }
});

Template.searchModal.events({
    //add your events here
});

Template.searchModal.onCreated(function () {
    //add your statement here
    this.isSearchingUser = new ReactiveVar(true)
});

Template.searchModal.onRendered(function () {
});

Template.searchModal.onDestroyed(function () {
    //add your statement here
});

