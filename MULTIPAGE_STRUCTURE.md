# Oregon Housing Database - Multi-Page Structure

## Overview
The Oregon Comprehensive Housing Database has been restructured into a user-friendly multi-page website to reduce information overload and improve navigation.

## New Structure

### Main Landing Page
- **File**: `index.html`
- **Purpose**: Clean entry point with summary statistics and navigation cards
- **Features**: 
  - 6 key statistics
  - Regional navigation cards
  - Topic resource cards
  - Quick access tools

### Regional Pages
Located in `/pages/regions/`:

1. **portland-metro.html** - Portland Metropolitan Area (5 counties)
2. **willamette-valley.html** - Willamette Valley Counties (7 counties)
3. **coastal.html** - Coastal Counties (7 counties)
4. **southern-oregon.html** - Southern Oregon (3 counties)
5. **central-oregon.html** - Central Oregon (4 counties)
6. **eastern-oregon.html** - Eastern Oregon (10 counties)

Each regional page includes:
- Full county data cards
- Economic profiles
- Utility service information
- Housing type distributions
- Justice40 environmental justice data
- Breadcrumb navigation

### Topic Pages
Located in `/pages/topics/`:

1. **housing-types.html** - Housing Type Classifications
2. **utilities.html** - Utility Service Analysis  
3. **data-sources.html** - Data Sources & Methodology

*Note: These currently redirect to the full single-page database. You can extract and format these sections later.*

### Legacy Files

- **index-original-single-page.html** - Complete original single-page database (backup)
- **index-backup.html** - Previous version with collapse/expand features
- **split_pages.py** - Python script used to generate regional pages

## Benefits

✅ **Reduced Scrolling**: Landing page is concise and scannable  
✅ **Faster Loading**: Each regional page loads only its counties  
✅ **Better Navigation**: Clear breadcrumbs and back buttons  
✅ **Cleaner UX**: Users choose what content to view  
✅ **Maintained Functionality**: All county toggles and Justice40 data still work  
✅ **Preserved Data**: Original single-page version accessible via "Single-Page Database" link

## Navigation Flow

```
index.html (Landing)
├── pages/regions/portland-metro.html
├── pages/regions/willamette-valley.html
├── pages/regions/coastal.html
├── pages/regions/southern-oregon.html
├── pages/regions/central-oregon.html
├── pages/regions/eastern-oregon.html
├── pages/topics/housing-types.html → redirects to full database
├── pages/topics/utilities.html → redirects to full database
└── pages/topics/data-sources.html → redirects to full database
```

## Quick Links Available

- 📊 Interactive Data Explorer (`explore.html`)
- 🗺️ County Map View (`map.html`)
- 📄 Single-Page Database (`index-original-single-page.html`)

## Future Enhancements

Consider:
1. Extracting full topic pages (housing-types, utilities, data-sources) as standalone pages
2. Adding a search bar on the landing page
3. Creating county-specific individual pages
4. Adding more interactive visualizations per region
5. Implementing a comparison tool between counties

## File Structure

```
oregon-housing-analysis/
├── index.html                          # NEW: Landing page
├── index-original-single-page.html     # Original full database
├── index-backup.html                   # Previous version
├── explore.html                        # Interactive explorer
├── map.html                            # Map view
├── split_pages.py                      # Generation script
├── pages/
│   ├── regions/
│   │   ├── portland-metro.html
│   │   ├── willamette-valley.html
│   │   ├── coastal.html
│   │   ├── southern-oregon.html
│   │   ├── central-oregon.html
│   │   └── eastern-oregon.html
│   └── topics/
│       ├── housing-types.html
│       ├── utilities.html
│       └── data-sources.html
└── data/
    └── (existing data files)
```

---

**Created**: November 2025  
**By**: Isaiah Kamrar, Community Consulting Partners LLC
