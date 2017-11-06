Textarea = {
    perfectUrlRegex : new RegExp("/@^(https?|ftp)://[^s/$.?#].[^s]*$@iS"),
    beforeSave :  function (text) {
        return text.replace(/\r?\n/g, '|br|')
    },
    unformatBySelector :  function (jQuerySelector) {
        let text=$(jQuerySelector).text();
        $(jQuerySelector).html(text.replace("|br|", '<br />').replace( /(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' ));
    },
    unformatForInputVal : function (formatedText) {
        return formatedText.replace( /\|br\|/gi,'\n')
    }
}