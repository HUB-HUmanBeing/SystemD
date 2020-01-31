Template.inviteMembers.helpers({
    //add you helpers here
    projectMembers: function () {
        return Template.currentData().invitableMembers
    },
    selectedMembers: function () {
        return Template.instance().selectedMembers.get()
    },
    showSubmit: function () {
       return Template.instance().showSubmit.get()
    }
});

Template.inviteMembers.events({
    //add your events here
    'click [toggleMember]': function (event, instance) {
        event.preventDefault()
        let memberId = event.currentTarget.id.split('-')[1]

        let selectedMembers = instance.selectedMembers.get()
        console.log(selectedMembers)
        let index = selectedMembers.indexOf(memberId)
        if(index===-1){
            selectedMembers.push(memberId)
        }else{
            selectedMembers.splice(index,1)
        }
        instance.selectedMembers.set(selectedMembers)
        instance.showSubmit.set(true)
    },
    'click [inviteEverybody]':function (event, instance) {
        event.preventDefault()
        let memberIds=[]
        Session.get("currentProjectMembers").forEach(member=>{
            memberIds.push(member.memberId)
        })
        instance.showSubmit.set(true)
        instance.selectedMembers.set(memberIds)
    },
    'click [removeEverybody]':function (event, instance) {
        event.preventDefault()
        instance.showSubmit.set(true)
        instance.selectedMembers.set([])
    },
    'click [cancelModifs]':function (event, instance) {
        event.preventDefault()
        instance.showSubmit.set(false)
        instance.selectedMembers.set(instance.data.previousSelectedMembers)
    },
    'click [save]': function (event, instance) {
        event.preventDefault()
        instance.data.callbackSubmit(instance.data.previousSelectedMembers)
    }
});

Template.inviteMembers.onCreated(function () {
    //add your statement here
    this.showSubmit = new ReactiveVar(false)
    let previous = this.data.previousSelectedMembers
    this.selectedMembers = new ReactiveVar(previous)
});

Template.inviteMembers.onRendered(function () {
    //add your statement here
});

Template.inviteMembers.onDestroyed(function () {
    //add your statement here
});

