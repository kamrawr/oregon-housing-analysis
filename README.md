# Oregon Housing Analysis

**🌐 Live Site:** [https://kamrawr.github.io/oregon-housing-analysis/](https://kamrawr.github.io/oregon-housing-analysis/)

Comprehensive analysis of housing, income, and affordability across Oregon's 36 counties with focus on Investor-Owned Utility (IOU) service territories.

## 🎯 Overview

This project combines static reference materials with interactive data exploration tools to analyze Oregon's housing landscape:

- **County Database** - Detailed profiles for all 36 Oregon counties
- **Interactive Explorer** - D3.js visualizations and comparative analysis tools
- **Data-Driven Insights** - AMI disparities, housing supply gaps, low-income concentration

## 📊 Features

### County Database (`index.html`)
- **All 36 Oregon counties** organized by region (Metro, Valley, Coast, Southern, Central, Eastern)
- **Collapsible sections** for easier navigation
- **Search & filter** by income level, Energy Trust eligibility, geographic features
- **Comprehensive data** per county:
  - Economic profile (AMI, income classification)
  - Utility services (electric, gas, Energy Trust eligibility)
  - Housing type distribution (Single family, multifamily, manufactured)
  - Program targeting notes

### Interactive Explorer (`explore.html`)
- **Dynamic visualizations** powered by D3.js
- **Multiple analysis views:**
  - Housing units by region
  - Area Median Income comparison
  - Low-income household concentration
  - Units per 1,000 residents
- **County comparison tool** - Side-by-side metrics for up to 3 counties
- **Interactive data table** - Full county dataset with sorting

## 🏗️ Project Structure

```
oregon-housing-analysis/
├── index.html                     # County database (main page)
├── explore.html                   # Interactive data explorer
├── data/
│   ├── raw/                       # Source CSV files
│   │   ├── multifamily_estimates.csv    # Large MF housing (5+ units)
│   │   ├── ami_by_county.csv            # HUD Area Median Income 2025
│   │   └── ami_groups.csv               # Counties grouped by AMI
│   └── processed/                 # Cleaned/merged data (future)
├── visualizations/
│   ├── js/
│   │   └── explorer.js            # D3.js visualization logic
│   ├── css/                       # Custom styles
│   └── maps/                      # Future map visualizations
├── analysis/                      # Analysis notebooks (future)
├── docs/                          # Additional documentation
└── README.md                      # This file
```

## 📈 Key Findings

### Housing Distribution
- **Metro Dominance**: Portland metro (Multnomah, Washington, Clackamas) = 134,600 units (**75%** of IOU total)
- **Rural Scarcity**: Eastern Oregon = 3,600 units despite vast geographic area
- **Per Capita Gap**: Metro areas have **2.3x** more multifamily housing per capita than rural regions

### Income Disparities
- **AMI Range**: $81,400 (rural) to $124,100 (Portland metro) - **53% variance**
- **High-Income Counties**: Portland metro ($124K), Deschutes ($114K), Benton ($118K)
- **Low-Income Counties**: 22 rural counties at $81-85K AMI

### Affordability Crisis
- **Low-Income Concentration**: 40-55% of multifamily residents <80% AMI
- **Regional Variation**:
  - Central Oregon: 40% low-income
  - Willamette Valley: 45%
  - Portland Metro: 50%
  - Southern/Coast/Eastern: 55%
- **Double Burden**: Rural counties face lower incomes AND limited housing supply

### Program Insights
- **Energy Trust Coverage**: ~75% of housing units eligible through IOU utilities
- **Metro Low-Income**: 67,300 estimated low-income households in metro multifamily
- **Supply-Need Mismatch**: Counties with highest low-income % often have least housing

## 🚀 Getting Started

### View Locally

1. Clone or download this repository
2. Open `index.html` in a web browser for the county database
3. Navigate to `explore.html` for interactive analytics

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No installation needed - uses CDN-hosted libraries (PicoCSS, D3.js v7)

## 📊 Data Sources

### Primary Datasets

1. **Large Multifamily Housing Estimates** (`multifamily_estimates.csv`)
   - Source: Energy Trust of Oregon planning estimates
   - Scope: IOU service territories only
   - Coverage: 35 counties + 6 regional totals
   - Metrics: Units, buildings, residents, low-income household estimates

2. **Area Median Income 2025** (`ami_by_county.csv`)
   - Source: U.S. Department of Housing and Urban Development (HUD)
   - Base: 4-person household AMI at 100%
   - Tiers: 60%, 80%, 100%, 120%, 150%, 180%, 200% AMI
   - Coverage: All 36 Oregon counties

3. **AMI County Groups** (`ami_groups.csv`)
   - Simplified groupings for regional comparison
   - 13 distinct AMI levels

### Supplementary Data
- Population estimates: 2023 U.S. Census estimates
- Energy Trust eligibility: Based on utility service territories
- Regional classifications: Oregon Housing & Community Services

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** + **PicoCSS** - Styling
- **JavaScript (ES6+)** - Interactivity
- **D3.js v7** - Data visualization
- **CSV** - Data format (no database required)

## 📝 Methodology

### Income Categories
- **High AMI**: ≥$110,000 (green indicators)
- **Medium AMI**: $90,000-$109,999 (orange indicators)
- **Low AMI**: <$90,000 (red indicators)

### Low-Income Definition
- Households earning <80% AMI
- Regional percentages are estimates based on housing type and location
- Used for planning purposes, not exact counts

### IOU Service Areas
Data focuses on Investor-Owned Utility territories:
- Portland General Electric (PGE)
- Pacific Power
- Idaho Power (Malheur County)
- Avista (limited Eastern Oregon)
- NW Natural (natural gas)
- Cascade Natural Gas

Consumer-Owned Utilities (COUs) not fully represented.

## 🔄 Data Updates

This project is designed for easy data updates as new information becomes available.

**Update Schedule:**
- AMI Data: Annually (HUD releases spring)
- Housing Estimates: Every 1-2 years
- Population: Annually (Census)

**Documentation:**
- **[UPDATE_GUIDE.md](docs/UPDATE_GUIDE.md)** - Step-by-step instructions for updating data
- **[DATA_VERSION.md](docs/DATA_VERSION.md)** - Version history and changelog

**Current Data Version**: 1.0 (October 2025)
- AMI: HUD FY 2025
- Housing: Energy Trust August 2025  
- Population: Census 2023

## 🔮 Future Enhancements

- [ ] Historical trend analysis (2015-2025)
- [ ] Include Consumer-Owned Utility data
- [ ] Single-family and small multifamily data
- [ ] Interactive map visualizations
- [ ] Housing cost/rent data integration
- [ ] Python/Jupyter notebooks for statistical analysis
- [ ] Export functionality for charts and data
- [ ] Mobile app version

## 📚 References

### Data Sources
- Energy Trust of Oregon - Multifamily IOU planning estimates
- U.S. Department of Housing and Urban Development (HUD) - 2025 AMI data
- Oregon Housing & Community Services - Regional housing analysis
- U.S. Census Bureau - Population estimates

### Background Research
- Oregon Statewide Housing Needs Analysis (2020)
- Energy Trust Strategic Plan 2020-2024
- Portland Metro 2040 Growth Concept
- County-level housing studies

## 🤝 Contributing

This is a research/analysis project. Contributions welcome:
- Data quality improvements
- Additional analysis suggestions
- Visualization enhancements
- Documentation improvements

## 📄 License

- **Data**: Public domain / government sources
- **Code**: MIT License
- **Visualizations**: Creative Commons Attribution 4.0

## 🏷️ Tags

`oregon` `housing` `affordability` `data-visualization` `d3js` `area-median-income` `multifamily-housing` `energy-efficiency` `regional-planning`

---

**Last Updated**: October 2025  
**Data Period**: August 2025 estimates  
**Version**: 1.0
