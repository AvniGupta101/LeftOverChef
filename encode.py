import base64

with open("test.jpg", "rb") as img:
    b64 = base64.b64encode(img.read()).decode()

print("\n=== COPY THIS BELOW ===\n")
print(f"data:image/jpeg;base64,{b64}")
