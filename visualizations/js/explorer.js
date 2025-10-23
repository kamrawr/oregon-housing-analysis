// Oregon Housing Analysis - Interactive Explorer
// Advanced data visualization and analysis tools

let housingData = [];
let amiData = [];
let mergedData = [];

// Color schemes
const regionColors = {
    'Metro': '#636efa',
    'Valley': '#ef553b',
    'Southern': '#00cc96',
    'Central': '#ab63fa',
    'Coast': '#ffa15a',
    'Eastern': '#19d3f3'
};

// Population estimates
const populationData = {
    'Multnomah': 820000, 'Washington': 650000, 'Clackamas': 430000,
    'Marion': 385000, 'Lane (IOU clip)': 300000, 'Linn': 130000,
    'Benton': 95000, 'Polk': 87000, 'Yamhill': 110000,
    'Jackson': 230000, 'Josephine': 89000, 'Douglas': 111000,
    'Klamath': 67000, 'Lake': 8000, 'Deschutes': 200000,
    'Crook': 25000, 'Jefferson': 25000, 'Lincoln': 50000,
    'Coos': 65000, 'Clatsop': 40000, 'Tillamook': 26000,
    'Curry': 23000, 'Umatilla': 77000, 'Morrow': 12000,
    'Wasco': 27000, 'Hood River': 24000, 'Union': 26000,
    'Baker': 16000, 'Malheur': 32000, 'Wallowa': 7000,
    'Grant': 7200, 'Harney': 7400, 'Gilliam': 1800, 'Sherman': 1900
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load data
async function loadData() {
    try {
        const [housingResp, amiResp] = await Promise.all([
            fetch('data/raw/multifamily_estimates.csv'),
            fetch('data/raw/ami_by_county.csv')
        ]);
        
        const housingText = await housingResp.text();
        const amiText = await amiResp.text();
        
        housingData = d3.csvParse(housingText);
        amiData = d3.csvParse(amiText);
        
        processData();
        initializeVisualizations();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Process and merge data
function processData() {
    const countyData = housingData.filter(d => !d.county.includes('region total'));
    
    mergedData = countyData.map(housing => {
        const countyName = housing.county.replace(' (IOU clip)', '');
        const amiMatch = amiData.find(ami => 
            ami.County.includes(countyName) || countyName.includes(ami.County.replace(' County', ''))
        );
        
        return {
            ...housing,
            county: housing.county,
            region: housing.region,
            units_est: +housing.units_est,
            buildings_est: +housing.buildings_est,
            residents_est: +housing.residents_est,
            low_income_households_est: +housing.low_income_households_est,
            low_income_share: housing.low_income_share_est,
            ami_100: amiMatch ? +amiMatch.AMI_100_4Person : null,
            ami_60: amiMatch ? +amiMatch['60%'] : null,
            ami_80: amiMatch ? +amiMatch['80%'] : null,
            population: populationData[housing.county] || 0,
            units_per_1000: populationData[housing.county] 
                ? (housing.units_est / populationData[housing.county] * 1000).toFixed(2)
                : 0
        };
    });
}

// Initialize all visualizations
function initializeVisualizations() {
    renderRegionalChart();
    populateCountySelectors();
    renderDataTable();
}

// Update analysis based on selection
function updateAnalysis() {
    const type = document.getElementById('analysis-type').value;
    
    switch(type) {
        case 'units':
            document.getElementById('chart-title').textContent = 'Housing Units by Region';
            renderRegionalChart();
            break;
        case 'income':
            document.getElementById('chart-title').textContent = 'Area Median Income by County';
            renderIncomeChart();
            break;
        case 'low-income':
            document.getElementById('chart-title').textContent = 'Low-Income Household Concentration';
            renderLowIncomeChart();
            break;
        case 'per-capita':
            document.getElementById('chart-title').textContent = 'Housing Units per 1,000 Residents';
            renderPerCapitaChart();
            break;
    }
}

// Regional housing units bar chart
function renderRegionalChart() {
    const container = d3.select('#viz-container');
    container.html('');
    
    const regionTotals = d3.rollup(
        mergedData,
        v => d3.sum(v, d => d.units_est),
        d => d.region
    );
    
    const data = Array.from(regionTotals, ([region, units]) => ({region, units}))
        .sort((a, b) => b.units - a.units);
    
    const margin = {top: 20, right: 30, bottom: 60, left: 80};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([0, width])
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.units)])
        .nice()
        .range([height, 0]);
    
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.region))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.units))
        .attr('height', d => height - y(d.units))
        .attr('fill', d => regionColors[d.region])
        .on('mouseover', function(event, d) {
            showTooltip(event, `<strong>${d.region}</strong><br>Units: ${d.units.toLocaleString()}`);
        })
        .on('mouseout', hideTooltip);
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append('g')
        .call(d3.axisLeft(y).tickFormat(d => d.toLocaleString()));
    
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .style('text-anchor', 'middle')
        .text('Region');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text('Estimated Units');
}

// Income comparison chart
function renderIncomeChart() {
    const container = d3.select('#viz-container');
    container.html('');
    
    const data = mergedData
        .filter(d => d.ami_100)
        .sort((a, b) => b.ami_100 - a.ami_100)
        .slice(0, 15);
    
    const margin = {top: 20, right: 30, bottom: 60, left: 120};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.ami_100)])
        .range([0, width]);
    
    const y = d3.scaleBand()
        .domain(data.map(d => d.county))
        .range([0, height])
        .padding(0.2);
    
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', d => y(d.county))
        .attr('width', d => x(d.ami_100))
        .attr('height', y.bandwidth())
        .attr('fill', d => regionColors[d.region]);
    
    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', '11px');
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => `$${(d/1000).toFixed(0)}K`));
}

