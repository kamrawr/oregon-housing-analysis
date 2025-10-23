# Data Version History

This file tracks all data updates to the Oregon Housing Analysis project.

## Version 1.0 - October 2025

**Initial Release**

### Data Sources

**Area Median Income (AMI)**
- Source: U.S. Department of Housing and Urban Development (HUD)
- Release: 2025 Income Limits
- File: `data/raw/ami_by_county.csv`
- Coverage: All 36 Oregon counties
- Base: 4-person household AMI at 100%
- Tiers: 60%, 80%, 100%, 120%, 150%, 180%, 200%
- Date Range: FY 2025 (effective April 1, 2025)

**Large Multifamily Housing Estimates**
- Source: Energy Trust of Oregon planning data
- File: `data/raw/multifamily_estimates.csv`
- Compilation Date: August 2025
- Coverage: 35 counties in IOU service territories
- Scope: Large multifamily (5+ units) only
- Metrics: Units, buildings, residents, low-income household estimates
- Regional breakdowns: Metro, Valley, Southern, Central, Coast, Eastern

**Population Estimates**
- Source: U.S. Census Bureau
- Release: 2023 Population Estimates
- Location: Embedded in `visualizations/js/explorer.js`
- Coverage: All 36 Oregon counties
- Note: Some counties use approximations where exact data unavailable

### Key Statistics (Version 1.0)

- **Total Large MF Units (IOU)**: ~180,000
- **AMI Range**: $81,400 - $124,100
- **Counties Analyzed**: 36
- **Regional Divisions**: 6
- **Low-Income HH (Metro)**: 67,300 estimated

### Data Quality Notes

- IOU service areas only (Consumer-Owned Utilities not fully represented)
- Lane County data clipped to IOU service area only
- Low-income percentages are regional estimates (40-55% by region)
- Housing type distributions in `index.html` are approximate

### Files Updated in Version 1.0

```
data/raw/
├── ami_by_county.csv (2,462 bytes)
├── ami_groups.csv (887 bytes)
└── multifamily_estimates.csv (1,638 bytes)

visualizations/js/
└── explorer.js (population data embedded)

index.html (county profiles)
explore.html (visualization platform)
```

---

## Future Update Template

When updating data, copy this template:

```markdown
## Version X.X - [Month Year]

**Update Type**: [Annual/Major/Minor]

### Changes

**Area Median Income (AMI)**
- Source: HUD FY [Year]
- Changes: [Describe significant AMI changes]
- Counties affected: [List if only partial update]

**Housing Estimates**
- Source: [Source name]
- Changes: [Describe data updates]
- New metrics: [Any new data points added]

**Population**
- Source: Census [Year]
- Changes: [Note significant population shifts]

### Impact

- [Describe how findings/insights changed]
- [Note any methodology updates]
- [List visualization changes]

### Files Modified

```
[List changed files]
```

### Migration Notes

- [Any breaking changes or format updates]
- [Instructions for users with cached data]
```

---

## Changelog Summary

| Version | Date | AMI Year | Housing Year | Pop. Year | Notes |
|---------|------|----------|--------------|-----------|-------|
| 1.0 | Oct 2025 | FY 2025 | Aug 2025 | 2023 | Initial release |

---

## Upcoming Data Sources

**Planned Updates:**
- **Spring 2026**: HUD FY 2026 AMI data (expected April 2026)
- **2026-2027**: Updated housing estimates from Energy Trust
- **Annual**: Census population estimates

**Monitoring:**
- Oregon Housing & Community Services reports
- Energy Trust Strategic Plan updates
- Local housing authority data releases

---

**Maintained By**: Project maintainers  
**Last Updated**: October 2025  
**Next Scheduled Update**: Spring 2026 (AMI data)
