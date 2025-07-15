from django.http import JsonResponse
from rest_framework.decorators import api_view


# Sets up a DRF (Django REST Framework) view that accepts POST requests.
# Returns a mock response (Ollama/ChromaDB logic will be here)
@api_view(["POST"])  # this endpoint only accepts POST requests
def generate_image(request):
    """
    request: contains the HTTP request data
    """

    # Placeholder for LangChain/Ollama logic
    response_data = {"image_url": "https://example.com/test.jpg"}
    # JsonResponse turns the dictionary into JSON
    return JsonResponse(response_data)
