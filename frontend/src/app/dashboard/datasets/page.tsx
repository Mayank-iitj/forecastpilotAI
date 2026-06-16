"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet } from "lucide-react";

const directDatasets = [
  {
    name: "Meta Ads Performance",
    file: "meta_ads_campaign_stats.csv",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    preview: [
      { Campaign: "Q3_Retargeting_US", Spend: "$1,240.50", Impressions: "145,000", Clicks: "3,200", Conversions: "145", Revenue: "$4,500.00" },
      { Campaign: "Lookalike_EU", Spend: "$3,100.00", Impressions: "320,000", Clicks: "5,100", Conversions: "310", Revenue: "$8,900.00" },
      { Campaign: "Video_Views_Global", Spend: "$850.00", Impressions: "450,000", Clicks: "1,200", Conversions: "85", Revenue: "$1,200.00" },
      { Campaign: "Dynamic_Product_Ads", Spend: "$4,500.00", Impressions: "210,000", Clicks: "4,800", Conversions: "420", Revenue: "$12,400.00" },
      { Campaign: "Brand_Awareness_UK", Spend: "$600.00", Impressions: "125,000", Clicks: "800", Conversions: "40", Revenue: "$850.00" }
    ]
  },
  {
    name: "Google Ads Campaigns",
    file: "google_ads_campaign_stats.csv",
    icon: "M12.545,10.239v3.821h5.445c-0.712,2.315-2.757,3.951-5.445,3.951c-3.131,0-5.674-2.543-5.674-5.674s2.543-5.674,5.674-5.674c1.465,0,2.793,0.56,3.805,1.482l2.842-2.842C17.477,3.582,15.17,2.5,12.545,2.5C7.265,2.5,3,6.765,3,12.045s4.265,9.545,9.545,9.545c5.503,0,9.155-3.874,9.155-9.303c0-0.655-0.076-1.285-0.211-1.888L12.545,10.239z",
    color: "text-green-500",
    bg: "bg-green-500/10",
    preview: [
      { Campaign: "Search_Brand_Exact", Spend: "$800.00", Impressions: "12,000", Clicks: "2,400", Conversions: "350", Revenue: "$8,500.00" },
      { Campaign: "Search_NonBrand_Broad", Spend: "$5,200.00", Impressions: "85,000", Clicks: "6,500", Conversions: "420", Revenue: "$15,200.00" },
      { Campaign: "PMax_Shopping_All", Spend: "$7,500.00", Impressions: "320,000", Clicks: "12,500", Conversions: "850", Revenue: "$24,000.00" },
      { Campaign: "Display_Retargeting", Spend: "$1,100.00", Impressions: "245,000", Clicks: "1,800", Conversions: "120", Revenue: "$3,100.00" },
      { Campaign: "YouTube_Bumper_Ads", Spend: "$2,300.00", Impressions: "560,000", Clicks: "3,200", Conversions: "95", Revenue: "$2,800.00" }
    ]
  },
  {
    name: "Bing Ads Stats",
    file: "bing_campaign_stats.csv",
    icon: "M11.4 24l-7.3-2.3V8.8L11.4 6v18zm1.2-18.4L20 2v21.5l-7.4 2.5V5.6z",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    preview: [
      { Campaign: "Search_Brand_US", Spend: "$350.00", Impressions: "8,500", Clicks: "1,200", Conversions: "180", Revenue: "$4,200.00" },
      { Campaign: "Search_NonBrand_US", Spend: "$1,800.00", Impressions: "42,000", Clicks: "3,400", Conversions: "210", Revenue: "$6,800.00" },
      { Campaign: "Shopping_Desktop", Spend: "$2,100.00", Impressions: "95,000", Clicks: "4,100", Conversions: "320", Revenue: "$8,900.00" },
      { Campaign: "Audience_Network", Spend: "$450.00", Impressions: "65,000", Clicks: "850", Conversions: "45", Revenue: "$1,100.00" },
      { Campaign: "Search_Competitors", Spend: "$900.00", Impressions: "15,000", Clicks: "1,100", Conversions: "95", Revenue: "$2,300.00" }
    ]
  }
];

export default function DatasetsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold">Dataset Viewer</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">View connected marketing datasets</p>
      </div>

      <div className="space-y-8">
        {directDatasets.map((source) => (
          <motion.div 
            key={source.file}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden flex flex-col shadow-sm"
          >
            <div className="flex flex-col md:flex-row border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-xl ${source.bg} flex items-center justify-center shrink-0`}>
                    <svg className={`w-6 h-6 ${source.color}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d={source.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{source.name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4" />
                      {source.file}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-0 overflow-auto">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                    <tr>
                      {Object.keys(source.preview[0]).map((col) => (
                        <th key={col} className="py-4 px-6 font-semibold whitespace-nowrap text-[hsl(var(--foreground))]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {source.preview.map((row, i) => (
                      <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))/50] transition-colors">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-3 px-6 whitespace-nowrap text-[hsl(var(--muted-foreground))]">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
