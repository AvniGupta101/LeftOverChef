# # create test_send.py (one-time)
# import base64, requests
# b = open("test.jpg","rb").read()
# data_uri = "data:image/jpeg;base64," + base64.b64encode(b).decode()
# res = requests.post("http://127.0.0.1:8000/classify", json={"imageBase64": data_uri}, timeout=20)
# print(res.status_code)
# print(res.json())
# save as test_post.py and run: python test_post.py
import base64, requests, json

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjgzZWRjMTUzZDZkZGQyMmIwZWU2NSIsInJvbGUiOiJkb25vciIsImVtYWlsIjoiYXZuZ3VwdGEwN0BnbWFpbC5jb20iLCJuYW1lIjoiQXZuaSIsImlhdCI6MTc2NDI0NTY5NCwiZXhwIjoxNzY0ODUwNDk0fQ.m5_6MvoPr8jC2TtuJbWXOm6_QFe0AqJH5eKpJfH71nQ"
with open("test.jpg","rb") as f:
    b = base64.b64encode(f.read()).decode()
payload = {
  "title": "E2E Test Plate",
  "description": "Test created by me",
  "quantity": 5,
  "pickupAddress": "Test Address",
  "imageBase64": f"data:image/jpeg;base64,{b}"
}
r = requests.post("http://127.0.0.1:5000/api/listings",
                  headers={"Content-Type":"application/json", "Authorization": f"Bearer {TOKEN}"},
                  json=payload)
print("STATUS:", r.status_code)
try:
  print(json.dumps(r.json(), indent=2))
except:
  print(r.text)
