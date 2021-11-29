(() => {
    const ele = document.getElementById('circ');
    const circtxt = new CircleType(ele);
    ele.style.width = circtxt._radius * 2 + "px";
})();
// setup circle spinner logo

function circClick() {
    document.documentElement.style.setProperty('--fg-col', bg);
    document.documentElement.style.setProperty('--bg-col', fg1);
    document.documentElement.style.setProperty('--fg-rgb', bgrgb);
    document.documentElement.style.setProperty('--bg-rgb', fgrgb);
    let t = fg1;
    fg1 = bg;
    bg = t;
    t = fgrgbarr;
    fgrgbarr = bgrgbarr;
    bgrgbarr = t;
    t = fgrgb;
    fgrgb = bgrgb;
    bgrgb = t;
    t = fgb;
    fgb = bgb;
    bgb = t;
    document.querySelector("#about-section").style.setProperty('background-color', 'rgba(var(--bg-rgb), 0.7)');
    runner.inTransition = true;
    runner.t = 0;
}
// circle logo onclick