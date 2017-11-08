Textarea = {
    //liste des caractères reformatés
    tags: [{
        html: '</p>',//le code html
        htmlRegex: /<\/p>/gi,//le regex pour les retrouver tous dans le texte
        inDb: '|§p|',//le code avec lequel on le garde en base
        inDbRegex: /\|§p\|/gi//le code avec lequel on retrouve toutes nos balises formatées pour la base
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
    }, {
        html: '<a href="$1">$2</a>',
        htmlRegex: /<a href="(http:\/\/[^\s]+)">([^<>]+)<\/a>/gi,
        inDb: '|a href="$1"|$2|§a|',
        inDbRegex: /\|a href="(http:\/\/[^\s]+)"\|([^<>]+)\|§a\|/gi
    },
    ],
    //action a executer avant la sauvegarde en bdd,
    formatBeforeSave: function (text) {
        //on parcours le tableau de tags concernés
        this.tags.forEach((tag) => {
            //et on remplace le regex par la valeur correspondante
            text = text.replace(tag.htmlRegex, tag.inDb)
        })
        return text
    },
    //action remplacant les balise de mise en base par des vrais balise,
    // à appeler au on rendered des balises concernées
    unformatBySelector: function (jQuerySelector) {
        let text = $(jQuerySelector).text();
        //on parcours toutes nos balises
        this.tags.forEach((tag) => {
            //et on remplace les fausse balises par des vraies balises
            text = text.replace(tag.inDbRegex, tag.html)
        })
        //et on remplace aussi les urls stockées en dur pa des liens pour etre sympa avec les utilisateurs
        $(jQuerySelector).html(text
            .replace(/[\s](http:\/\/[^\s]+)[\s]/gi, '<a href="$1">$1</a>')
        );
    },
    //action pour reformater a l'identique le texte lorsqu'on passe en mode edition de textarea
    unformatForInputVal: function (formatedText) {
        return formatedText.replace(/\|br\|/gi, '\n')
    }
}