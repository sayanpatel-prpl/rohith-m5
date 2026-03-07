#!/usr/bin/env python3
"""
gen_signal_data.py
Reads Pain Points CSV files for Voltas, Orient, and V-Guard,
generates JavaScript SIGNAL_DATA entries, and inserts them into index_v4.html.
"""

import csv
import re
import os

# ─── CONFIG ──────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
REPORTS = os.path.join(BASE, "archive", "consumer-durables-intelligence",
                       "data_sources", "Reports")

CSV_FILES = {
    "voltas": {
        "path": os.path.join(REPORTS, "voltas", "Voltas_Pain_Points_Ranked.csv"),
        "name": "Voltas",
        "ticker": "VOLTAS",
        # Columns: Rank,Indicator,Signal,Status,Time Period,Severity Level,
        #          Severity Rationale,Evidence (Verbatim),Source Document,Line Reference
        "schema": "voltas",
    },
    "orient": {
        "path": os.path.join(REPORTS, "orient", "Orient_Pain_Points_Ranked.csv"),
        "name": "Orient Electric",
        "ticker": "ORIENTELEC",
        # Columns: Rank,Company,Signal,Category,Severity,Status,Source,Date,
        #          Evidence,A&M_Service_Line,Confidence
        "schema": "orient_vguard",
    },
    "vguard": {
        "path": os.path.join(REPORTS, "vguard", "VGuard_Pain_Points_Ranked.csv"),
        "name": "V-Guard Industries",
        "ticker": "VGUARD",
        "schema": "orient_vguard",
    },
}

HTML_FILE = os.path.join(BASE, "index_v4.html")
MAX_SIGNALS = 30

# ─── HELPERS ─────────────────────────────────────────────────────────────────

def escape_js(s: str) -> str:
    """Escape a string for use inside JavaScript single-quoted string literals."""
    if not isinstance(s, str):
        s = str(s)
    # Replace backslash first
    s = s.replace("\\", "\\\\")
    # Escape single quotes
    s = s.replace("'", "\\'")
    # Collapse actual newlines / carriage returns to a space
    s = s.replace("\r\n", " ").replace("\r", " ").replace("\n", " ")
    # Escape backticks (just in case)
    s = s.replace("`", "\\`")
    return s.strip()


def map_status(raw: str) -> str:
    """Normalise status values to the dashboard's expected set."""
    raw = raw.strip().lower()
    mapping = {
        "negative": "Negative",
        "positive": "Positive",
        "watch": "Watch",
        "structural_risk": "Negative",
        "not_disclosed": "Watch",   # treat undisclosed as watch
        # orient / vguard use different vocab
        "ongoing": "Negative",
        "active": "Negative",
        "pending": "Watch",
        "uncertain": "Watch",
        "cyclical": "Watch",
        "one-time resolved": "Watch",
        "completed": "Watch",
        "growth stage": "Positive",
        "in progress": "Watch",
        "structural": "Watch",
        "planned": "Watch",
        "monitoring": "Watch",
        "seasonal": "Watch",
        "unknown": "Watch",
    }
    for key, val in mapping.items():
        if raw == key:
            return val
    # Default – return title-cased
    return raw.title()


def normalise_severity(raw: str) -> str:
    """Normalise severity to Critical/High/Medium/Low/Informational."""
    raw = raw.strip()
    mapping = {
        "critical": "Critical",
        "high": "High",
        "medium": "Medium",
        "medium-high": "High",
        "low-medium": "Low",
        "low": "Low",
        "informational": "Informational",
    }
    return mapping.get(raw.lower(), raw.title())


VALID_STATUSES = {"negative", "positive", "watch", "structural_risk", "not_disclosed"}


def read_voltas(path: str) -> list[dict]:
    """Read Voltas CSV (schema: Rank,Indicator,Signal,Status,Time Period,
    Severity Level,Severity Rationale,Evidence (Verbatim),Source Document,Line Reference).

    Some Signal fields contain unquoted commas (e.g. 'Rs 2,868 Cr'), causing
    csv.DictReader to split them. We detect these by checking whether the
    Status field contains an expected value; if not, we merge the Signal and
    Status columns back together.
    """
    signals = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                rank = int(row["Rank"])
            except (ValueError, KeyError):
                continue

            sig_raw = row.get("Signal", "")
            st_raw = row.get("Status", "")
            per_raw = row.get("Time Period", "")
            sev_raw = row.get("Severity Level", "")
            rat_raw = row.get("Severity Rationale", "")
            ev_raw = row.get("Evidence (Verbatim)", "")
            src_raw = row.get("Source Document", "")
            ref_raw = row.get("Line Reference", "")

            # Detect malformed row: Status is not a recognised value
            if st_raw.strip().lower() not in VALID_STATUSES:
                # The Signal was split at an unquoted comma — glue it back.
                # The remainder landed in Status (and possibly Time Period).
                # We reconstruct by joining sig + st to form the true Signal.
                # The true Status sits in per_raw; true Time Period in sev_raw;
                # true Severity Level in rat_raw; true Severity Rationale in ev_raw;
                # true Evidence in src_raw; true Source Document in ref_raw.
                sig_raw = sig_raw + "," + st_raw
                st_raw = per_raw
                per_raw = sev_raw
                sev_raw = rat_raw
                rat_raw = ev_raw
                ev_raw = src_raw
                src_raw = ref_raw
                ref_raw = ""

            # Second-level check: sometimes two commas were unquoted
            if st_raw.strip().lower() not in VALID_STATUSES:
                sig_raw = sig_raw + "," + st_raw
                st_raw = per_raw
                per_raw = sev_raw
                sev_raw = rat_raw
                rat_raw = ev_raw
                ev_raw = src_raw
                src_raw = ref_raw
                ref_raw = ""

            signals.append({
                "r": rank,
                "ind": escape_js(row.get("Indicator", "")),
                "sig": escape_js(sig_raw),
                "st": map_status(st_raw),
                "per": escape_js(per_raw),
                "sev": normalise_severity(sev_raw),
                "rat": escape_js(rat_raw),
                "conf": "verified",
                "ev_q": escape_js(ev_raw),
                "ev_src": escape_js(src_raw),
                "ev_ref": escape_js(ref_raw),
            })
    signals.sort(key=lambda x: x["r"])
    return signals[:MAX_SIGNALS]


