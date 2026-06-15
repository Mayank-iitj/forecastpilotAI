import pandas as pd
import os

def process_datasets():
    os.makedirs("demo_datasets", exist_ok=True)
    
    # 1. Meta Ads
    meta_df = pd.read_csv(r"C:\Users\MS\Downloads\meta_ads_campaign_stats.csv")
    meta_std = pd.DataFrame({
        "date": meta_df["date_start"],
        "channel": "meta_ads",
        "campaign_name": meta_df["campaign_name"],
        "spend": meta_df["spend"],
        "revenue": meta_df["conversion"] * 85.0,  # Mocking AOV of $85 since revenue isn't present
        "impressions": meta_df["impressions"],
        "clicks": meta_df["clicks"],
        "conversions": meta_df["conversion"]
    })

    # 2. Google Ads
    google_df = pd.read_csv(r"C:\Users\MS\Downloads\google_ads_campaign_stats.csv")
    google_std = pd.DataFrame({
        "date": google_df["segments_date"],
        "channel": "google_ads",
        "campaign_name": google_df["campaign_name"],
        "spend": google_df["metrics_cost_micros"] / 1000000.0,
        "revenue": google_df["metrics_conversions_value"],
        "impressions": google_df["metrics_impressions"],
        "clicks": google_df["metrics_clicks"],
        "conversions": google_df["metrics_conversions"]
    })

    # 3. Bing Ads (MS Ads)
    bing_df = pd.read_csv(r"C:\Users\MS\Downloads\bing_campaign_stats.csv")
    bing_std = pd.DataFrame({
        "date": bing_df["TimePeriod"],
        "channel": "microsoft_ads",
        "campaign_name": bing_df["CampaignName"],
        "spend": bing_df["Spend"],
        "revenue": bing_df["Revenue"],
        "impressions": bing_df["Impressions"],
        "clicks": bing_df["Clicks"],
        "conversions": bing_df["Conversions"]
    })

    # Combine all
    combined_df = pd.concat([meta_std, google_std, bing_std], ignore_index=True)
    
    # Fill NAs
    combined_df.fillna(0, inplace=True)
    
    # Sort by date
    combined_df.sort_values(by="date", inplace=True)
    
    # Export to demo_datasets
    output_path = os.path.join("demo_datasets", "hackathon_campaign_stats.csv")
    combined_df.to_csv(output_path, index=False)
    print(f"Successfully processed and combined datasets into {output_path}")

if __name__ == "__main__":
    process_datasets()
