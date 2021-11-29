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
    const bse = 0.2;
    const fbse = 1 - bse;
    if (document.documentElement.clientWidth < 600) {
        if (yp < 14) {
            cele.style.opacity = bse;
        } else if (yp < 35) {
            cele.style.opacity = bse + ((yp - 14) / (35 - 14)) * fbse;
        } else if (yp < 70) {
            cele.style.opacity = bse + (1 - (yp - 35) / (70 - 35)) * fbse;
        } else {
            cele.style.opacity = bse;
        }
    } else {
        cele.style.opacity = 1;
        cele.style.top = Math.round((document.documentElement.clientHeight - hgt) * (yp * 0.01 * (1 - pad * 2) + pad)) + "px";
    }
}
// dom event functions