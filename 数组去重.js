
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

// Object

function unique(arr) {
    let obj = {}
    return arr.filter((item,index, arr) => {
        return obj.getOwnProperty(item) ? false : (obj[item] = true)
    })
}

// filter

function unique(arr) {
    return arr.filter((item, index, arr) => {
        return arr.indexOf(item) === index
    })
}