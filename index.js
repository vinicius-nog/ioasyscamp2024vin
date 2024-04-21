const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
const { userInfo } = require('os')

const readline = require('readline')
require('dotenv/config')

console.log("GPT_KEY:", process.env.GPT_KEY);

const client = new OpenAIClient(
    process.env.GPT_ENDPOINT,
    new AzureKeyCredential(process.env.GPT_KEY),
)

const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
})

const getMessageFromAPI = async (message) => {
    try {
        const response = await client.getCompletions("CAMP2024", message, {
            temperature: 0,
            maxTokens: 50,
        });

        const text = response.choices[0].text.trim();
        return text;
    } catch (error) {
        console.error(error)
        return "Desculpe, um erro ocorreu!"
    }
}

let bl = true;
let str = 'a';

function askQuestion() {

    if (bl == false) {
        str = 'Tem algo mais que deseja saber?'
    } else {
        str = 'Olá, esse é o Chatbot! O que você deseja saber?'
    }

    rl.question(str, async (userInput) => {

        if (userInput.toLowerCase().trim() == 'sair' || userInput.toLowerCase().trim() == 'fechar') {
            rl.close();
            console.log('Fechando a aplicação!')
            return null;
        }

        try {
            const message = await getMessageFromAPI(userInput);
            console.log(message)
            bl = false;
            askQuestion();
        } catch (error) {
            console.error(error)
        }


    }
    )
}
askQuestion();