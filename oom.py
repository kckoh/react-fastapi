import time
from concurrent.futures import ThreadPoolExecutor

import requests

BASE_URL = "http://localhost:8000"

# 1. Backend에서 세션 기 키우기 (dependencies.py)
# sessions[session_id] = {
#     "user_id": user_id,
#     "email": email,
#     "data": "X" * 50_000  # 50KB
# }

# 2. 계정 생성
requests.post(
    f"{BASE_URL}/api/signup", json={"email": "bomb@test.com", "password": "123"}
)


def login():
    try:
        requests.post(
            f"{BASE_URL}/api/login",
            json={"email": "bomb@test.com", "password": "123"},
            timeout=3,
        )
        return True
    except:
        return False


print("💣 Ultimate OOM attack starting...")
start = time.time()
count = 0

with ThreadPoolExecutor(max_workers=50) as executor:
    futures = [executor.submit(login) for _ in range(100_000)]

    for future in futures:
        if future.result():
            count += 1
            if count % 100 == 0:
                elapsed = time.time() - start
                mem_est = (count * 50) / 1024  # MB
                print(
                    f"Sessions: {count:,} | Time: {elapsed:.0f}s | Est. Memory: {mem_est:.0f}MB"
                )

print(f"\n🎉 Created {count:,} sessions in {time.time() - start:.1f}s")
