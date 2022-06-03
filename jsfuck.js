// Expect the given JSFuck expression (given as string) to evaluate to
// the given result / JS object. Used for quick & dirty unit tests and
// documentation in the following.
function ee2(expression, expectedResult) {
    var result;
    try {
        result = eval(expression);
    }
    catch (exception) {
        console.log(`An error occurred while trying to evaluate "${expression}":`);
        throw exception;
    }

    var agreement;
    if (isNaN(expectedResult)) {
        agreement = isNaN(result);
    }
    else {
        agreement = result === expectedResult;
    }

    if (!agreement) {
        throw Error(`'${expression}' did not evaluate to '${expectedResult}' but to '${result}'`);
    }
}



///////////////////////////////////////////////////////////////////////////////
//
// Encode built-in constants as JSFuck
//
///////////////////////////////////////////////////////////////////////////////

// In the following, names of variables containing valid JSFuck will
// start with an underscore _ (to prevent name collisions with actual
// JS).

const _false = "![]"; ee2(_false, false);
const _false_s = `${_false}+[]`; ee2(_false_s, "false");
const _true = `!${_false}`; ee2(_true, true);
const _true_s = `${_true}+[]`; ee2(_true_s, "true");

const _0 = `+[]`; ee2(_0, 0);
const _1 = `+${_true}`; ee2(_1, 1);
const _NaN = `+[${_false}]`; ee2(`isNaN(${_NaN})`, true);
const _undefined = "[][[]]"; ee2(_undefined, undefined);
const _undefined_s = `${_undefined}+[]`; ee2(_undefined_s, "undefined");

// Appending +[] to any JS expression will convert the expression to a
// string. Same goes for prefixing any expression with []+
const _empty_string = "[]+[]"; ee2(_empty_string, "");



///////////////////////////////////////////////////////////////////////////////
//
// Helpers
//
///////////////////////////////////////////////////////////////////////////////

// Return JSFuck-encoded version of the given integer, i.e.
// for n=3 return _1 + _1 + _1
const encodeNum = (n) => {
    if (n === 0) {
        return _0;
    }
    // Memo to myself because I always need to stare at this a little:
    // This is doing the same as "n * _1" in Python (i.e. n-times string
    // duplication/concatenation) by using _1 as *separator* between n+1
    // (empty) Array elements (which evaluate to "").
    return Array(n+1).join(_1);
}
ee2(encodeNum(3), 3);
ee2(encodeNum(14), 14);


// Take a string of numbers (or a number which will first be converted
// to a string) and JSFuck-encode it by encoding each digit as integer
// and concatenating them all to a string, e.g.
// "112" -> "" + ONE + ONE + (ONE + ONE)
const encodeNumString = (numberString) => {
    numberString = "" + numberString;

    // the []+ converts <integer> to the string "<integer>". Additional integer
    // operands will be appended as strings.
    return "[]+" + numberString.split("").map(digit => "(" + encodeNum(+digit) + ")").join("+");
}
ee2(encodeNumString(112), "112");


// Wrap an expression in parentheses if not already wrapped
const w = (expression) => {
    if (expression[0] !== '(' || expression.at(-1) !== ')') {
        return "(" + expression + ")";
    }
    return expression;
};


// Helper function to obtain the string `${expression}[${itemNum}]`,
// with `itemNum` being JSFuck-encoded and `expression` being wrapped in
// parentheses if necessary
const getItem = (expression, itemNum) => {
    return w(expression) + "[" + encodeNum(itemNum) + "]";
}



///////////////////////////////////////////////////////////////////////////////
//
// Low-hanging fruit: Encode f, a, l, s, e, t, r, u, n, d, i, c, o, whitespace
//
///////////////////////////////////////////////////////////////////////////////

const _f = getItem(_false_s, 0); ee2(_f, "f");
const _a = getItem(_false_s, 1); ee2(_a, "a");
const _l = getItem(_false_s, 2); ee2(_l, "l");
const _s = getItem(_false_s, 3); ee2(_s, "s");
const _e = getItem(_false_s, 4); ee2(_e, "e");

const _t = getItem(_true_s, 0); ee2(_t, "t");
const _r = getItem(_true_s, 1); ee2(_r, "r");
const _u = getItem(_true_s, 2); ee2(_u, "u");

const _n = getItem(_undefined_s, 1); ee2(_n, "n");
const _d = getItem(_undefined_s, 2); ee2(_d, "d");
const _i = getItem(_undefined_s, 5); ee2(_i, "i");

