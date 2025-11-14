#!/usr/bin/env python3
"""
Script to split the Oregon Housing Database into separate pages by region
"""

import re
from pathlib import Path

# Read the original file
original_file = Path("index-original-single-page.html")
with open(original_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS (everything between <style> and </style>)
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
css = css_match.group(1) if css_match else ""

# Extract JavaScript (everything between <script> and </script> at the end)
js_match = re.search(r'<script>(.*?)</script>\s*</body>', content, re.DOTALL)
js = js_match.group(1) if js_match else ""

# Extract Justice40 data
justice40_match = re.search(r'const justice40Data = \{(.*?)\};', content, re.DOTALL)
justice40_data = justice40_match.group(0) if justice40_match else ""

def create_page_header(title, region_name=""):
    """Create standardized header for all pages"""
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Oregon Housing Database</title>
    <style>
{css}
        .breadcrumb {{
            background: #f8f9fa;
            padding: 15px 20px;
            margin: -20px -20px 20px -20px;
            border-bottom: 2px solid #e9ecef;
        }}
        
        .breadcrumb a {{
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
        }}
        
        .breadcrumb a:hover {{
            text-decoration: underline;
        }}
        
        .breadcrumb span {{
            color: #6c757d;
            margin: 0 8px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="breadcrumb">
            <a href="../../index-new.html">🏠 Home</a>
            <span>›</span>
            <span>{region_name if region_name else title}</span>
        </div>
        
        <div class="header">
            <h1>{title}</h1>
'''

def create_page_footer():
    """Create standardized footer for all pages"""
    return f'''        
        <div style="text-align: center; margin: 60px 0 20px 0;">
            <a href="../../index-new.html" style="display: inline-block; background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);">← Back to Home</a>
        </div>
    </div>
    
    <script>
{js}
    </script>
</body>
</html>'''

# Define region boundaries
regions = {
    'metro': {
        'file': 'pages/regions/portland-metro.html',
        'title': 'Portland Metropolitan Area',
        'start_marker': '<section id="metro"',
        'end_marker': '</section>\n\n        <section id="valley"'
    },
    'valley': {
        'file': 'pages/regions/willamette-valley.html',
        'title': 'Willamette Valley Counties',
        'start_marker': '<section id="valley"',
        'end_marker': '</section>\n\n        <section id="coast"'
    },
    'coast': {
        'file': 'pages/regions/coastal.html',
        'title': 'Coastal Counties',
        'start_marker': '<section id="coast"',
        'end_marker': '</section>\n\n        <section id="southern"'
    },
    'southern': {
        'file': 'pages/regions/southern-oregon.html',
        'title': 'Southern Oregon',
        'start_marker': '<section id="southern"',
        'end_marker': '</section>\n\n        <section id="central"'
    },
    'central': {
        'file': 'pages/regions/central-oregon.html',
        'title': 'Central Oregon',
        'start_marker': '<section id="central"',
        'end_marker': '</section>\n\n        <section id="eastern"'
    },
    'eastern': {
        'file': 'pages/regions/eastern-oregon.html',
        'title': 'Eastern Oregon',
        'start_marker': '<section id="eastern"',
        'end_marker': '</section>\n\n        <section id="housing-types"'
    }
}

print("Extracting regional pages...")

for region_key, region_info in regions.items():
    print(f"Processing {region_info['title']}...")
    
    # Find the start position
    start_pos = content.find(region_info['start_marker'])
    if start_pos == -1:
        print(f"  ⚠️  Could not find start marker for {region_key}")
        continue
    
    # Find the end position
    end_pos = content.find(region_info['end_marker'], start_pos)
    if end_pos == -1:
        # If no end marker, try to find the next section
        end_pos = content.find('<section id=', start_pos + 100)
    
    if end_pos == -1:
        print(f"  ⚠️  Could not find end marker for {region_key}")
        continue
    
    # Extract the section content
    section_content = content[start_pos:end_pos]
    
    # Remove the section wrapper tags but keep the content
    section_content = re.sub(r'<section[^>]*>', '', section_content, count=1)
    section_content = section_content.replace('</section>', '', 1)
    
    # Build the full page
    page_content = create_page_header(region_info['title'], region_info['title'])
    page_content += section_content
    page_content += create_page_footer()
    
    # Ensure directory exists
    output_path = Path(region_info['file'])
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write the file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(page_content)
    
    print(f"  ✓ Created {region_info['file']}")

print("\n✨ Region pages created successfully!")
print("\nNext steps:")
print("1. Review the generated pages")
print("2. Create topic pages (housing-types.html, utilities.html, data-sources.html)")
print("3. Replace index.html with index-new.html")
print("4. Test all navigation links")
