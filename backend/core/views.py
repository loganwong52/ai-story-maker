from django.http import JsonResponse
from rest_framework.decorators import api_view

from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma

import os
from dotenv import load_dotenv

load_dotenv()


# # Sets up a DRF (Django REST Framework) view that accepts POST requests.
# # Returns a mock response (Ollama/ChromaDB logic will be here)
# @api_view(["POST"])  # this endpoint only accepts POST requests
# def generate_image(request):
#     try:
#         # 1. Get user prompt
#         prompt = request.data.get("prompt", "")

#         # 2. Initialize AI components
#         llm = Ollama(
#             base_url="https://openrouter.ai/api/v1",  # Remote endpoint
#             model="meta-llama/llama-3-8b-instruct",
#             headers={
#                 # "HTTP-Referer": "YOUR_SITE_URL",
#                 "HTTP-Referer": "http://localhost:8000",  # Your Django dev server
#                 # "HTTP-Referer": "https://yourdomain.com",  # e.g., https://ai-story-generator.porkbun.app
#                 "Authorization": f"Bearer {os.getenv('OPENROUTER_KEY')}",
#             },
#         )

#         # vector_db = Chroma(persist_directory="./chroma_data")  # Local vector store

#         # 3. (Next we'll add RAG and image generation)

#         refined_prompt = llm(f"Improve this image prompt: {prompt}")

#         return JsonResponse(
#             {
#                 "status": "success",
#                 "refined_prompt": refined_prompt,
#                 "model": "llama3-8b (via OpenRouter)",
#             }
#         )

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


import requests


@api_view(["POST"])
def generate_image(request):
    try:
        prompt = request.data.get("prompt", "")

        # OpenRouter API call (correct format)
        headers = {
            "Authorization": f"Bearer {os.getenv('OPENROUTER_KEY')}",
            "HTTP-Referer": "http://localhost:8000",
            "Content-Type": "application/json",
        }

        data = {
            "model": "meta-llama/llama-3-8b-instruct",
            "messages": [
                {
                    "role": "system",  # Add a system message to set behavior
                    "content": "You are a prompt refiner for image generation. Rewrite this as a prompt for Stable Diffusion. Use comma-separated style, add visual details, lighting, and style descriptors. No commentary, examples, or explanations. ",
                },
                {
                    "role": "user",
                    "content": f"Improve this image prompt with vivid visual details: {prompt}",
                },
            ],
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data
        )
        response.raise_for_status()  # Raise error if call fails

        refined_prompt = response.json()["choices"][0]["message"]["content"]

        return JsonResponse({"status": "success", "refined_prompt": refined_prompt})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
