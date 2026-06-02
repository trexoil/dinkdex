#!/usr/bin/env python3
"""Retry timed-out regions for OSM pickleball courts."""

import json
import time
import urllib.request
import urllib.parse
import urllib.error
import ssl
import sys
import os

OUTPUT_PATH = "/home/eric/workspace/dinkdex/prisma/osm-courts.json"
USER_AGENT = "Mozilla/5.0 (compatible; DinkdexBot/1.0; +https://dinkdex.app)"

# Split large regions into smaller bounding boxes to avoid timeouts
REGIONS = {
    "Europe West":  (35, -10, 60, 10),
    "Europe East":  (35, 10, 60, 30),
    "SE Asia West": (5, 95, 15, 110),
    "SE Asia East": (5, 110, 15, 120),
    "Australia":    (-45, 110, -10, 155),
    "New Zealand":  (-48, 165, -34, 180),
}

ENDPOINTS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]

def query_region(name, bbox, endpoint_idx=0):
    """Query Overpass API for pickleball courts in a bounding box."""
    south, west, north, east = bbox
    bbox_str = f"{south},{west},{north},{east}"

    overpass_query = f"""
    [out:json][timeout:180][maxsize:1073741824];
    (
      node["sport"="pickleball"]({bbox_str});
      way["sport"="pickleball"]({bbox_str});
    );
    out center 1000;
    """

    data = urllib.parse.urlencode({"data": overpass_query}).encode()
    
    # Try each endpoint in round-robin
    for i in range(len(ENDPOINTS)):
        url = ENDPOINTS[(endpoint_idx + i) % len(ENDPOINTS)]
        req = urllib.request.Request(url, data=data)
        req.add_header("User-Agent", USER_AGENT)
        req.add_header("Content-Type", "application/x-www-form-urlencoded")

        print(f"[{name}] Trying {url} with bbox {bbox_str} ...", flush=True)
        try:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            resp = urllib.request.urlopen(req, timeout=180, context=ctx)
            raw = resp.read()
            result = json.loads(raw.decode())
            elements = result.get("elements", [])
            print(f"[{name}] Got {len(elements)} results from {url}", flush=True)
            return elements
        except Exception as e:
            print(f"[{name}] ERROR with {url}: {e}", flush=True)
            time.sleep(2)
    
    return []

def extract_courts(elements, region_name):
    """Extract name, lat, lon, city, country, indoor/outdoor from OSM elements."""
    courts = []
    for el in elements:
        tags = el.get("tags", {})
        el_type = el.get("type", "node")

        if el_type == "node":
            lat = el.get("lat")
            lon = el.get("lon")
        else:
            center = el.get("center", {})
            lat = center.get("lat")
            lon = center.get("lon")

        if lat is None or lon is None:
            continue

        name = tags.get("name", "")
        indoor_val = tags.get("indoor", "").lower()
        location_val = tags.get("location", "").lower()
        
        if indoor_val == "yes" or location_val == "indoor":
            indoor = "indoor"
        elif indoor_val == "no" or location_val in ("outdoor", "outdoors"):
            indoor = "outdoor"
        else:
            indoor = "unknown"

        city = tags.get("addr:city", tags.get("city", ""))
        country = tags.get("addr:country", tags.get("country", ""))

        courts.append({
            "name": name,
            "lat": lat,
            "lon": lon,
            "city": city,
            "country": country,
            "indoor": indoor,
            "region": region_name,
        })
    return courts

def main():
    all_new = []
    endpoint_idx = 3  # start from 4th endpoint attempt (we've used kumi before)

    for region_name, bbox in REGIONS.items():
        elements = query_region(region_name, bbox, endpoint_idx)
        courts = extract_courts(elements, region_name)
        all_new.extend(courts)
        print(f"[{region_name}] Extracted {len(courts)} courts", flush=True)
        time.sleep(2)
        endpoint_idx = (endpoint_idx + 1) % len(ENDPOINTS)

    print(f"\nNew results: {len(all_new)}", flush=True)

    # Load existing
    existing = []
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)
    
    print(f"Existing courts: {len(existing)}", flush=True)

    # Merge and deduplicate
    combined = existing + all_new
    seen = set()
    unique = []
    for c in combined:
        name_key = c["name"].strip().lower()
        lat_key = round(c["lat"], 5)
        lon_key = round(c["lon"], 5)
        key = (name_key, lat_key, lon_key)
        if key not in seen:
            seen.add(key)
            unique.append(c)

    print(f"Total after merge + dedup: {len(unique)}", flush=True)

    with open(OUTPUT_PATH, "w") as f:
        json.dump(unique, f, indent=2)

    print(f"\nSaved to {OUTPUT_PATH}", flush=True)

    # Stats
    named = [c for c in unique if c["name"]]
    from collections import Counter
    region_counts = Counter(c["region"] for c in unique)
    print(f"\nPer region (after dedup):")
    for r, cnt in region_counts.most_common():
        print(f"  {r}: {cnt}")

if __name__ == "__main__":
    main()
