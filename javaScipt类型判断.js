var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]

function checkType() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(Object.prototype.toString.call(arguments[i]))
    }
}

checkType(number, string, boolean, und, nul, obj, array, date, error, reg, func)


// 第一版

var class2type = {}

"Boolean Number String Funciton Array Date RegExp Object Error Null Undefined".split(" ").map((item, index) => {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    return typeof obj === "object" || typeof obj === 'function' ?
    class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}

// 第二版

var class2type = {}

"Boolean Number String Funciton Array Date RegExp Object Error Null Undefined".split(" ").map((item, index) => {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === 'function' ?
    class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}