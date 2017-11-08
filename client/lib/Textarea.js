Textarea = {
    tags: [{
        html: '</p>',
        htmlRegex: /<\/p>/gi,
        inDb: '|§p|',
        inDbRegex: /\|§p\|/gi
    }, {
        html: '<p>',
        htmlRegex: /<p>/gi,
        inDb: '|p|',
        inDbRegex: /\|p\|/gi
    }, {
        html: '<ul>',
        htmlRegex: /<ul>/gi,
        inDb: '|ul|',
        inDbRegex: /\|ul\|/gi
    }, {
        html: '</ul>',
        htmlRegex: /<\/ul>/gi,
        inDb: '|§ul|',
        inDbRegex: /\|§p\|/gi
    }, {
        html: '<li>',
        htmlRegex: /<li>/gi,
        inDb: '|li|',
        inDbRegex: /\|li\|/gi
    }, {
        html: '</li>',
        htmlRegex: /<\/li>/gi,
        inDb: '|§li|',
        inDbRegex: /\|§li\|/gi
    }, {
        html: '<b>',
        htmlRegex: /<b>/gi,
        inDb: '|b|',
        inDbRegex: /\|b\|/gi
    }, {
        html: '</b>',
        htmlRegex: /<\/b>/gi,
        inDb: '|§b|',
        inDbRegex: /\|§b\|/gi
    }, {
        html: '<i>',
        htmlRegex: /<i>/gi,
        inDb: '|i|',
        inDbRegex: /\|i\|/gi
    }, {
        html: '</i>',
        htmlRegex: /<\/i>/gi,
        inDb: '|§i|',
        inDbRegex: /\|§i\|/gi
    }, {
        html: '<u>',
        htmlRegex: /<u>/gi,
        inDb: '|u|',
        inDbRegex: /\|u\|/gi
    }, {
        html: '</u>',
        htmlRegex: /<\/u>/gi,
        inDb: '|§u|',
        inDbRegex: /\|§u\|/gi
    }, {//todo regex un peu buggé, ne marche pas en fin de phrase
        html: '<a href="$1">$2</a>',
        htmlRegex: /<a href="(http:\/\/[^\s]+)">(.+)<\/a>/gi,
        inDb: '|a href="$1"|$2|§a|',
        inDbRegex: /\|a href="(http:\/\/[^\s]+)"\|(.+)\|§a\|/gi
    },
    ],
    //action aexecuter avant la sauvegarde en bdd, on crée des balises br entre pipe comme code pour demander le retour a la ligne
    formatBeforeSave: function (text) {
        this.tags.forEach((tag) => {
            text = text.replace(tag.htmlRegex, tag.inDb)
        })
        return text
    },
    //action remplacant les balise de mise en base par des vrais br, et de mettre en balise anchor les liens eventuels,
    //à appeler au onrendered des balises concernées
    unformatBySelector: function (jQuerySelector) {
        let text = $(jQuerySelector).text();
        this.tags.forEach((tag) => {
            text = text.replace(tag.inDbRegex, tag.html)
        })
        //et on remplace aussi les urls stockées en dur pa des liens
        $(jQuerySelector).html(text
            .replace(/[\s](http:\/\/[^\s]+)[\s]/gi, '<a href="$1">$1</a>')
        );
    },
    //action pour reformater a l'identique le texte lorsqu'on passe en mode edition de textarea
    unformatForInputVal: function (formatedText) {
        return formatedText.replace(/\|br\|/gi, '\n')
    }
}