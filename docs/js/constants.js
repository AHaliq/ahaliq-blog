(() => {
    const rndc = () => Math.floor(Math.random() * 256);
    const newfg2 = tinycolor("rgb(" + [...Array(3).keys()].map(x => rndc()).join(",") + ")").saturate(10).darken(10).toString();
    document.documentElement.style.setProperty('--fg2-col', newfg2);
})();
// randomize fg color

const fg2 = getComputedStyle(document.documentElement).getPropertyValue('--fg2-col');
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