// Low-income concentration chart
function renderLowIncomeChart() {
    const container = d3.select('#viz-container');
    container.html('');
    
    const data = mergedData
        .sort((a, b) => b.low_income_households_est - a.low_income_households_est)
        .slice(0, 12);
    
    const margin = {top: 20, right: 30, bottom: 60, left: 120};
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.low_income_households_est)])
        .range([0, width]);
    
    const y = d3.scaleBand()
        .domain(data.map(d => d.county))
        .range([0, height])
        .padding(0.2);
    
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', d => y(d.county))
        .attr('width', d => x(d.low_income_households_est))
        .attr('height', y.bandwidth())
        .attr('fill', d => regionColors[d.region]);
    
    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', '11px');
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => d.toLocaleString()));
}

// Per capita chart
function renderPerCapitaChart() {
    const container = d3.select('#viz-container');
    container.html('');
    
    const data = mergedData
        .filter(d => d.units_per_1000 > 0)
        .sort((a, b) => b.units_per_1000 - a.units_per_1000)
        .slice(0, 15);
    
    const margin = {top: 20, right: 30, bottom: 60, left: 120};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.units_per_1000)])
        .range([0, width]);
    
    const y = d3.scaleBand()
        .domain(data.map(d => d.county))
        .range([0, height])
        .padding(0.2);
    
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', d => y(d.county))
        .attr('width', d => x(d.units_per_1000))
        .attr('height', y.bandwidth())
        .attr('fill', d => regionColors[d.region]);
    
    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', '11px');
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
}

// Populate county comparison selectors
function populateCountySelectors() {
    const counties = mergedData.map(d => d.county).sort();
    
    ['county1', 'county2', 'county3'].forEach(id => {
        const select = document.getElementById(id);
        counties.forEach(county => {
            const option = document.createElement('option');
            option.value = county;
            option.textContent = county;
            select.appendChild(option);
        });
    });
    
    document.getElementById('county1').value = 'Multnomah';
    document.getElementById('county2').value = 'Deschutes';
    document.getElementById('county3').value = 'Jackson';
}

// Compare counties
function compareCounties() {
    const county1 = document.getElementById('county1').value;
    const county2 = document.getElementById('county2').value;
    const county3 = document.getElementById('county3').value;
    
    const data1 = mergedData.find(d => d.county === county1);
    const data2 = mergedData.find(d => d.county === county2);
    const data3 = mergedData.find(d => d.county === county3);
    
    const results = document.getElementById('comparison-results');
    results.innerHTML = `
        <table style="width: 100%; margin-top: 2rem;">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>${county1}</th>
                    <th>${county2}</th>
                    <th>${county3}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Region</strong></td>
                    <td><span class="region-badge region-${data1.region.toLowerCase()}">${data1.region}</span></td>
                    <td><span class="region-badge region-${data2.region.toLowerCase()}">${data2.region}</span></td>
                    <td><span class="region-badge region-${data3.region.toLowerCase()}">${data3.region}</span></td>
                </tr>
                <tr>
                    <td><strong>AMI (100%)</strong></td>
                    <td>${data1.ami_100 ? '$' + data1.ami_100.toLocaleString() : 'N/A'}</td>
                    <td>${data2.ami_100 ? '$' + data2.ami_100.toLocaleString() : 'N/A'}</td>
                    <td>${data3.ami_100 ? '$' + data3.ami_100.toLocaleString() : 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Housing Units</strong></td>
                    <td>${data1.units_est.toLocaleString()}</td>
                    <td>${data2.units_est.toLocaleString()}</td>
                    <td>${data3.units_est.toLocaleString()}</td>
                </tr>
                <tr>
                    <td><strong>Low-Income HH</strong></td>
                    <td>${data1.low_income_households_est.toLocaleString()}</td>
                    <td>${data2.low_income_households_est.toLocaleString()}</td>
                    <td>${data3.low_income_households_est.toLocaleString()}</td>
                </tr>
                <tr>
                    <td><strong>Low-Income Share</strong></td>
                    <td>${data1.low_income_share}</td>
                    <td>${data2.low_income_share}</td>
                    <td>${data3.low_income_share}</td>
                </tr>
                <tr>
                    <td><strong>Units per 1K</strong></td>
                    <td>${data1.units_per_1000}</td>
                    <td>${data2.units_per_1000}</td>
                    <td>${data3.units_per_1000}</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Render data table
function renderDataTable() {
    const container = d3.select('#data-table');
    const data = mergedData.sort((a, b) => b.units_est - a.units_est);
    
    const table = container.append('table')
        .style('width', '100%')
        .style('font-size', '0.9rem');
    
    const thead = table.append('thead');
    const tbody = table.append('tbody');
    
    thead.append('tr')
        .selectAll('th')
        .data(['County', 'Region', 'Units', 'AMI', 'Low-Income HH', 'Units/1K'])
        .enter().append('th')
        .text(d => d);
    
    const rows = tbody.selectAll('tr')
        .data(data)
        .enter().append('tr');
    
    rows.append('td').text(d => d.county);
    rows.append('td').html(d => `<span class="region-badge region-${d.region.toLowerCase()}">${d.region}</span>`);
    rows.append('td').text(d => d.units_est.toLocaleString());
    rows.append('td').text(d => d.ami_100 ? `$${d.ami_100.toLocaleString()}` : 'N/A');
    rows.append('td').text(d => d.low_income_households_est.toLocaleString());
    rows.append('td').text(d => d.units_per_1000);
}

// Tooltip helpers
function showTooltip(event, html) {
    const tooltip = d3.select('#tooltip');
    tooltip.html(html)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .style('opacity', 1);
}

function hideTooltip() {
    d3.select('#tooltip').style('opacity', 0);
}
