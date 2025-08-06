import os
import uuid
import requests
import base64
from django.http import JsonResponse
from django.http import HttpResponse
from rest_framework.decorators import api_view
from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma

from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from PyPDF2 import PdfReader
from docx import Document

import replicate
from supabase import create_client

# import { createClient } from '@supabase/supabase-js'

import traceback

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


# @api_view(["POST"])  # this endpoint only accepts POST requests
# def generate_image(request):
#     try:
#         # 3. (Next we'll add RAG and image generation)
#         # vector_db = Chroma(persist_directory="./chroma_data")  # Local vector store

#         # 4. Send the refined prompt to a model to GENERATE AN IMAGE
#         api_key = os.getenv("REPLICATE_KEY")
#         client = replicate.Client(api_token=f"{api_key}")

#         link = "black-forest-labs/flux-schnell:latest"
#         refined_prompt = request.data.get("prompt", "")

#         output = client.run(
#             link,
#             input={"prompt": refined_prompt},
#         )
#         print(output)  # This will be a URL or list of URLs to images

#         #     link = "https://api.deepai.org/api/text2img"
#         #     response = requests.post(
#         #         link,
#         #         data={"text": refined_prompt},
#         #         headers={"api-key": f"{os.getenv('REPLICATE_KEY')}"},
#         #     )
#         #     response.raise_for_status()
#         # Get the image URL
#         # image_url = response.json()["output_url"]

#         image_url = output
#         if isinstance(output, list):
#             image_url = output[0]
#         image_response = requests.get(image_url)
#         image_response.raise_for_status()

#         # Get the image & turn it into text format
#         encoded_image = base64.b64encode(image_response.content).decode("utf-8")

#         return JsonResponse(
#             {
#                 "status": "success",
#                 "refined_prompt": refined_prompt,
#                 "image_base64": encoded_image,  # encoded image data
#             }
#         )

#     except Exception as e:
#         traceback_str = traceback.format_exc()
#         traceback.print_exc()
#         print("Error:", traceback_str)
#         return JsonResponse({"error": str(e), "trace": traceback_str}, status=500)


@csrf_exempt
def extract_text(request):
    if request.method == "POST" and request.FILES.get("file"):
        uploaded_file = request.FILES["file"]
        filename = default_storage.save(uploaded_file.name, uploaded_file)
        file_path = default_storage.path(filename)

        try:
            ext = os.path.splitext(filename)[1].lower()
            text = ""

            if ext == ".txt":
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
            elif ext == ".pdf":
                reader = PdfReader(file_path)
                text = "\n".join([page.extract_text() or "" for page in reader.pages])
            elif ext in [".doc", ".docx"]:
                doc = Document(file_path)
                text = "\n".join([p.text for p in doc.paragraphs])
            else:
                return JsonResponse({"error": "Unsupported file type"}, status=400)

            return JsonResponse({"text": text})
        finally:
            default_storage.delete(filename)

    return JsonResponse({"error": "Invalid request"}, status=400)


# @api_view(["POST"])  # this endpoint only accepts POST requests
# def generate_image(request):
#     try:
#         api_token = os.getenv("REPLICATE_KEY")
#         client = replicate.Client(api_token=api_token)

#         prompt = request.data.get("prompt", "")
#         output = client.run("black-forest-labs/flux-schnell", input={"prompt": prompt})
#         # print(type(output))
#         # print(f"OUTPUT: {output}")

#         # image_url = output[0].url()
#         image_url = output[0]
#         # if hasattr(image_url, "__str__"):
#         #     image_url = str(image_url)
#         # else:
#         #     image_url = None
#         response = requests.get(image_url)
#         response.raise_for_status()

#         # return JsonResponse({"status": "success", "image_url": image_url})
#         return HttpResponse(response.content, content_type="image/webp")

#     except Exception as e:
#         # Print full traceback to console for debugging
#         traceback.print_exc()

#         # Return error message as JSON response so frontend can read it
#         return JsonResponse({"error": str(e)}, status=500)


# @api_view(["POST"])
# def generate_image(request):
#     model_name = "black-forest-labs/flux-schnell"
#     try:
#         # 1. Generate image
#         client = replicate.Client(api_token=os.getenv("REPLICATE_KEY"))
#         output = client.run(model_name, input={"prompt": request.data["prompt"]})

#         # 2. Download and upload to Supabase
#         image_url = output[0]
#         img_data = requests.get(image_url).content

#         supabase = create_client(
#             os.getenv("SUPABASE_URL"),
#             os.getenv("SUPABASE_SECRET_KEY"),  # From Supabase settings -> API
#         )

#         file_name = f"images/{uuid.uuid4()}.jpg"
#         supabase.storage.from_("ai-story-maker").upload(
#             file_name, img_data, content_type="image/jpeg"
#         )

#         # 3. Return permanent URL
#         permanent_url = f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/ai-story-maker/{file_name}"
#         return JsonResponse({"image_url": permanent_url})

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
def generate_image(request):
    """Returns a temporary URL from Replicate."""
    model_name = "black-forest-labs/flux-schnell"
    api_token = os.getenv("REPLICATE_KEY")
    refined_prompt = request.data["prompt"]

    try:
        # Call Replicate API
        client = replicate.Client(api_token)
        output = client.run(model_name, input={"prompt": refined_prompt})
        temporary_img_url = str(output[0])
        return JsonResponse({"image_url": temporary_img_url})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
def upload_image(request):
    """Uploads an image URL (from Replicate) to Supabase."""
    try:
        image_url = request.data["image_url"]

        # Get the image
        response = requests.get(image_url, stream=True)
        response.raise_for_status()
        img_data = response.content

        supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_SECRET_KEY"),
        )

        file_name = f"images/{uuid.uuid4()}.webp"

        supabase.storage.from_("ai-story-maker").upload(
            path=file_name,
            file=img_data,
            file_options={"content-type": "image/webp"},
        )

        permanent_url = f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/ai-story-maker/{file_name}"
        return JsonResponse({"image_url": permanent_url})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
