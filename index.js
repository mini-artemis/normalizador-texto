const fs = require('fs');
// Importamos el SDK oficial de OpenAI
const OpenAI = require('openai');

// 1. Configuramos el cliente de OpenAI
const openai = new OpenAI({
    // Dirección del servidor local (LM Studio u otro)
    baseURL: 'http://localhost:1234/v1',
    // No importa la clave, solo debe existir
    apiKey: 'not-needed-for-local'
});

// Función principal asíncrona
async function chatearConModeloLocal() {
    try {
        // 2. Leemos el prompt desde el archivo de entrada
        const promptUsuario = fs.readFileSync('entrada.txt', 'utf-8');
        console.log(`📤 Enviando prompt: "${promptUsuario}"`);

        // 3. Llamada al modelo local
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente útil, reflexivo y preciso.'
                },
                {
                    role: 'user',
                    content: promptUsuario
                }
            ],
            // 👇 Cambiamos aquí el modelo
            model: 'deepseek-r1-distill-qwen-7b',
            temperature: 0.7,
        });

        // 4. Extraemos y mostramos la respuesta
        const respuesta = chatCompletion.choices[0].message.content;
        console.log('💬 Respuesta del Modelo:');
        console.log(respuesta);

        // 5. Guardamos la respuesta en el archivo de salida
        fs.writeFileSync('salida.txt', respuesta);
        console.log('\n✅ Respuesta guardada en "salida.txt"');
    } catch (error) {
        console.error('❌ Ha ocurrido un error:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: No se pudo conectar. ¿Iniciaste el servidor en LM Studio?');
        } else {
            console.error(error.message);
        }
    }
}

// Ejecutamos la función
chatearConModeloLocal();
