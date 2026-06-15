import csv
import random
from datetime import datetime, timedelta
import requests
import os

os.makedirs("demo_datasets", exist_ok=True)

CHANNELS = ["google_ads", "meta_ads", "tiktok_ads", "linkedin_ads", "email"]

def generate_csv(filename, days=30):
    filepath = os.path.join("demo_datasets", filename)
    with open(filepath, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["date", "channel", "campaign_name", "spend", "revenue", "impressions", "clicks", "conversions"])
        writer.writeheader()
        
        start_date = datetime.now() - timedelta(days=days)
        for day in range(days):
            current_date = (start_date + timedelta(days=day)).strftime("%Y-%m-%d")
            for channel in CHANNELS:
                spend = round(random.uniform(100, 1000), 2)
                roas = random.uniform(1.5, 5.5)
                revenue = round(spend * roas, 2)
                clicks = int(spend / random.uniform(0.5, 2.0))
                impressions = clicks * int(random.uniform(20, 100))
                conversions = int(revenue / 85.0)
                
                writer.writerow({
                    "date": current_date,
                    "channel": channel,
                    "campaign_name": f"{channel.upper()} - Promo",
                    "spend": spend,
                    "revenue": revenue,
                    "impressions": impressions,
                    "clicks": clicks,
                    "conversions": conversions
                })
    return filepath

filenames = [
    "q1_marketing_performance.csv",
    "black_friday_campaigns.csv",
    "always_on_social.csv",
    "b2b_lead_gen.csv",
    "retargeting_audience.csv"
]

for name in filenames:
    filepath = generate_csv(name, days=random.randint(30, 90))
    print(f"Generated {filepath}")
    
    # Upload to backend
    with open(filepath, "rb") as f:
        files = {"file": (name, f, "text/csv")}
        try:
            res = requests.post("http://127.0.0.1:8000/api/v1/datasets/upload", files=files)
            if res.status_code == 200:
                print(f"Successfully uploaded {name} to API")
            else:
                print(f"Failed to upload {name}: {res.text}")
        except Exception as e:
            print(f"Error uploading {name}: {e}")
