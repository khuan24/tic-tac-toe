const pubSub = (function() {
    const subscribers = {} // { click: [fn1, fn2], hover: [fn3] }

    const subscribe = (event, callback) => {
        if (!subscribers[event]) {
            subscribers[event] = []
        }
        subscribers[event].push(callback)
    }

    const notify = (event, data) => {
        if (subscribers[event]) {
            subscribers[event].forEach(callback => callback(data))
        }
    }

    return {
        subscribe,
        notify
    }
})();