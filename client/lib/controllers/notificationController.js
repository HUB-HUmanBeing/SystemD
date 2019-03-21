import cryptoTools from "../cryptoTools";

const notificationController = {
    /************************
     * retourne un tableau avec les notifs objects pour les admins d'un projet
     * @returns {Array}
     */
    getNotifyAdmins() {
        let notifObjects =[]

        const currentProjectMembers = Session.get('currentProjectMembers')
        currentProjectMembers.forEach(member => {
            if (member.role === "admin") {
                notifObjects.push(this.getNotifyObject(member))
            }
        })
        return notifObjects
    },
    /********************
     * retourne un objet contenant l'id de membre d'un utilisateur, son id, ainsi qu'un hash que le serveur pourra verifier pour authentifier ces infos
     * @param member
     * @returns {{hashControl: *, userId: (ProjectMember.fields.symEnc_userId|{type}), memberId: *}}
     */
    getNotifyObject(member){
        return {
            userId: member.symEnc_userId,
            memberId: member.memberId,
            hashControl: cryptoTools.fastBcryptHash(member.memberId + member.symEnc_userId)
        }
    }
}

export default notificationController
