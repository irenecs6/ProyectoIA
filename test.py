from transformers import pipeline

pipe = pipeline("text-generation", model="distilgpt2")
print(pipe("Hola, dime una frase corta", max_new_tokens=20))
