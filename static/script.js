async function EnviarAccion() {
    // Cogemos texto del usuario y el contenido de la historia
    const texto = document.getElementById('texto-historia');
    const historia = document.getElementById('contenido-historia');
    const accion = texto.value;

    if (!accion)  
        alert("Escribe el comienzo de la historia");    // Si esta vacio manda un mensaje
        return; 

    // Mostramos lo que el usuario acaba de escribir
    historia.innerHTML += `<p><strong>Tú:</strong> ${accion}</p>`;
    texto.value = ''; // Limpiamos el buscador

    // Enviamos la petición al servidor (main.py)
    const response = await fetch('/generate', {
        method: 'POST', // Método de envío de datos
        headers: { 'Content-Type': 'application/json' }, // Decimos que enviamos un JSON
        body: JSON.stringify({ prompt: accion }) // Convertimos el objeto JS a texto JSON
    });

    // Convertimos la respuesta de nuevo a objeto
    const datos = await response.json();
    
    // Mostramos la respuesta de la IA
    historia.innerHTML += `<p class="ai"><strong>Narrador:</strong> ${datos.response}</p>`;
    
    // Hacemos scroll para ver lo último
    historia.scrollTop = historia.scrollHeight;
}