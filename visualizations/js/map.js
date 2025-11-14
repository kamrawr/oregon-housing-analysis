// Oregon Housing GIS Map - Interactive Visualization
// Uses D3.js v7 and TopoJSON for geographic rendering

let svg, g, projection, path, zoom;
let oregonData = [];
let currentLayer = 'units';
let selectedCounty = null;
let currentTransform = d3.zoomIdentity;

// Color scales for different layers
const colorScales = {
    units: d3.scaleSequential(d3.interpolateBlues).domain([0, 80000]),
    ami: d3.scaleSequential(d3.interpolateGreens).domain([81400, 124100]),
    'low-income': d3.scaleSequential(d3.interpolateReds).domain([0, 60]),
    density: d3.scaleSequential(d3.interpolatePurples).domain([0, 200]),
    'per-capita': d3.scaleSequential(d3.interpolateOranges).domain([0, 400])
};

// Initialize map
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
});

async function loadData() {
    try {
        // Load housing and AMI data
        const [housingData, amiData] = await Promise.all([
            d3.csv('data/raw/multifamily_estimates.csv'),
            d3.csv('data/raw/ami_by_county.csv')
        ]);

        // Merge datasets
        oregonData = mergeData(housingData, amiData);

        // Load Oregon GeoJSON (we'll create this next)
        const geoData = await fetchOregonGeoJSON();
        
        initializeMap(geoData);
        updateLegend();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading map data. Please ensure all data files are available.');
    }
}

function mergeData(housingData, amiData) {
    // Filter out regional totals
    const counties = housingData.filter(d => !d.county.includes('—'));
    
    return counties.map(h => {
        const countyName = h.county.replace(' (IOU clip)', '');
        const ami = amiData.find(a => 
            a.County.toLowerCase().includes(countyName.toLowerCase())
        );
        
        return {
            county: countyName,
            region: h.region,
            units: +h.units_est || 0,
            buildings: +h.buildings_est || 0,
            residents: +h.residents_est || 0,
            lowIncomeShare: parseFloat(h.low_income_share_est) || 0,
            lowIncomeHouseholds: +h.low_income_households_est || 0,
            ami: ami ? +ami.AMI_100_4Person : 81400,
            ami60: ami ? +ami['60%'] : 48840,
            ami80: ami ? +ami['80%'] : 65120,
            density: calculateDensity(+h.buildings_est),
            perCapita: calculatePerCapita(+h.units_est, +h.residents_est)
        };
    });
}

function calculateDensity(buildings) {
    // Rough density metric (buildings per arbitrary area unit)
    // In real implementation, this would use actual county area
    return buildings / 10;
}

function calculatePerCapita(units, residents) {
    if (residents === 0) return 0;
    return (units / residents) * 1000;
}

async function fetchOregonGeoJSON() {
    // Using a simplified Oregon counties GeoJSON
    // In production, load from external file or CDN
    const oregonTopoJSON = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json');
    
    // Filter for Oregon (FIPS code 41)
    const oregonCounties = topojson.feature(oregonTopoJSON, oregonTopoJSON.objects.counties);
    oregonCounties.features = oregonCounties.features.filter(d => d.id.toString().startsWith('41'));
    
    return oregonCounties;
}

