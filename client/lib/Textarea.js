Textarea = {
    //action aexecuter avant la sauvegarde en bdd, on crée des balises br entre pipe comme code pour demander le retour a la ligne
    beforeSave :  function (text) {
        return text
            .replace(/\r?\n/g, '|br|').replace()
    },
    //action remplacant les balise de mise en base par des vrais br, et de mettre en balise anchor les liens eventuels,
    //à appeler au onrendered des balises concernées
    unformatBySelector :  function (jQuerySelector) {
        let text=$(jQuerySelector).text();
        $(jQuerySelector).html(text
                                .replace(/|br|"/gi, '<br />')
                                .replace( /(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' )
        );
    },
    //action pour reformater a l'identique le texte lorsqu'on passe en mode edition de textarea
    unformatForInputVal : function (formatedText) {
        return formatedText.replace( /\|br\|/gi,'\n')
    }
}