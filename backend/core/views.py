from django.http import JsonResponse
from rest_framework.decorators import api_view

from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma


# Sets up a DRF (Django REST Framework) view that accepts POST requests.
# Returns a mock response (Ollama/ChromaDB logic will be here)
@api_view(["POST"])  # this endpoint only accepts POST requests
def generate_image(request):
    try:
        # 1. Get user prompt
        prompt = request.data.get("prompt", "")

        # 2. Initialize AI components
        llm = Ollama(model="llama3:8b")  # Local LLM
        vector_db = Chroma(persist_directory="./chroma_data")  # Local vector store

        # 3. (Next we'll add RAG and image generation)

        return JsonResponse(
            {
                "status": "success",
                "prompt": prompt,
                "llm_model": "llama3:8b",  # Debug info
                "vector_db": "local_chroma",
            }
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
