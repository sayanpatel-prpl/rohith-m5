#!/usr/bin/env python3
"""Generate news-data.js from the raw news CSV file."""
import csv
import os
from datetime import datetime
from collections import Counter

COMPANY_MAP = {
    'Whirlpool of India Limited': 'whirlpool',
    'Whirlpool': 'whirlpool',
    'Voltas Limited': 'voltas',
    'Blue Star Limited': 'bluestar',
    'Crompton Greaves Consumer Electricals Limited': 'crompton',
    'Bajaj Electricals Limited': 'bajaj_elec',
    'V-Guard Industries Limited': 'vguard',
    'IFB Industries Limited': 'ifb',
    'Havells India Limited': 'havells',
    'Symphony Limited': 'symphony',
    'Orient Electric Limited': 'orient',
    'Dixon Technologies (India) Limited': 'dixon',
    'Amber Enterprises India Limited': 'amber',
    'TTK Prestige Limited': 'ttk_prestige',
    'Butterfly Gandhimathi Appliances Limited': 'butterfly',
    'Johnson Controls-Hitachi Air Conditioning India Limited': 'bosch_jch',
}

CUTOFF = datetime(2025, 11, 23)  # 90 days before 2026-02-21
MAX_PER_COMPANY = 8

def get_tier(source):
    sl = source.lower()
    if any(x in sl for x in ['bse', 'nse', 'sebi', 'company filing', 'annual report', 'official company']):
        return 1
    if any(x in sl for x in ['business standard', 'economic times', 'mint', 'moneycontrol', 'reuters', 'bloomberg', 'cnbc', 'livemint']):
        return 2
    if any(x in sl for x in ['newsroom', 'investor presentation', 'industry report', 'official press', 'press release']):
        return 3
    return 4

def js_escape(s):
    if s is None:
        return 'null'
    esc = s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ').replace('\r', '')
    return "'" + esc + "'"

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, '..', 'data_sources', 'Data source - NEWS - news + reports .csv')
    out_path = os.path.join(script_dir, '..', 'assets', 'js', 'news-data.js')

    items = []
    total = 0

    with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            cn = row.get('company_name', '').strip()
            cid = COMPANY_MAP.get(cn)
            if not cid:
                continue
            title = row.get('news_title', '').strip()
            if not title:
                continue
            date_str = row.get('date', '').strip()
            if not date_str:
                continue
            try:
                dt = datetime.strptime(date_str, '%Y-%m-%d')
            except ValueError:
                continue
            if dt < CUTOFF:
                continue

            source = row.get('source', '').strip() or 'Unknown'
            category = row.get('category', '').strip() or 'General'
            summary = row.get('key_insight_summary', '').strip()
            cxo = row.get('CXO_quote', '').strip() or None
            impl = row.get('strategic_implication', '').strip() or None

            tier = get_tier(source)
            cred = 'high' if tier <= 2 else ('medium' if tier == 3 else 'low')

            items.append({
                'companyId': cid,
                'company': cn.replace(' Limited', '').replace(' (India)', ''),
                'title': title[:200],
                'date': date_str,
                'source': source[:100],
                'category': category,
                'sourceTier': tier,
                'sourceCredibility': cred,
                'summary': summary[:300],
                'cxoQuote': cxo[:300] if cxo else None,
                'strategicImplication': impl[:300] if impl else None,
            })

    # Sort by date descending
    items.sort(key=lambda x: x['date'], reverse=True)

    # Limit per company
    co_counts = Counter()
    filtered = []
    for item in items:
        if co_counts[item['companyId']] < MAX_PER_COMPANY:
            co_counts[item['companyId']] += 1
            filtered.append(item)

    # Add IDs
    for i, item in enumerate(filtered):
        item['id'] = i + 1

    # Generate JS
    lines = [
        '/*',
        ' * News Intelligence Data — Curated from 30K+ news items',
        ' * Source: data_sources/Data source - NEWS - news + reports .csv',
        ' * Processed: 2026-02-21',
        ' * Filter: 90-day window, tracked companies only, %d items/company max' % MAX_PER_COMPANY,
        ' */',
        '',
        'const NEWS_DATA = {',
        '  lastUpdated: "2026-02-21",',
        '  totalProcessed: %d,' % total,
        '  itemCount: %d,' % len(filtered),
        '  items: [',
    ]

    for item in filtered:
        lines.append('    {')
        lines.append('      id: %d,' % item['id'])
        lines.append('      companyId: %s,' % js_escape(item['companyId']))
        lines.append('      company: %s,' % js_escape(item['company']))
        lines.append('      title: %s,' % js_escape(item['title']))
        lines.append('      date: %s,' % js_escape(item['date']))
        lines.append('      source: %s,' % js_escape(item['source']))
        lines.append('      category: %s,' % js_escape(item['category']))
        lines.append('      sourceTier: %d,' % item['sourceTier'])
        lines.append('      sourceCredibility: %s,' % js_escape(item['sourceCredibility']))
        lines.append('      summary: %s,' % js_escape(item['summary']))
        lines.append('      cxoQuote: %s,' % js_escape(item['cxoQuote']))
        lines.append('      strategicImplication: %s,' % js_escape(item['strategicImplication']))
        lines.append('    },')

    lines.append('  ],')
    lines.append('};')

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print('Generated %s with %d items from %d rows' % (out_path, len(filtered), total))
    print('Company distribution:', dict(co_counts))

if __name__ == '__main__':
    main()
