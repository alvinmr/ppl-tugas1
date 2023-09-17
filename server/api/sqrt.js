// supabase
import { createClient } from '@supabase/supabase-js'

export default eventHandler(async (event) => {
    const number = Number(getQuery(event).number)
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)



    // validate the input
    if (!Number.isInteger(number)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'The number is not an integer'
        })
    }

    const sqrt = (number) => {
        let guess = number / 2
        let newGuess = 0
        const start = performance.now()
        while (guess !== newGuess) {
            newGuess = guess
            guess = (guess + number / guess) / 2
        }
        const end = performance.now()

        var executionTime = end - start
        client.from('sqrt_number').insert({
            number: number,
            sqrt: guess,
            execution_time: executionTime
        }).then(res => {
            console.log(res)
        }).catch(err => {
            throw createError({
                statusCode: 400,
                statusMessage: 'Error inserting data'
            })
        })
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

