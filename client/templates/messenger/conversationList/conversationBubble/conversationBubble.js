Template.conversationBubble.helpers({
    //add you helpers here
});

Template.conversationBubble.events({
    //add your events here
    'click [OpenConversation]' : function (event, instance) {
        let openedConversations = Session.get("openedConversations" )?Session.get("openedConversations" ):[]
        let addConv = true
        openedConversations.forEach((conv)=>{
            if(conv.conversation_id === instance.data.conversation.conversation_id){
                addConv = false
            }
        })
        if(addConv){
            if (openedConversations.length<3){
                openedConversations.unshift(instance.data.conversation)
            }else{
                openedConversations[2]=openedConversations[1]
                openedConversations[1]=openedConversations[0]
                openedConversations[0]=instance.data.conversation
            }
            Session.set("openedConversations" , openedConversations)
        }

    }
});

Template.conversationBubble.onCreated(function () {
    //add your statement here
});

Template.conversationBubble.onRendered(function () {
    //add your statement here
});

Template.conversationBubble.onDestroyed(function () {
    //add your statement here
});

