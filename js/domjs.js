function scrollToBottom() {
    window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}

function scrollPercent(elm) {
    var p = elm.parentNode;
    return (elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight) * 100;
}

function repositionCanvas() {
    const yp = scrollPercent(document.body);
    const cele = document.querySelector(".canvas");
    const pad = 0.4;
    if (document.documentElement.clientWidth < 600) {
        if (yp < 14) {
            cele.style.opacity = 0;
        } else if (yp < 35) {
            cele.style.opacity = (yp - 14) / (35 - 14);
        } else if (yp < 70) {
            cele.style.opacity = 1 - (yp - 35) / (70 - 35);
        } else {
            cele.style.opacity = 0;
        }
    } else {
        cele.style.opacity = 1;
        cele.style.top = Math.round((document.documentElement.clientHeight - hgt) * (yp * 0.01 * (1 - pad * 2) + pad)) + "px";
    }
}
// dom event functions