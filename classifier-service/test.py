# test_classifier_direct.py
import base64, requests, json

URL = "https://leftoverchef-ml4.onrender.com/classify"

with open("test.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

payload = {
    "imageBase64": f"data:image/jpeg;base64,{b64}"
}

r = requests.post(URL, json=payload, timeout=60)
print("STATUS:", r.status_code)
print(r.text)
