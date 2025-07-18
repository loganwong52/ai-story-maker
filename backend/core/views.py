import os
import requests
import base64
from django.http import JsonResponse
from rest_framework.decorators import api_view
from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()


# # Sets up a DRF (Django REST Framework) view that accepts POST requests.
# # Returns a mock response (Ollama/ChromaDB logic will be here)
@api_view(["POST"])  # this endpoint only accepts POST requests
def refine_prompt(request):
    try:
        # 1. Get user prompt
        prompt = request.data.get("prompt", "")
        instructions = "You are a prompt refiner for image generation. Rewrite this as a prompt for Stable Diffusion. Use comma-separated style, add visual details, lighting, and style descriptors. Return ONLY the improved visual prompt in 1 sentence. No commentary, examples, or explanations."

        # 2. Send prompt to LLM for Refinement
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
                    "content": instructions,
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


@api_view(["POST"])  # this endpoint only accepts POST requests
def generate_image(request):
    try:
        # 3. (Next we'll add RAG and image generation)
        # vector_db = Chroma(persist_directory="./chroma_data")  # Local vector store

        # 4. Send the refined prompt to a model to GENERATE AN IMAGE
        refined_prompt = request.data.get("prompt", "")

        link = "https://api.deepai.org/api/text2img"
        response = requests.post(
            link,
            data={"text": refined_prompt},
            headers={"api-key": f"{os.getenv('DEEPAI_KEY')}"},
        )
        response.raise_for_status()

        # Get the image URL
        image_url = response.json()["output_url"]
        image_response = requests.get(image_url)
        image_response.raise_for_status()

        # Get the image & turn it into text format
        encoded_image = base64.b64encode(image_response.content).decode("utf-8")

        return JsonResponse(
            {
                "status": "success",
                "refined_prompt": refined_prompt,
                "image_base64": encoded_image,  # encoded image data
            }
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
