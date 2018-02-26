from django.shortcuts import render
from django.http import JsonResponse
from ml.tool.predict import predict

def index(request):
    return render(request, 'ml/index.html')


def identify(request):
    if request.method == "POST":
        imgstr = request.POST.get('img', None)
        imgstr = imgstr[22:]
        if imgstr is not None:
            temp_img = cStringIO.StringIO(imgstr.decode('base64'))
            return JsonResponse({"result": predict(temp_img)})
