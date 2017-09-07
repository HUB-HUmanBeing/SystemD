Template.registerHelper('pluralize', function(n, thing) {
    // pluraliser assez simpliste
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});