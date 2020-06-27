
let arr = [3, 5, 6, 6, 8, 5, 3, 40, 4]
//indexOf
function unique(arr) {
    var res = []
    for(let i = 0;i< arr.length;i++) {
        if (res.indexOf(arr[i]) === -1) {
            res.push(arr[i])
        }
    }
    return res
}
unique(unique(arr))

// es6

function unique(arr) {
    return Array.from(new Set(arr))
}

//
function unique(arr) {
    return [...new Set(arr)]
}

var unique = (a) => [...new Set(a)]
// Object

function unique(arr) {
    let obj = {}
    return arr.filter((item,index, arr) => {
        return obj.getOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

// filter

function unique(arr) {
    return arr.filter((item, index, arr) => {
        return arr.indexOf(item) === index
    })
}

// 多维数组 去重依然是多维数组

var array = [1, 2, 1, [1, 1, 2], [3, 3, 4]];

function unique(arr) {
    var res = []
    for(var i = 0, len = array.length; i< len;i++) {
        let current = arr[i]
        if (Array.isArray(array[i])) {
            res.push(unique(array[i]))
        } else if (res.indexOf(current) === -1) {
            res.push(current)
        }
    }
    return res
}

// unique api

var array1 = [1, 2, '1', 2, 1]
var array2 = [1, 1, '1', 2, 2]

function unique(arr, isSorted) {
    var res = []
    var seen = []

    for(var i = 0, len = array.length;i < len;i++) {
        var value = array[i]
        if(isSorted) {
            if(!i || seen !== value) {
                res.push(value)
            }
        } else if(res.indexOf(value) === -1) {
            res.push(value)
        }
    }
    return res
}