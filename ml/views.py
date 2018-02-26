from django.shortcuts import render
from django.http import JsonResponse
from ml.tool.predict import predict
from io import BytesIO
import base64

def index(request):
    return render(request, 'ml/index.html')


def identify(request):
    if request.method == "POST":
        img = request.POST.get('img', None)
        if img is not None:
            img = img[22:]
            temp_img = BytesIO(base64.decodebytes(img.encode()))
            return JsonResponse({"result": predict(temp_img)})
        else:
            return JsonResponse({"error": "Missing image!"})
    else:
        return JsonResponse({"error": "Invalid request!"})
