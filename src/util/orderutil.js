const generateOrderID = (clientName) => {
    const currentDate = new Date()

    //TODO:: add minutes, seconds
    let orderID = (Math.random() + 1).toString(36).substring(7) + '_' + clientName + '_'
        + currentDate.getFullYear() + currentDate.getMonth() + currentDate.getDay()

    return orderID

}

const secondsToMinutes = (timeSec) => {
    return Math.floor(timeSec / 60) + ':' + Math.floor(timeSec % 60)
}

module.exports = {
    generateOrderID,
    secondsToMinutes
}