// Array.prototype.at() only exists in modern browsers. Use
// Array.prototype.flat() or, better, Array.prototype.filter() if
// browser compatibility is important to you
const _at = `[][${_a}+${_t}]`; ee2(_at, Array.prototype.at);
const _at_code = `${_at}+[]`; //ee2(_at_code, "function at() {\n    [native code]\n}"); // <-- The part in braces is slightly browser-dependent, unfortunately. Remove the line breaks in Chrome.
const _c = getItem(_at_code, 3); ee2(_c, "c");
const _o = getItem(_at_code, 6); ee2(_o, "o");
const _whitespace = getItem(_at_code, 8); ee2(_whitespace, " ");



///////////////////////////////////////////////////////////////////////////////
//
// The crucial idea for obtaining lots of other letters: Access built-in
// constructors through <object>["constructor"] and convert them to
// strings
//
///////////////////////////////////////////////////////////////////////////////

const _constructor = `${_c}+${_o}+${_n}+${_s}+${_t}+${_r}+${_u}+${_c}+${_t}+${_o}+${_r}`; ee2(_constructor, "constructor");


///////////////////////////////////////////////////////////////////////////////
//
// Encode character h (and g & S along the way)
//
///////////////////////////////////////////////////////////////////////////////

const _string = `${w(_empty_string)}[${_constructor}]`; ee2(_string, String);
const _string_code = `${_string}+[]`; ee2(_string_code, "function String() {\n    [native code]\n}");
const _g = getItem(_string_code, 14); ee2(_g, "g");
const _S = getItem(_string_code, 9); ee2(_S, "S");

// Convert a lowercase letter to its JSFuck string representation
const encodeLowercaseLetter = (lowerCaseLetter) => {
    // Example: 34["toString"](36) converts 34 to its string
    // representation but w.r.t. base 36 (whose digits are 0, 1, …, 9,
    // a, …, z), so it converts 34 -> "w". This function maps "w" to the
    // string containing the JSFuck-encoded version of
    // `34["toString"](36)`.

    const positionInAlphabet = lowerCaseLetter.charCodeAt(0) - 97; // 97 = "a"

    // We subtract `10` here, because we already have better ways to encode a single-digit string (`"1"`)
    return `(+${w(encodeNumString(10 + positionInAlphabet))})[${_t}+${_o}+${_S}+${_t}+${_r}+${_i}+${_n}+${_g}](+(${encodeNumString(36)}))`;
}


const _h = encodeLowercaseLetter("h");  ee2(_h, "h");



///////////////////////////////////////////////////////////////////////////////
//
// Obtain ability to execute arbitrary code (given by a string) from
// within JSFuck, i.e. "implement" eval() (or more precisely Function())
// in JSFuck
//
///////////////////////////////////////////////////////////////////////////////

const _function = `${_at}[${_constructor}]`; ee2(_function, Function);

// Return JSFuck code that executes JS code (given as a string) in an
// anonymous function. The parameter is expected to be a string
// containing JSFuck code that evaluates to the string to be evaluated
// (how meta!)
const getExecutor = (jsCodeAsJsFuckEncodedString) => {
    // The Function() constructor takes the role of "eval()" here and
    // returns an anonymous function that runs the given code
    const anonymousFunction = `${_function}(${jsCodeAsJsFuckEncodedString})`;
    return anonymousFunction + "()";
}
ee2(getExecutor("'return 3'"), 3);



///////////////////////////////////////////////////////////////////////////////
//
// We'll need characters C, m and P to be able to encode any Unicode
// character using String.fromCodePoint()
//
///////////////////////////////////////////////////////////////////////////////


//
// Use btoa() to encode character C (and, along the way, b & m)
//

const _number = `${w(_0)}[${_constructor}]`; ee2(_number, Number);
const _number_code = `${_number}+[]`; ee2(_number_code, "function Number() {\n    [native code]\n}");
const _m = getItem(_number_code, 11); ee2(_m, "m");
const _b = getItem(_number_code, 12); ee2(_b, "b");


//
// Get access to window.btoa() and window.atob()
//

// Executing the anonymous function `() => { return this }` returns the
// window object
const _window = getExecutor(`${_r}+${_e}+${_t}+${_u}+${_r}+${_n}+${_whitespace}+${_t}+${_h}+${_i}+${_s}`); ee2(_window, window);

const _btoa = `${w(_window)}[(${_b}+${_t}+${_o}+${_a})]`; ee2(_btoa, window.btoa);
const _atob = `${w(_window)}[(${_a}+${_t}+${_o}+${_b})]`; ee2(_atob, window.atob);


