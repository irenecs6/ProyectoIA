from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
from transformers import pipeline
import torch

app = FastAPI()
# Para que funcione con el LiveServer
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite todas las conexiones
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Cargamos el modelo
pipe = pipeline("text-generation", model="gpt2")

# Para que pueda leer el CSS y JS
app.mount("/static", StaticFiles(directory="static"), name="static")

class AventuraRespuesta(BaseModel):
    prompt: str  # Lo que escribe el usuario

# La ruta que procesa la historia
@app.post("/generate")
async def continuar_aventura(datos: AventuraRespuesta):
    # Usamos un formato de "Chat" que Qwen entiende mucho mejor
    mensajes = (
        f"Eres un narrador de aventuras. Escribe un párrafo corto de historia y termina SIEMPRE con exactamente 3 opciones numeradas como 1., 2. y 3.\n"
        f"Historia: {datos.prompt}"
    )

    print(f"Generando respuesta para: {datos.prompt}")

    # Generamos la respuesta (Qwen prefiere este formato de mensajes)
    resultado = pipe(mensajes, max_new_tokens=150, temperature=0.7)
    
    # Extraemos el contenido del último mensaje generado por la IA
    respuesta_ia = resultado[0]["generated_text"].replace(mensajes, "").strip()

    print(f"Respuesta enviada: {respuesta_ia}")

    return {"response": respuesta_ia}