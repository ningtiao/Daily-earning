function debounce(func, wait) {
    let timer = null
    return function () {
        const context = this
        let args = arguments
        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {
            func.apply(context, args)
        }, wait)
    }
}