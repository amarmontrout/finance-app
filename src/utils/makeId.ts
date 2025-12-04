const makeId = (length: number) => {
    let result = ""
    const characters = "0123456789"
    const charLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength))
    }
    return result
}

export default makeId