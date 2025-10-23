# Data Update Guide

This guide explains how to update the Oregon Housing Analysis data when new information becomes available.

## 📅 Update Schedule

Recommended update frequency:
- **AMI Data**: Annually (HUD releases new AMI data each spring)
- **Housing Estimates**: Every 1-2 years (as Energy Trust planning data refreshes)
- **Population Data**: Annually (U.S. Census Bureau estimates)

## 🔄 Step-by-Step Update Process

### 1. Update AMI Data

**Source**: HUD Area Median Income data  
**File Location**: `data/raw/ami_by_county.csv`

**Steps:**
1. Download latest HUD AMI data for Oregon counties
2. Format as CSV with columns:
   - `County` (with "County" suffix, e.g., "Multnomah County")
   - `AMI_100_4Person` (4-person household AMI at 100%)
   - `60%`, `80%`, `100%`, `120%`, `150%`, `180%`, `200%` (income tiers)

3. Replace `data/raw/ami_by_county.csv` with new file
4. Update `ami_groups.csv` if AMI groupings have changed significantly

**Example format:**
```csv
County,AMI_100_4Person,60%,80%,100%,120%,150%,180%,200%
Multnomah County,124100,74460,99280,124100,148920,186150,223380,248200
```

### 2. Update Housing Estimates

**Source**: Energy Trust of Oregon, local housing authorities  
**File Location**: `data/raw/multifamily_estimates.csv`

**Steps:**
1. Obtain updated large multifamily (5+ units) estimates
2. Format as CSV with columns:
   - `region` (Metro, Valley, Southern, Central, Coast, Eastern)
   - `county`
   - `units_est` (estimated units)
   - `buildings_est` (estimated buildings)
   - `residents_est` (estimated residents)
   - `low_income_share_est` (percentage as "50%", "45%", etc.)
   - `low_income_households_est` (calculated count)

3. Include regional totals with "— region total —" in county field
4. Replace `data/raw/multifamily_estimates.csv`

**Example format:**
```csv
region,county,units_est,buildings_est,residents_est,low_income_share_est,low_income_households_est
Metro,Multnomah,74030,1481,140657,50%,37015
```

### 3. Update Population Data

**Source**: U.S. Census Bureau estimates  
**File Location**: `visualizations/js/explorer.js` (lines 19-31)

**Steps:**
1. Find the `populationData` object in `explorer.js`
2. Update population estimates for each county
3. Ensure county names match exactly (including "(IOU clip)" suffix for Lane)

**Example:**
```javascript
const populationData = {
    'Multnomah': 830000,  // Updated from 820000
    'Washington': 660000,  // Updated from 650000
    // ... etc
};
```

### 4. Update County Database HTML

**File Location**: `index.html`

For significant changes to county profiles:

1. Search for the county name in `index.html`
2. Update relevant data fields:
   - Population (in county-population span)
   - AMI value and classification
   - Housing type percentages
   - Program targeting notes

**Example update:**
```html
<div class="county-name">
    Multnomah County
    <span class="county-population">830K</span>  <!-- Update here -->
</div>
```

### 5. Update README and Documentation

**Files to update:**
- `README.md`: Update "Last Updated" date and data period
- Header banners in `index.html` and `explore.html`: Update "Data Compiled" date

**Example:**
```html
<strong>Data Compiled March 2027</strong>
```

## ✅ Verification Checklist

After updating data, verify:

- [ ] CSV files parse correctly (no syntax errors)
- [ ] County names match between datasets
- [ ] Population data updated in `explorer.js`
- [ ] Charts render correctly in `explore.html`
- [ ] County profiles display updated data in `index.html`
- [ ] All links and navigation work
- [ ] README reflects new data period
- [ ] Commit message clearly indicates data update

## 🚀 Deployment Process

1. **Test locally**:
   ```bash
   cd ~/oregon-housing-analysis
   open index.html
   open explore.html
   # Verify data loads and displays correctly
   ```

2. **Commit changes**:
   ```bash
   git add data/raw/*.csv visualizations/js/explorer.js index.html README.md
   git commit -m "Data update: [Month Year] - AMI and housing estimates"
   git push
   ```

3. **Verify deployment**:
   - Wait 2-3 minutes for GitHub Pages to rebuild
   - Visit https://kamrawr.github.io/oregon-housing-analysis/
   - Check that new data appears

## 📝 Data Version Control

Consider adding a `DATA_VERSION.md` file to track changes:

```markdown
# Data Version History

## Version 2.0 - March 2027
- Updated AMI data (HUD 2027 release)
- Updated population estimates (2026 Census)
- Housing estimates remain from 2025

## Version 1.0 - August 2025
- Initial data compilation
- AMI: HUD 2025
- Housing: Energy Trust August 2025
- Population: 2023 Census estimates
```

## 🔍 Data Quality Checks

Before finalizing updates:

1. **Consistency**: Ensure county names are spelled identically across all files
2. **Completeness**: Verify all 36 counties have data
3. **Calculations**: Recalculate derived fields (e.g., low-income household counts)
4. **Ranges**: Check that values are reasonable (no obvious typos like 12000000 instead of 120000)

## 📊 Optional: Processed Data

For complex updates, consider creating processed/merged datasets:

```bash
# Create a merged dataset
data/processed/merged_county_data.csv
```

This can store pre-calculated values for:
- Units per 1,000 residents
- AMI ratios
- Regional averages

## 🆘 Troubleshooting

**Problem**: Charts not updating with new data  
**Solution**: Clear browser cache (Cmd+Shift+R) or check browser console for errors

**Problem**: County names don't match  
**Solution**: Ensure exact spelling including spaces and parentheses (e.g., "Lane (IOU clip)")

**Problem**: Percentages showing as numbers  
**Solution**: In CSV, use "50%" not 0.50 for low_income_share_est

**Problem**: GitHub Pages not updating  
**Solution**: Check Actions tab on GitHub for deployment status

## 📞 Support

For questions or issues with data updates:
- Review this guide
- Check `docs/` folder for additional documentation
- Review git history for past update patterns

---

**Last Updated**: October 2025  
**Guide Version**: 1.0
