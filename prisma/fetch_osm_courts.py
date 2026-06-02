#!/usr/bin/env python3
"""Fetch pickleball courts from OSM Overpass API for multiple regions."""

import json
import time
import urllib.request
import urllib.parse
import urllib.error
import ssl
import sys
import os

OUTPUT_PATH = "/home/eric/workspace/dinkdex/prisma/osm-courts.json"

REGIONS = {
    "USA West":    (24, -125, 50, -100),
    "USA East":    (24, -100, 50, -65),
    "Europe":      (35, -10, 60, 30),
    "SE Asia":     (5, 95, 15, 120),
    "Canada":      (45, -130, 60, -60),
    "Australia+NZ":(-45, 110, -10, 180),
    "South America":(-60, -80, 15, -30),
    "Japan+SKorea":(20, 120, 50, 135),
    "India":       (5, 65, 35, 90),
}

OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter"
USER_AGENT = "Mozilla/5.0 (compatible; DinkdexBot/1.0; +https://dinkdex.app)"

def query_region(name, bbox):
    """Query Overpass API for pickleball courts in a bounding box."""
    south, west, north, east = bbox
    bbox_str = f"{south},{west},{north},{east}"

    overpass_query = f"""
    [out:json][timeout:90];
    (
      node["sport"="pickleball"]({bbox_str});
      way["sport"="pickleball"]({bbox_str});
    );
    out center 100;
    """

    data = urllib.parse.urlencode({"data": overpass_query}).encode()
    req = urllib.request.Request(OVERPASS_URL, data=data)
    req.add_header("User-Agent", USER_AGENT)
    req.add_header("Content-Type", "application/x-www-form-urlencoded")

    print(f"[{name}] Querying {bbox_str} ...", flush=True)

    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        resp = urllib.request.urlopen(req, timeout=120, context=ctx)
        raw = resp.read()
        result = json.loads(raw.decode())
        elements = result.get("elements", [])
        print(f"[{name}] Got {len(elements)} results", flush=True)
        return elements
    except Exception as e:
        print(f"[{name}] ERROR: {e}", flush=True)
        return []

def extract_courts(elements, region_name, bbox):
    """Extract name, lat, lon, city, country, indoor/outdoor from OSM elements."""
    courts = []
    for el in elements:
        tags = el.get("tags", {})
        el_type = el.get("type", "node")

        # Get coordinates
        if el_type == "node":
            lat = el.get("lat")
            lon = el.get("lon")
        else:
            # way or relation - use center
            center = el.get("center", {})
            lat = center.get("lat")
            lon = center.get("lon")

        if lat is None or lon is None:
            continue

        name = tags.get("name", "")

        # Indoor/outdoor: "indoor" if indoor=yes, etc.
        indoor_val = tags.get("indoor", "").lower()
        location_val = tags.get("location", "").lower()
        if indoor_val == "yes" or location_val == "indoor":
            indoor = "indoor"
        elif indoor_val == "no" or indoor_val == "" and location_val in ("outdoor", "outdoors", ""):
            # Default check: if court surface info suggests outdoor
            surface = tags.get("surface", "").lower()
            if location_val == "outdoor":
                indoor = "outdoor"
            else:
                indoor = "unknown"
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

def deduplicate(courts):
    """Deduplicate by name+lat+lon."""
    seen = set()
    unique = []
    for c in courts:
        # Build dedup key: normalized name + rounded lat/lon
        name_key = c["name"].strip().lower()
        lat_key = round(c["lat"], 5)
        lon_key = round(c["lon"], 5)
        key = (name_key, lat_key, lon_key)
        if key not in seen:
            seen.add(key)
            unique.append(c)
    return unique

def main():
    all_courts = []
    total_before_dedup = 0

    for region_name, bbox in REGIONS.items():
        elements = query_region(region_name, bbox)
        courts = extract_courts(elements, region_name, bbox)
        all_courts.extend(courts)
        total_before_dedup += len(courts)
        print(f"[{region_name}] Extracted {len(courts)} courts (running total: {len(all_courts)})", flush=True)
        # Be polite - small delay between queries
        time.sleep(1.5)

    print(f"\nTotal before dedup: {total_before_dedup}", flush=True)
    unique = deduplicate(all_courts)
    print(f"Total after dedup: {len(unique)}", flush=True)

    # Write output
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(unique, f, indent=2)

    print(f"\nSaved to {OUTPUT_PATH}", flush=True)

    # Quick stats
    named = [c for c in unique if c["name"]]
    unnamed = [c for c in unique if not c["name"]]
    indoor = [c for c in unique if c["indoor"] == "indoor"]
    outdoor = [c for c in unique if c["indoor"] == "outdoor"]
    print(f"Named courts: {len(named)}, Unnamed: {len(unnamed)}", flush=True)
    print(f"Indoor: {len(indoor)}, Outdoor: {len(outdoor)}, Unknown: {len(unique) - len(indoor) - len(outdoor)}", flush=True)

    # Per region
    from collections import Counter
    region_counts = Counter(c["region"] for c in unique)
    print(f"\nPer region (after dedup):")
    for r, cnt in region_counts.most_common():
        print(f"  {r}: {cnt}")

if __name__ == "__main__":
    main()