// btoa() converts a sequence of bytes into a base64-encoded string. The
// input byte string is given by a JavaScript string containing only
// Unicode characters that fit into single bytes (i.e. ASCII/ANSI). We
// want to use this to access certain characters, e.g. "C":
//
// btoa("   ") = "ICAg"
//
// Explanation:
//
//   " "      " "      " "     = ASCII representation of characters
//    32       32       32
// 00100000 00100000 00100000
//             |
//             |             <-- btoa() / rearrange 3x8 bits into 4x6 bits
//             v
// 001000 000010 000010 100000
//   "I"    "C"   "A"    "g"   = base64 encoding of the 4x6 bits
//
const _ICAg = `${_btoa}(${_whitespace}+${_whitespace}+${_whitespace})`; ee2(_ICAg, "ICAg");
const _C = getItem(_ICAg, 1); ee2(_C, "C");


//
// Similarly, use atob() to encode character P (and, along the way, A)
//

const _array = `[][${_constructor}]`; ee2(_array, Array);
const _array_code = `${_array}+[]`; ee2(_array_code, "function Array() {\n    [native code]\n}");
const _A = getItem(_array_code, 9); ee2(_A, "A");


// atob() is the inverse of btoa() and converts a base64-encoded string
// to an ASCII string. We want to use this to access "P" via
//
// atob("01A0") = "ÓP4"
//
// Explanation (dashes are bits we don't care about):
//
//          "1"    "A"           = base 64
// ------ 110101 000000 ------
//             |
//             |               <-- atob() / rearrange 4x6 bits into 3x8 bits
//             v
// ------11 01010000 00------
//             80
//             "P"               = ASCII

const _somethingSomething = `${_atob}(${_empty_string} + (${_0}) + (${_1}) + (${_A}) + (${_0}))`; ee2(_somethingSomething, "ÓP4");
const _P = getItem(_somethingSomething, 1); ee2(_P, "P");



///////////////////////////////////////////////////////////////////////////////
//
// Map of all characters encoded so far
//
///////////////////////////////////////////////////////////////////////////////

// Map each character to JSFuck code that yields a string containing
// precisely that character
const EASY_CHAR_MAP = {
    "0": encodeNumString(0),
    "1": encodeNumString(1),
    "2": encodeNumString(2),
    "3": encodeNumString(3),
    "4": encodeNumString(4),
    "5": encodeNumString(5),
    "6": encodeNumString(6),
    "7": encodeNumString(7),
    "8": encodeNumString(8),
    "9": encodeNumString(9),
    "a": _a,
    "b": _b,
    "c": _c,
    "d": _d,
    "e": _e,
    "f": _f,
    "g": _g,
    "h": _h,
    "i": _i,
    "l": _l,
    "n": _n,
    "o": _o,
    "r": _r,
    "s": _s,
    "t": _t,
    "u": _u,
    "C": _C,
    "P": _P,
    "S": _S,
    " ": _whitespace,
}



///////////////////////////////////////////////////////////////////////////////
//
// The encoder / compiler
//
///////////////////////////////////////////////////////////////////////////////

// Idea: Iterate over Unicode characters of the compiler input and use
// compilerInput.codePointAt(i) to obtain the Unicode code point as
// integer.
//
// Convert this integer into a string and JSFuck-encode the latter.
//
// During execution (i.e. in the output code) convert the string back to
// an integer and feed it to ""["constructor"]["fromCodePoint"], i.e. to
// String.fromCodePoint(). Finally add up all those resulting strings
// and feed them to Function() (see getExecutor() above).

const _fromCodePoint_s = `${_f}+${_r}+${_o}+${_m}+${_C}+${_o}+${_d}+${_e}+${_P}+${_o}+${_i}+${_n}+${_t}`; ee2(_fromCodePoint_s, "fromCodePoint");
const _fromCodePoint = `${w(_empty_string)}[${_constructor}][${_fromCodePoint_s}]`; ee2(_fromCodePoint, String.fromCodePoint);

const encode = (jsCode) => jsCode.split("")
    .map((char, i) => {
        const easy_encoding = EASY_CHAR_MAP[char];
        if (easy_encoding === undefined) {
            const _encodedCodePoint = encodeNumString(jsCode.codePointAt(i));
            return `${_fromCodePoint}(+(${_encodedCodePoint}))`;
        }
        return easy_encoding;

    }).join("+");

const compile = (jsCode) => getExecutor(encode(jsCode));
