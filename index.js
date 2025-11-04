const fs = require('fs');
const OpenAI = require('openai');

// Conexión al servidor local de LM Studio
const openai = new OpenAI({
    baseURL: 'http://localhost:1234/v1',
    apiKey: 'not-needed-for-local'
});

async function chatearConModeloLocal() {
    try {
        const promptUsuario = fs.readFileSync('entrada.txt', 'utf-8');
        console.log(`💬 Enviando prompt: "${promptUsuario}"`);

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'Eres un asistente útil y creativo.' },
                { role: 'user', content: promptUsuario }
            ],
            // 👇 Aquí el cambio importante
            model: 'phi-3-mini-4k-instruct',
            temperature: 0.7,
        });

        const respuesta = chatCompletion.choices[0].message.content;
        console.log('\n🤖 Respuesta del modelo:\n');
        console.log(respuesta);

        fs.writeFileSync('salida.txt', respuesta);
        console.log('\n✅ Respuesta guardada en salida.txt');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('👉 Verifica que el servidor de LM Studio esté encendido.');
        }
    }
}

chatearConModeloLocal();
