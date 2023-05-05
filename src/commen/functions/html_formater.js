export function isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--;) {
        if (c[i].nodeType == 1) return true;
    }

    return false;
}