import avatarStore from "../../../../../lib/filesStore/avatarStore";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-identicon-sprites";

Template.memberList.helpers({
    //add you helpers here
    rest: function () {
        if(Template.currentData().members.length - 7 > 0){
            Template.instance().createTooltip()
        }
        return Template.currentData().members.length - 7 > 0 ? Template.currentData().members.length - 7 : false
    }
});

Template.memberList.events({
    //add your events here
});

Template.memberList.onCreated(function () {
    //add your statement here
    this.createTooltip = () => {
        let htmlTooltip = `<div class="otherMembersTooltips">`
        for (let i = 7; i < this.data.members.length; i++) {
            let requiredMember = {}
            Session.get("currentProjectMembers").forEach((member) => {
                if (member.memberId === this.data.members[i]) {
                    requiredMember = member
                }
            })
            userId = requiredMember.symEnc_userId;
            let avatarUrl = avatarStore.getUserAvatar(userId)
            let svgOptions = {padding: 0, background: '#165261'};
            let avatars = new Avatars(sprites(svgOptions));
            let avatarSvg = avatars.create(userId);
            htmlTooltip += `<div class="chip" style="display: block">`
            if (avatarUrl !== "noAvatar") {

                htmlTooltip += ` <img src="${avatarUrl}" alt="" class="" style="z-index:200; ">`

            } else {
                htmlTooltip += `<div class="svgAvatar" >
                                    ${avatarSvg}
                                </div>`
            }
            htmlTooltip += `
                        ${escapeHtml(requiredMember.symEnc_username)}
                      </div>`
        }
        htmlTooltip += "</div>"
        Meteor.setTimeout(() => {
            let $more = $("#otherMembers-" + this.data.type)

            if ($more) {
                $more.tooltip({
                    delay: 350,
                    position: "top",
                    html: true,
                    tooltip: htmlTooltip
                })
            }

        }, 600)
    }
});

Template.memberList.onRendered(function () {
    //add your statement here
    resetTooltips()

});

Template.memberList.onDestroyed(function () {
    //add your statement here
});

