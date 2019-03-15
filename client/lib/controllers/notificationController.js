import cryptoTools from "../cryptoTools";

const notificationController = {
    getNotifyAdmins() {
        let notifObjects =[]

        const currentProjectMembers = Session.get('currentProjectMembers')
        currentProjectMembers.forEach(member => {
            if (member.role === "admin") {
                notifObjects.push(this.getNotifyObject(member))
            }
        })
        return notifObject
    },
    getNotifyObject(member){
        return {
            userId: member.symEnc_userId,
            memberId: member.memberId,
            hashControl: cryptoTools.fastBcryptHash(member.memberId + member.symEnc_userId)
        }
    }
}

export default notificationController
