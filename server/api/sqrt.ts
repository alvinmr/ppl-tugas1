export default eventHandler(async (event) => {
    const number = Number(getQuery(event).number)

    // validate the input
    if (!Number.isInteger(number)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'The number is not an integer'
        })
    }

    const sqrt = (number: number) => {
        let guess = number / 2
        let newGuess = 0
        const start = performance.now()
        while (guess !== newGuess) {
            newGuess = guess
            guess = (guess + number / guess) / 2
        }
        const end = performance.now()
        
        var executionTime = end - start
        return {
            number: number,
            sqrt: guess,
            executionTime: executionTime
        }
    }
    


    return {
        data: sqrt(number)
    }
})

