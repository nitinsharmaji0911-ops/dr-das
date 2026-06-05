import os
import json
import urllib.request
import urllib.error

# Load token
auth_json_path = os.path.expanduser(r"~\AppData\Roaming\com.vercel.cli\Data\auth.json")
with open(auth_json_path, 'r') as f:
    auth_data = json.load(f)
token = auth_data["token"]

headers = {
    "Authorization": f"Bearer {token}"
}

# Fetch deployments
# Include teamId if available
org_id = "team_t8RrLAsMcEWGzCICSnS7L0fV"
url = f"https://api.vercel.com/v6/deployments?projectId=prj_oacTz0jOjnvKah7L1F5lONTVM3Q7&teamId={org_id}&limit=40"
req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        deployments = data.get("deployments", [])
        print(f"Total deployments: {len(deployments)}")
        with open("deployments_list.json", "w") as out:
            json.dump(deployments, out, indent=2)
        print("Wrote deployments to deployments_list.json")
except urllib.error.HTTPError as e:
    print(f"Error {e.code}: {e.read().decode('utf-8', errors='ignore')}")
except Exception as e:
    print(f"Error: {e}")