def read_orient_vguard(path: str) -> list[dict]:
    """Read Orient/VGuard CSV (schema: Rank,Company,Signal,Category,Severity,Status,
    Source,Date,Evidence,A&M_Service_Line,Confidence)."""
    signals = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                rank = int(row["Rank"])
            except (ValueError, KeyError):
                continue
            signals.append({
                "r": rank,
                "ind": escape_js(row.get("Category", "")),
                "sig": escape_js(row.get("Signal", "")),
                "st": map_status(row.get("Status", "")),
                "per": escape_js(row.get("Date", "")),   # use Date as period
                "sev": normalise_severity(row.get("Severity", "")),
                "rat": escape_js(row.get("Signal", "")),  # use Signal as rationale (no separate col)
                "conf": "verified",
                "ev_q": escape_js(row.get("Evidence", "")),
                "ev_src": escape_js(row.get("Source", "")),
                "ev_ref": "",
            })
    signals.sort(key=lambda x: x["r"])
    return signals[:MAX_SIGNALS]


def signals_to_js(signals: list[dict], indent: str = "          ") -> str:
    """Render a list of signal dicts to a JavaScript array literal."""
    lines = []
    for s in signals:
        line = (
            f"{indent}{{r:{s['r']},ind:'{s['ind']}',sig:'{s['sig']}',st:'{s['st']}',"
            f"per:'{s['per']}',sev:'{s['sev']}',rat:'{s['rat']}',conf:'{s['conf']}',"
            f"ev:[{{q:'{s['ev_q']}',src:'{s['ev_src']}',ref:'{s['ev_ref']}'}}]}}"
        )
        lines.append(line)
    return ",\n".join(lines)


def build_entry(key: str, cfg: dict, signals: list[dict]) -> str:
    """Build the full JS object for one company entry."""
    sigs_js = signals_to_js(signals)
    return (
        f"      {key}: {{\n"
        f"        name: '{escape_js(cfg['name'])}', ticker: '{escape_js(cfg['ticker'])}',\n"
        f"        signals: [\n"
        f"{sigs_js}\n"
        f"        ]\n"
        f"      }}"
    )


# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    # 1. Read all CSVs
    entries = {}
    for key, cfg in CSV_FILES.items():
        print(f"Reading {key} CSV from {cfg['path']} ...")
        if cfg["schema"] == "voltas":
            sigs = read_voltas(cfg["path"])
        else:
            sigs = read_orient_vguard(cfg["path"])
        print(f"  → {len(sigs)} signals loaded.")
        entries[key] = (cfg, sigs)

    # 2. Read HTML
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    # 3. For each company:
    #    a. Remove the auto-init guard line
    #    b. Insert the full JS entry just before the closing of SIGNAL_DATA
    #       i.e. before the '// Add companies with EBITDA cards' comment block

    # The insertion anchor: the comment line right before the auto-init block
    INSERTION_ANCHOR = "    // Add companies with EBITDA cards but no transcript signals yet"

    # Build the JS block to insert (all 3 companies)
    js_blocks = []
    for key in ["voltas", "orient", "vguard"]:
        cfg, sigs = entries[key]
        js_blocks.append(build_entry(key, cfg, sigs))

    inserted_js = "      // --- Auto-generated signal data ---\n"
    inserted_js += ",\n".join(js_blocks)
    inserted_js += "\n"

    # We'll insert this as SIGNAL_DATA properties via assignment after the object closes,
    # but to keep it clean we append via SIGNAL_DATA.key = {...}; statements
    # placed right before the auto-init comment block.

    # Build assignment statements
    assign_stmts = []
    for key in ["voltas", "orient", "vguard"]:
        cfg, sigs = entries[key]
        sigs_js = signals_to_js(sigs, indent="          ")
        stmt = (
            f"    SIGNAL_DATA.{key} = {{\n"
            f"      name: '{escape_js(cfg['name'])}', ticker: '{escape_js(cfg['ticker'])}',\n"
            f"      signals: [\n"
            f"{sigs_js}\n"
            f"      ]\n"
            f"    }};"
        )
        assign_stmts.append(stmt)

    new_block = "\n".join(assign_stmts) + "\n\n"

    # 4. Remove old auto-init lines for orient, vguard, voltas
    for key in ["orient", "vguard", "voltas"]:
        # Match lines like:  if (!SIGNAL_DATA.orient) SIGNAL_DATA.orient = {...};
        pattern = rf"\n    if \(!SIGNAL_DATA\.{key}\)[^\n]+\n"
        html = re.sub(pattern, "\n", html)

    # 5. Insert new assignment block just before the anchor comment
    if INSERTION_ANCHOR not in html:
        print("ERROR: Could not find insertion anchor in HTML!")
        return

    html = html.replace(INSERTION_ANCHOR, new_block + INSERTION_ANCHOR)

    # 6. Write back
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"\nDone! Updated {HTML_FILE}")
    print(f"  Voltas: {len(entries['voltas'][1])} signals")
    print(f"  Orient: {len(entries['orient'][1])} signals")
    print(f"  VGuard: {len(entries['vguard'][1])} signals")


if __name__ == "__main__":
    main()