function initializeMap(geoData) {
    const container = document.getElementById('map');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG
    svg = d3.select('#map')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`);

    // Create main group for zoom/pan
    g = svg.append('g');

    // Setup projection for Oregon
    projection = d3.geoMercator()
        .center([-120.5, 43.8])
        .scale(4500)
        .translate([width / 2, height / 2]);

    path = d3.geoPath().projection(projection);

    // Setup zoom behavior
    zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            currentTransform = event.transform;
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Draw counties
    drawCounties(geoData);
}

function drawCounties(geoData) {
    const tooltip = d3.select('#tooltip');

    const counties = g.selectAll('.county')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('d', path)
        .attr('fill', d => getCountyColor(d))
        .on('mouseover', function(event, d) {
            const countyData = getCountyData(d);
            if (!countyData) return;

            tooltip
                .style('opacity', 1)
                .html(`
                    <strong>${countyData.county} County</strong><br>
                    ${formatTooltipContent(countyData)}
                `);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            tooltip.style('opacity', 0);
        })
        .on('click', function(event, d) {
            selectCounty(d, this);
        });

    // Add county labels if enabled
    if (document.getElementById('overlay-labels').checked) {
        addCountyLabels(geoData);
    }
}

function getCountyData(geoFeature) {
    // Match GeoJSON feature to our data
    // This is simplified - in production, use FIPS codes or proper matching
    const countyName = geoFeature.properties?.name;
    if (!countyName) return null;
    
    return oregonData.find(d => 
        d.county.toLowerCase().includes(countyName.toLowerCase().replace(' county', ''))
    );
}

function getCountyColor(geoFeature) {
    const data = getCountyData(geoFeature);
    if (!data) return '#ddd';

    const scale = colorScales[currentLayer];
    let value;

    switch(currentLayer) {
        case 'units':
            value = data.units;
            break;
        case 'ami':
            value = data.ami;
            break;
        case 'low-income':
            value = data.lowIncomeShare;
            break;
        case 'density':
            value = data.density;
            break;
        case 'per-capita':
            value = data.perCapita;
            break;
        default:
            value = data.units;
    }

    return scale(value);
}

function addCountyLabels(geoData) {
    g.selectAll('.county-label').remove();

    g.selectAll('.county-label')
        .data(geoData.features)
        .enter()
        .append('text')
        .attr('class', 'county-label')
        .attr('transform', d => {
            const centroid = path.centroid(d);
            return `translate(${centroid})`;
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#333')
        .attr('pointer-events', 'none')
        .text(d => {
            const data = getCountyData(d);
            return data ? data.county : '';
        });
}

function selectCounty(geoFeature, element) {
    const data = getCountyData(geoFeature);
    if (!data) return;

    // Clear previous selection
    g.selectAll('.county').classed('selected', false);
    
    // Mark as selected
    d3.select(element).classed('selected', true);
    selectedCounty = data;

    // Show info panel
    showInfoPanel(data);
}

function showInfoPanel(data) {
    const panel = document.getElementById('info-panel');
    const content = document.getElementById('info-content');

    content.innerHTML = `
        <h4>${data.county} County</h4>
        <span class="region-badge region-${data.region}">${data.region}</span>
        
        <div class="info-stat">
            <span class="info-label">Housing Units</span>
            <span class="info-value">${data.units.toLocaleString()}</span>
        </div>
        
        <div class="info-stat">
            <span class="info-label">Buildings</span>
            <span class="info-value">${data.buildings.toLocaleString()}</span>
        </div>
        
        <div class="info-stat">
            <span class="info-label">Residents</span>
            <span class="info-value">${data.residents.toLocaleString()}</span>
        </div>
        
        <div class="info-stat">
            <span class="info-label">Area Median Income</span>
            <span class="info-value">$${data.ami.toLocaleString()}</span>
        </div>
        
        <div class="info-stat">
            <span class="info-label">Low-Income Share</span>
            <span class="info-value">${data.lowIncomeShare}%</span>
        </div>
        
        <div class="info-stat">
            <span class="info-label">Low-Income Households</span>
            <span class="info-value">${data.lowIncomeHouseholds.toLocaleString()}</span>
        </div>
        
        <div class="info-stat">
            <span class="info-label">Units per 1K Residents</span>
            <span class="info-value">${data.perCapita.toFixed(1)}</span>
        </div>
    `;

    panel.classList.add('active');
}

function formatTooltipContent(data) {
    return `
        <strong>Region:</strong> ${data.region}<br>
        <strong>Units:</strong> ${data.units.toLocaleString()}<br>
        <strong>AMI:</strong> $${data.ami.toLocaleString()}<br>
        <strong>Low-Income:</strong> ${data.lowIncomeShare}%
    `;
}

function clearSelection() {
    g.selectAll('.county').classed('selected', false);
    document.getElementById('info-panel').classList.remove('active');
    selectedCounty = null;
}

function updateLegend() {
    const legend = document.getElementById('legend');
    const scale = colorScales[currentLayer];
    
    let title, format, steps;
    
    switch(currentLayer) {
        case 'units':
            title = 'Housing Units';
            format = d => d.toLocaleString();
            steps = [0, 20000, 40000, 60000, 80000];
            break;
        case 'ami':
            title = 'Area Median Income';
            format = d => '$' + (d/1000).toFixed(0) + 'K';
            steps = [81400, 90000, 100000, 110000, 124100];
            break;
        case 'low-income':
            title = 'Low-Income Share';
            format = d => d + '%';
            steps = [0, 15, 30, 45, 60];
            break;
        case 'density':
            title = 'Housing Density';
            format = d => d.toFixed(0);
            steps = [0, 50, 100, 150, 200];
            break;
        case 'per-capita':
            title = 'Units per 1K Residents';
            format = d => d.toFixed(0);
            steps = [0, 100, 200, 300, 400];
            break;
    }

    const items = steps.map(value => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${scale(value)}"></div>
            <span>${format(value)}</span>
        </div>
    `).join('');

    legend.innerHTML = `
        <div class="legend-title">${title}</div>
        ${items}
    `;
}

function updateMap() {
    g.selectAll('.county')
        .transition()
        .duration(500)
        .attr('fill', d => getCountyColor(d));
    
    updateLegend();
}

function setupEventListeners() {
    // Layer selection
    document.querySelectorAll('input[name="layer"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentLayer = this.value;
            updateMap();
        });
    });

    // Overlays
    document.getElementById('overlay-labels').addEventListener('change', function() {
        if (this.checked) {
            // Re-fetch and add labels
            fetchOregonGeoJSON().then(geoData => addCountyLabels(geoData));
        } else {
            g.selectAll('.county-label').remove();
        }
    });

    document.getElementById('overlay-metro').addEventListener('change', function() {
        if (this.checked) {
            g.selectAll('.county')
                .style('opacity', d => {
                    const data = getCountyData(d);
                    return data && data.region === 'Metro' ? 1 : 0.4;
                });
        } else {
            g.selectAll('.county').style('opacity', 1);
        }
    });

    // Region filter
    document.getElementById('region-filter').addEventListener('change', function() {
        const region = this.value;
        g.selectAll('.county')
            .style('opacity', d => {
                if (region === 'all') return 1;
                const data = getCountyData(d);
                return data && data.region === region ? 1 : 0.2;
            });
    });

    // AMI filter
    const amiFilter = document.getElementById('ami-filter');
    const amiValue = document.getElementById('ami-value');
    
    amiFilter.addEventListener('input', function() {
        const minAmi = +this.value;
        amiValue.textContent = '$' + (minAmi/1000).toFixed(0) + 'K';
        
        g.selectAll('.county')
            .style('opacity', d => {
                const data = getCountyData(d);
                return data && data.ami >= minAmi ? 1 : 0.2;
            });
    });
}

function zoomIn() {
    svg.transition().call(zoom.scaleBy, 1.5);
}

function zoomOut() {
    svg.transition().call(zoom.scaleBy, 0.67);
}

function resetView() {
    svg.transition().call(zoom.transform, d3.zoomIdentity);
    document.getElementById('region-filter').value = 'all';
    document.getElementById('ami-filter').value = '81400';
    document.getElementById('ami-value').textContent = '$81K';
    g.selectAll('.county').style('opacity', 1);
    clearSelection();
}
