export function jwtToken() {
    const compileDigit = (digit) => { return `${digit < 10 ? "0" : ""}${digit}`; };
    let a = new Date();
    let b = { m: a.getMonth(), d: a.getDate() };
    let c = () => { return `${Math.floor(Math.random() * 9) + 1}`; }
    let d = ["X", "Y", "Z", "O", "D", "F", "N", "x", "z", "X", "Y", "Z", "O", "D", "F", "N", "x", "z"];
    return `${d[c()] + d[c()]}${compileDigit(b.m)}${compileDigit(b.d)}${d[c()] + d[c()]}${compileDigit(b.m + c())}${compileDigit(b.d + c())}`
}

export function idGen(code) {
    const compileDigit = (digit) => { return `${digit < 10 ? "0" : ""}${digit}`; };
    let a = new Date();
    let b = { m: a.getMinutes(), d: a.getSeconds() };
    let c = () => { return `${Math.floor(Math.random() * 9) + 1}`; }
    return `${code}${compileDigit(b.m)}${compileDigit(b.d)}${c()}   `
}