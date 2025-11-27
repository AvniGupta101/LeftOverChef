# create test_send.py (one-time)
import base64, requests
b = open("test.jpg","rb").read()
data_uri = "data:image/jpeg;base64," + base64.b64encode(b).decode()
res = requests.post("http://127.0.0.1:8000/classify", json={"imageBase64": data_uri}, timeout=20)
print(res.status_code)
print(res.json())
