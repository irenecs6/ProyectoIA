async function EnviarAccion(textoManual = null) {
    const texto = document.getElementById('texto-historia');
    const historia = document.getElementById('contenido-historia');

    // Determinamos si el texto viene del input o de un botón de opción
    const mensajeUsuario = textoManual || texto.value;

    // Si no hay texto no hacemos nada
    if (!mensajeUsuario) return;

    // Mostramos lo que el usuario ha escrito
    historia.innerHTML += `
        <div class="mensaje-usuario">
            <strong>Tú:</strong> ${mensajeUsuario}
        </div>
    `;

    // Limpiamos el input y hacemos scroll para que se vea bien lo que escribe la IA
    texto.value = '';
    historia.scrollTop = historia.scrollHeight;

    try {
        // 2. Enviar la petición al Backend (FastAPI)
        const response = await fetch('http://127.0.0.1:8000/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: mensajeUsuario })
        });

        const datos = await response.json();
        const respuestaIA = datos.response;

        // 3. PROCESAR LA RESPUESTA PARA SEPARAR OPCIONES
        // Usamos una expresión regular para dividir por "1.", "2." o "3."
        const partes = respuestaIA.split(/\n?\d[\.\)]\s/);        const narrativa = partes[0]; // La parte del relato
        const opciones = partes.slice(1); // Las opciones (si existen)

        // 4. Mostrar la narrativa de la IA
        historia.innerHTML += `
            <div class="mensaje-ia">
                <strong>Narrador:</strong> ${narrativa}
            </div>
        `;

        // 5. Crear botones si hay opciones disponibles
        if (opciones.length > 0) {
            const contenedorBotones = document.createElement('div');
            contenedorBotones.className = "contenedor-opciones";

            opciones.forEach(textoOpcion => {
                const boton = document.createElement('button');
                boton.innerText = textoOpcion.trim();
                boton.className = "boton-destino";
                
                // Al hacer clic, enviamos la opción elegida
                boton.onclick = () => {
                    contenedorBotones.remove(); // Quitamos estos botones al elegir
                    EnviarAccion(textoOpcion.trim());
                };
                
                contenedorBotones.appendChild(boton);
            });

            historia.appendChild(contenedorBotones);
        }

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        historia.innerHTML += `<p style="color: red;">Error: No se pudo conectar con la IA.</p>`;
    }

    // Scroll automático al final
    historia.scrollTop = historia.scrollHeight;
}

// Permitir enviar con la tecla "Enter"
document.getElementById('texto-historia').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        EnviarAccion();
    }
});