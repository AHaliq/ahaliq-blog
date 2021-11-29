const randomizeFg2 = () => {
    //80,55 -- pastel
    //20,37 -- original sat and light
    //97,47 -- bright
    const newfg2 = tinycolor("hsl(" + Math.floor(Math.random() * 101) + "%,97%,47%)").toString();
    document.documentElement.style.setProperty('--fg2-col', newfg2);
    fg2 = newfg2;
    runner.updateFg2(fg2);
};
// randomize fg colorconst

let fg2 = getComputedStyle(document.documentElement).getPropertyValue('--fg2-col');
let fg1 = getComputedStyle(document.documentElement).getPropertyValue('--fg-col');
let bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-col');
let fgrgb = getComputedStyle(document.documentElement).getPropertyValue('--fg-rgb');
let fgrgbarr = fgrgb.split(',').map(x => parseInt(x.trim()));
let bgrgb = getComputedStyle(document.documentElement).getPropertyValue('--bg-rgb');
let bgrgbarr = bgrgb.split(',').map(x => parseInt(x.trim()));
let fg, fgb, bgb, hi;
// capture color variables

const wdt = 600;
const hgt = 600;
// p5js canvas dimensions