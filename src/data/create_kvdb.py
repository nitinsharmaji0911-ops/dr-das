import urllib.request
import urllib.parse
import json
import time
import re

def get_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def post_url(url, data_dict):
    data = urllib.parse.urlencode(data_dict).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return response.read().decode('utf-8')

def main():
    print("Step 1: Generating temporary email...")
    email_data = get_json("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
    email = email_data[0]
    username, domain = email.split('@')
    print(f"Email: {email}")

    print("\nStep 2: Registering bucket on KVdb.io...")
    try:
        bucket_id = post_url("https://kvdb.io/", {"email": email}).strip()
        print(f"Generated Bucket ID: {bucket_id}")
    except Exception as e:
        print(f"Failed to register bucket: {e}")
        return

    print("\nStep 3: Waiting for verification email from KVdb.io (polling)...")
    verification_link = None
    for attempt in range(15):
        time.sleep(4)
        print(f"Checking mailbox (attempt {attempt+1}/15)...")
        messages = get_json(f"https://www.1secmail.com/api/v1/?action=getMessages&login={username}&domain={domain}")
        if messages:
            print("Email received! Reading contents...")
            msg_id = messages[0]['id']
            msg_detail = get_json(f"https://www.1secmail.com/api/v1/?action=readMessage&login={username}&domain={domain}&id={msg_id}")
            body = msg_detail['body']
            
            # Find link like https://kvdb.io/verify?code=xxx
            links = re.findall(r'(https://kvdb.io/verify\S+)', body)
            if links:
                verification_link = links[0].replace('"', '').replace('>', '').split('<')[0]
                print(f"Found verification link: {verification_link}")
                break

    if not verification_link:
        print("Verification email not received. Please try again.")
        return

    print("\nStep 4: Verifying the bucket...")
    req = urllib.request.Request(verification_link, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        if "verified" in html.lower() or "activated" in html.lower() or response.status == 200:
            print("Bucket successfully verified and activated!")
            print(f"\nSUCCESS! Your verified Bucket ID is: {bucket_id}")
            print(f"You can access your data at: https://kvdb.io/{bucket_id}/bookings")
        else:
            print(f"Verification response might have failed: {html[:200]}")

if __name__ == "__main__":
    main()
