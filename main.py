from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from transformers import pipeline
import torch

app = FastAPI()

# Cargamos el modelo
pipe = pipeline("text-generation", model="Qwen/Qwen2.5-1.5B-Instruct", device_map="auto")

# Para que pueda leer el CSS y JS
app.mount("/static", StaticFiles(directory="static"), name="static")

class AventuraRespuesta(BaseModel):
    prompt: str  # Lo que escribe el usuario

# La ruta que procesa la historia
@app.post("/generate")
async def generate_story(data: AventuraRespuesta):
    return {"response": f"Historia recibida: {data.prompt}"}
