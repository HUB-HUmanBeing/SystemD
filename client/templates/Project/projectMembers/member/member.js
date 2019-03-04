import moment from "../../../../lib/i18nMoment";

Template.member.helpers({
    //add you helpers here
    joinAtTs: function () {
        return new Date(Number(Template.currentData().member.symEnc_joinAtTs))
    }
});

Template.member.events({
    //add your events here
});

Template.member.onCreated(function () {
    //add your statement here
});

Template.member.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.member.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

