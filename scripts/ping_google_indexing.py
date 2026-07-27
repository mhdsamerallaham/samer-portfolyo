#!/usr/bin/env python3
"""
ping_google_indexing.py — Automated URL & Sitemap Submission Tool for Google & Bing

Usage:
    python scripts/ping_google_indexing.py
"""

import sys
import xml.etree.ElementTree as ET
import urllib.request
import urllib.parse
import json
import os

SITEMAP_URL = "https://www.samer.life/sitemap.xml"
LOCAL_SITEMAP_PATH = os.path.join(os.path.dirname(__file__), "../dist/sitemap.xml")

def ping_search_engines():
    """Pings Google and Bing with the live sitemap URL."""
    print("--- 1. Pinging Search Engines with Sitemap ---")
    
    ping_urls = [
        f"https://www.google.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}",
        f"https://www.bing.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}"
    ]
    
    for url in ping_urls:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                print(f"[SUCCESS] Pinged: {url} | Status: {resp.status}")
        except Exception as e:
            print(f"[WARNING] Ping response for {url}: {e}")

def parse_urls_from_sitemap():
    """Parses loc tags from dist/sitemap.xml."""
    if not os.path.exists(LOCAL_SITEMAP_PATH):
        print(f"[INFO] Local sitemap not found at {LOCAL_SITEMAP_PATH}. Skipping URL extraction.")
        return []
    
    urls = []
    try:
        tree = ET.parse(LOCAL_SITEMAP_PATH)
        root = tree.getroot()
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        for loc in root.findall('.//ns:loc', namespace):
            if loc.text:
                urls.append(loc.text.strip())
    except Exception as e:
        print(f"[ERROR] Failed to parse sitemap: {e}")
    
    return urls

def main():
    print("==================================================")
    print(" SAMER.LIFE AUTOMATED INDEXING SUBMISSION TOOL ")
    print("==================================================\n")
    
    ping_search_engines()
    
    urls = parse_urls_from_sitemap()
    print(f"\n--- 2. Detected {len(urls)} URLs in sitemap ---")
    for u in urls[:10]:
        print(f"  • {u}")
    if len(urls) > 10:
        print(f"  ... and {len(urls) - 10} more.")
        
    print("\n--------------------------------------------------")
    print(" Google Indexing API Setup Instructions:")
    print(" 1. Create a Google Cloud Service Account with 'Owner' rights in GSC.")
    print(" 2. Download service_account.json to project root.")
    print(" 3. Install google-api-python-client: pip install oauth2client google-api-python-client")
    print(" 4. Submit URLs directly to https://indexing.googleapis.com/v3/urlNotifications:publish")
    print("--------------------------------------------------")

if __name__ == "__main__":
    main()
