import {unicodeToShortnames} from "emojitsu";

function replaceSmileyByEmoji(text) {
    let map = {
        "<3": "❤",
        ":D": "😀",
        ":)": "🙂",
        ";)": "😉",
        ":(": "😦",
        ":p": "😋",
        ";p": "😜",
        ":'(": "😓",
        ':/ ': "😑"
    };

    let escapeSpecialChars = (regex) => {
        return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
    }
    for (let i in map) {
        let regex = new RegExp(escapeSpecialChars(i), 'gim');
        text = text.replace(regex, map[i]);
    }
    return text
}
var preFormatMessage = function(message){
    return unicodeToShortnames(replaceSmileyByEmoji(message))
}
export default preFormatMessage
