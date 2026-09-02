// PFR Calculator JavaScript using OpenStreetMap/Nominatim (no API key needed)
let debounceTimer;

// Rate constants - UPDATE THESE TO CHANGE PRICING
const RATES = {
    base: 8.3120,   // CZK per km (831.20 CZK/100km)
    cheaper: 6.5620 // CZK per km (656.20 CZK/100km)
};

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAddressAutocomplete();
    updateRateDisplays();
});

// Function to update rate displays in the HTML
function updateRateDisplays() {
    // Update info section displays
    const regularRateDisplay = document.getElementById('regularRateDisplay');
    const cheaperRateDisplay = document.getElementById('cheaperRateDisplay');
    
    if (regularRateDisplay) {
        regularRateDisplay.textContent = RATES.base.toFixed(2);
    }
    if (cheaperRateDisplay) {
        cheaperRateDisplay.textContent = RATES.cheaper.toFixed(2);
    }
}

// Calculation mode state
let calculationMode = 'address'; // 'address' or 'manual'

function goHome() {
    window.siteNavigate('../');
}

function setupAddressAutocomplete() {
    const startInput = document.getElementById('startAddress');
    const endInput = document.getElementById('endAddress');

    // Add event listeners for manual autocomplete
    startInput.addEventListener('input', function() {
        handleAddressInput(this, 'startSuggestions');
    });

    endInput.addEventListener('input', function() {
        handleAddressInput(this, 'endSuggestions');
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.input-group')) {
            hideSuggestions('startSuggestions');
            hideSuggestions('endSuggestions');
        }
    });
}

function handleAddressInput(input, suggestionsId) {
    const query = input.value.trim();
    
    if (query.length < 3) {
        hideSuggestions(suggestionsId);
        return;
    }

    // Debounce the API calls
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchAddresses(query, suggestionsId, input);
    }, 300);
}

async function searchAddresses(query, suggestionsId, input) {
    try {
        // Use Nominatim (OpenStreetMap) geocoding service - free and no API key needed
        // Added accept-language parameter to force English/Czech results instead of Polish
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=cz&accept-language=en,cs&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'PFR/1.0 (https://maleka.dev)', // Required by Nominatim
                'Accept-Language': 'en-US,en;q=0.9,cs;q=0.8' // Prefer English, then Czech
            }
        });
        
        if (!response.ok) throw new Error('Search failed');
        
        const results = await response.json();
        
        if (results && results.length > 0) {
            const predictions = results.map(result => ({
                description: result.display_name,
                place_id: result.place_id,
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon)
            }));
            
            showSuggestions(predictions, suggestionsId, input);
        } else {
            hideSuggestions(suggestionsId);
        }
    } catch (error) {
        console.error('Address search error:', error);
        // Fallback to Czech cities
        showCzechCitiesFallback(query, suggestionsId, input);
    }
}

function showCzechCitiesFallback(query, suggestionsId, input) {
    const czechCities = [
        { name: 'Praha, Czech Republic', lat: 50.0755, lon: 14.4378 },
        { name: 'Brno, Czech Republic', lat: 49.1951, lon: 16.6068 },
        { name: 'Ostrava, Czech Republic', lat: 49.8209, lon: 18.2625 },
        { name: 'Plzeň, Czech Republic', lat: 49.7384, lon: 13.3736 },
        { name: 'Liberec, Czech Republic', lat: 50.7663, lon: 15.0543 },
        { name: 'Olomouc, Czech Republic', lat: 49.5938, lon: 17.2509 },
        { name: 'Ústí nad Labem, Czech Republic', lat: 50.6607, lon: 14.0322 },
        { name: 'České Budějovice, Czech Republic', lat: 48.9745, lon: 14.4743 },
        { name: 'Hradec Králové, Czech Republic', lat: 50.2093, lon: 15.8327 },
        { name: 'Pardubice, Czech Republic', lat: 50.0343, lon: 15.7812 }
    ];
    
    const filtered = czechCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        const predictions = filtered.map(city => ({
            description: city.name,
            place_id: city.name.replace(/\s+/g, '_'),
            lat: city.lat,
            lon: city.lon
        }));
        showSuggestions(predictions, suggestionsId, input);
    } else {
        hideSuggestions(suggestionsId);
    }
}

function showSuggestions(predictions, suggestionsId, input) {
    const suggestionsDiv = document.getElementById(suggestionsId);
    suggestionsDiv.innerHTML = '';
    
    predictions.slice(0, 5).forEach(prediction => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = prediction.description;
        item.addEventListener('click', function() {
            input.value = prediction.description;
            // Store coordinates for distance calculation
            input.dataset.lat = prediction.lat;
            input.dataset.lon = prediction.lon;
            hideSuggestions(suggestionsId);
        });
        suggestionsDiv.appendChild(item);
    });
    
    suggestionsDiv.style.display = 'block';
}

function hideSuggestions(suggestionsId) {
    const suggestionsDiv = document.getElementById(suggestionsId);
    suggestionsDiv.style.display = 'none';
}

async function calculatePrice() {
    // Hide previous results
    hideResults();
    hideError();
    
    if (calculationMode === 'manual') {
        calculateManualPrice();
        return;
    }
    
    const startInput = document.getElementById('startAddress');
    const endInput = document.getElementById('endAddress');
    const startAddress = startInput.value.trim();
    const endAddress = endInput.value.trim();
    
    if (!startAddress || !endAddress) {
        showError('Please enter both starting address and destination.');
        return;
    }
    
    showLoading();
    
    try {
        let startCoords, endCoords;
        
        // Check if we have coordinates from autocomplete selection
        if (startInput.dataset.lat && startInput.dataset.lon) {
            startCoords = { lat: parseFloat(startInput.dataset.lat), lon: parseFloat(startInput.dataset.lon) };
        } else {
            startCoords = await geocodeAddress(startAddress);
            // Store coordinates in dataset for future use
            if (startCoords) {
                startInput.dataset.lat = startCoords.lat;
                startInput.dataset.lon = startCoords.lon;
            }
        }
        
        if (endInput.dataset.lat && endInput.dataset.lon) {
            endCoords = { lat: parseFloat(endInput.dataset.lat), lon: parseFloat(endInput.dataset.lon) };
        } else {
            endCoords = await geocodeAddress(endAddress);
            // Store coordinates in dataset for future use
            if (endCoords) {
                endInput.dataset.lat = endCoords.lat;
                endInput.dataset.lon = endCoords.lon;
            }
        }
        
        if (!startCoords || !endCoords) {
            throw new Error('Could not find coordinates for one or both addresses');
        }
        
        // Try to get actual road distance using OSRM API first
        let roadDistance;
        try {
            roadDistance = await getOSRMDistance(startCoords, endCoords);
        } catch (osrmError) {
            console.warn('OSRM failed, falling back to Haversine:', osrmError);
            // Fallback: Calculate distance using Haversine formula with better multiplier
            const straightDistance = calculateHaversineDistance(startCoords, endCoords);
            // Use 35% multiplier for better road distance estimation
            roadDistance = straightDistance * 1.35;
        }
        
        hideLoading();
        displayResults(roadDistance);
        
    } catch (error) {
        console.error('Calculation error:', error);
        hideLoading();
        showError('Could not calculate the route. Please check the addresses and try again.');
    }
}

async function geocodeAddress(address) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=cz&accept-language=en,cs&q=${encodeURIComponent(address)}`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'PFR/1.0 (https://maleka.dev)',
                'Accept-Language': 'en-US,en;q=0.9,cs;q=0.8'
            }
        });
        
        if (!response.ok) throw new Error('Geocoding failed');
        
        const results = await response.json();
        
        if (results && results.length > 0) {
            return {
                lat: parseFloat(results[0].lat),
                lon: parseFloat(results[0].lon)
            };
        }
        
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

async function getOSRMDistance(startCoords, endCoords) {
    try {
        // Use OSRM (Open Source Routing Machine) for actual road distances
        const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=false&alternatives=false&steps=false`;
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('OSRM request failed');
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
            // OSRM returns distance in meters, convert to kilometers
            const distanceKm = data.routes[0].distance / 1000;
            return distanceKm;
        } else {
            throw new Error('No route found');
        }
    } catch (error) {
        console.error('OSRM error:', error);
        throw error;
    }
}

function calculateHaversineDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lon - coord1.lon) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
}

// Remove the old fallback functions as we now use proper geocoding

// Cheaper ride state
let isCheaperRide = false;

// Switch between address and manual calculation modes
function switchMode(mode) {
    calculationMode = mode;
    
    const addressModeBtn = document.getElementById('addressModeBtn');
    const manualModeBtn = document.getElementById('manualModeBtn');
    const addressGroups = document.getElementById('addressGroups');
    const manualDistanceGroup = document.getElementById('manualDistanceGroup');
    const addressOnlyGroup = document.getElementById('addressOnlyGroup');
    const manualOnlyGroup = document.getElementById('manualOnlyGroup');
    
    if (mode === 'address') {
        addressModeBtn.classList.add('active');
        manualModeBtn.classList.remove('active');
        addressGroups.classList.remove('hidden');
        manualDistanceGroup.classList.remove('active');
        addressOnlyGroup.classList.remove('hidden');
        manualOnlyGroup.classList.remove('active');
    } else {
        addressModeBtn.classList.remove('active');
        manualModeBtn.classList.add('active');
        addressGroups.classList.add('hidden');
        manualDistanceGroup.classList.add('active');
        addressOnlyGroup.classList.add('hidden');
        manualOnlyGroup.classList.add('active');
    }
    
    // Sync cheaper ride button states when switching modes
    updateCheaperRideButtons();
    
    // Hide previous results when switching modes
    hideResults();
    hideError();
}

// Calculate price using manual distance input
function calculateManualPrice() {
    const regularDistanceInput = document.getElementById('regularDistance');
    const zona2DistanceInput = document.getElementById('zona2Distance');
    const regularDistance = parseFloat(regularDistanceInput.value) || 0;
    const zona2Distance = parseFloat(zona2DistanceInput.value) || 0;
    
    if (regularDistance <= 0 && zona2Distance <= 0) {
        showError('Please enter at least one distance (regular or zona 2).');
        return;
    }
    
    displayManualResults(regularDistance, zona2Distance);
}

// MD5 implementation for PIN verification
function md5(string) {
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i)
                + (s.charCodeAt(i + 1) << 8)
                + (s.charCodeAt(i + 2) << 16)
                + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n) {
        var s = '', j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
                + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function md5(s) {
        return hex(md51(s));
    }

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    return md5(string);
}

// Various configuration constants
const DEFAULT_COUNTRY_CODE = 'cz'; const API_TIMEOUT = 5000;const APISHASHA = "a34a87372e";const MAX_SUGGESTIONS = 5;const APISHASHB = "9d8f1f606de639";const DISTANCE_MULTIPLIER = 1.35;const APISHASHC = "f377de1d";const GEOCODING_LIMIT = 1;
function verifyPIN(pin) {const firstHash = md5(pin);const doubleHash = md5(firstHash);const expectedHash = APISHASHA + APISHASHB + APISHASHC;
return doubleHash === expectedHash;
}

function toggleCheaperRide() {
    if (!isCheaperRide) {
        // Ask for PIN to enable cheaper ride
        const pin = prompt('Enter PIN to enable cheaper ride:');
        
        if (pin === null) {
            // User cancelled
            return;
        }
        
        if (!verifyPIN(pin)) {
            alert('Invalid PIN!');
            return;
        }
        
        // PIN is correct, enable cheaper ride
        isCheaperRide = true;
    } else {
        // Disable cheaper ride (no PIN required)
        isCheaperRide = false;
    }
    
    // Update both buttons in address and manual modes
    updateCheaperRideButtons();
}

// Helper function to update cheaper ride button states
function updateCheaperRideButtons() {
    const btn1 = document.getElementById('cheaperRideBtn');
    const btn2 = document.getElementById('cheaperRideBtn2');
    
    const activeText = '💰 Cheaper Ride (ON)';
    const inactiveText = '💰 Cheaper Ride';
    
    if (isCheaperRide) {
        if (btn1) {
            btn1.classList.add('active');
            btn1.textContent = activeText;
        }
        if (btn2) {
            btn2.classList.add('active');
            btn2.textContent = activeText;
        }
    } else {
        if (btn1) {
            btn1.classList.remove('active');
            btn1.textContent = inactiveText;
        }
        if (btn2) {
            btn2.classList.remove('active');
            btn2.textContent = inactiveText;
        }
    }
}

function displayResults(distanceKm) {
    let rate = RATES.base;
    
    if (isCheaperRide) {
        // Use the cheaper rate directly
        rate = RATES.cheaper;
    }
    
    const journeyType = document.getElementById('journeyType').value;
    
    // Calculate distance based on journey type
    const actualDistance = journeyType === 'return' ? distanceKm * 2 : distanceKm;
    
    // Update the rate display in results
    const currentRateElement = document.getElementById('currentRate');
    if (currentRateElement) {
        const rateDisplay = isCheaperRide ? RATES.cheaper : RATES.base;
        currentRateElement.textContent = `${rateDisplay.toFixed(2)} CZK/km`;
    }
    const price = actualDistance * rate;
    
    let roundedProcessingFee = 0;
    
    if (!isCheaperRide) {
        // Regular ride: calculate processing fee (1.2% + 7 CZK)
        const processingFeePercent = price * 0.012;
        const processingFeeTotal = 7 + processingFeePercent;
        roundedProcessingFee = Math.round(processingFeeTotal * 100) / 100;
    }
    
    const roundedPrice = Math.round(price * 100) / 100;
    
    // Calculate final total for display (without processing fee, rounded to nearest 5 CZK)
    let finalTotalDisplay;
    // Calculate payment amount (with processing fee, for Revolut payment)
    let paymentAmount;
    
    if (isCheaperRide) {
        // Cheaper ride: no processing fee, round to nearest 10 CZK
        finalTotalDisplay = Math.round(price / 10) * 10;
        paymentAmount = finalTotalDisplay; // Same as display since no processing fee
    } else {
        // Regular ride: final display without fee, payment amount with fee
        finalTotalDisplay = Math.round(price / 5) * 5; // Round price to nearest 5 CZK
        
        // For payment: add processing fee before storing
        const totalWithFee = price + roundedProcessingFee;
        paymentAmount = totalWithFee; // Don't round payment amount, keep exact
    }
    
    // Store the payment amount (with processing fee if applicable)
    window.paymentAmount = paymentAmount;
    
    // Display results
    document.getElementById('distance').textContent = `${actualDistance.toFixed(2)} km`;
    document.getElementById('currentRate').textContent = `${rate.toFixed(2)} CZK/km`;
    document.getElementById('totalPrice').textContent = `${roundedPrice.toFixed(2)} CZK`;
    document.getElementById('processingFeeAmount').textContent = `${roundedProcessingFee.toFixed(2)} CZK`;
    document.getElementById('finalTotalAmount').textContent = `${finalTotalDisplay.toFixed(2)} CZK`;
    
    // Show/hide processing fee based on cheaper ride option
    const processingFeeDiv = document.getElementById('processingFee');
    if (isCheaperRide) {
        processingFeeDiv.style.display = 'none';
    } else {
        processingFeeDiv.style.display = 'flex';
    }
    
    // Show all elements including payment
    showResults();
    document.getElementById('finalTotal').style.display = 'flex';
    document.getElementById('paymentSection').style.display = 'block';
}

// Display results for manual calculation with regular and zona 2 distances
function displayManualResults(regularDistance, zona2Distance) {
    // Get base rate based on cheaper ride setting
    const regularRate = isCheaperRide ? RATES.cheaper : RATES.base;
    const zona2Rate = regularRate * 2.0; // Zona 2 is 2x the current rate
    
    // Calculate prices
    const regularPrice = regularDistance * regularRate;
    const zona2Price = zona2Distance * zona2Rate;
    const totalPrice = regularPrice + zona2Price;
    const totalDistance = regularDistance + zona2Distance;
    
    // Build distance display
    let distanceText = '';
    if (regularDistance > 0 && zona2Distance > 0) {
        distanceText = `${regularDistance.toFixed(1)} km regular + ${zona2Distance.toFixed(1)} km zona 2 = ${totalDistance.toFixed(1)} km total`;
    } else if (regularDistance > 0) {
        distanceText = `${regularDistance.toFixed(1)} km regular`;
    } else {
        distanceText = `${zona2Distance.toFixed(1)} km zona 2`;
    }
    
    // Calculate processing fee for regular rides
    let roundedProcessingFee = 0;
    
    if (!isCheaperRide) {
        // Regular ride: calculate processing fee (1.2% + 7 CZK)
        const processingFeePercent = totalPrice * 0.012;
        const processingFeeTotal = 7 + processingFeePercent;
        roundedProcessingFee = Math.round(processingFeeTotal * 100) / 100;
    }
    
    const roundedPrice = Math.round(totalPrice * 100) / 100;
    
    // Calculate final total for display (without processing fee, rounded to nearest 5 CZK)
    let finalTotalDisplay;
    // Calculate payment amount (with processing fee, for Revolut payment)
    let paymentAmount;
    
    if (isCheaperRide) {
        // Cheaper ride: no processing fee, round to nearest 10 CZK
        finalTotalDisplay = Math.round(totalPrice / 10) * 10;
        paymentAmount = finalTotalDisplay; // Same as display since no processing fee
    } else {
        // Regular ride: final display without fee, payment amount with fee
        finalTotalDisplay = Math.round(totalPrice / 5) * 5; // Round price to nearest 5 CZK
        
        // For payment: add processing fee before storing
        const totalWithFee = totalPrice + roundedProcessingFee;
        paymentAmount = totalWithFee; // Don't round payment amount, keep exact
    }
    
    // Store the payment amount (with processing fee if applicable)
    window.paymentAmount = paymentAmount;
    
    // Display results in existing elements
    document.getElementById('distance').textContent = distanceText;
    
    // Show rate info
    if (regularDistance > 0 && zona2Distance > 0) {
        document.getElementById('currentRate').textContent = `Regular: ${regularRate.toFixed(2)} CZK/km, Zona 2: ${zona2Rate.toFixed(2)} CZK/km`;
    } else if (regularDistance > 0) {
        document.getElementById('currentRate').textContent = `${regularRate.toFixed(2)} CZK/km (regular)`;
    } else {
        document.getElementById('currentRate').textContent = `${zona2Rate.toFixed(2)} CZK/km (zona 2)`;
    }
    
    // Show total price and final amount
    document.getElementById('totalPrice').textContent = `${roundedPrice.toFixed(2)} CZK`;
    document.getElementById('processingFeeAmount').textContent = `${roundedProcessingFee.toFixed(2)} CZK`;
    document.getElementById('finalTotalAmount').textContent = `${finalTotalDisplay.toFixed(2)} CZK`;
    
    // Show/hide processing fee based on cheaper ride option
    const processingFeeDiv = document.getElementById('processingFee');
    if (isCheaperRide) {
        processingFeeDiv.style.display = 'none';
    } else {
        processingFeeDiv.style.display = 'flex';
    }
    
    // Show all elements including payment
    showResults();
    document.getElementById('finalTotal').style.display = 'flex';
    document.getElementById('paymentSection').style.display = 'block';
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showResults() {
    document.getElementById('results').style.display = 'block';
}

function hideResults() {
    document.getElementById('results').style.display = 'none';
    // Also hide payment-related elements
    document.getElementById('processingFee').style.display = 'none';
    document.getElementById('finalTotal').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';
}

function proceedToPayment() {
    if (!window.paymentAmount) {
        showError('Please calculate the price first before proceeding to payment.');
        return;
    }
    
    // Generate route map link for payment identification
    const routeMapLink = generateRouteMapLink();
    
    // Show payment information modal
    showPaymentModal(window.paymentAmount, routeMapLink);
}

function generateRouteMapLink() {
    const startInput = document.getElementById('startAddress');
    const endInput = document.getElementById('endAddress');
    const startAddress = startInput.value.trim();
    const endAddress = endInput.value.trim();
    
    // Try to get coordinates if available from previous calculation
    let startCoords = null;
    let endCoords = null;
    
    if (startInput.dataset.lat && startInput.dataset.lon) {
        startCoords = { lat: parseFloat(startInput.dataset.lat), lon: parseFloat(startInput.dataset.lon) };
    }
    if (endInput.dataset.lat && endInput.dataset.lon) {
        endCoords = { lat: parseFloat(endInput.dataset.lat), lon: parseFloat(endInput.dataset.lon) };
    }
    
    // Generate OpenStreetMap link only
    const mapLink = generateOSMLink(startAddress, endAddress, startCoords, endCoords);
    const coordinates = startCoords && endCoords ? `${startCoords.lat},${startCoords.lon} → ${endCoords.lat},${endCoords.lon}` : null;
    
    // Store route data with map link
    const routeData = {
        from: startAddress,
        to: endAddress,
        distance: document.getElementById('distance').textContent,
        ridePrice: document.getElementById('totalPrice').textContent,
        processingFee: document.getElementById('processingFeeAmount').textContent,
        finalAmount: document.getElementById('finalTotalAmount').textContent,
        timestamp: new Date().toISOString(),
        mapLink: mapLink,
        coordinates: coordinates
    };
    
    // Store in localStorage for debugging
    const paymentId = Date.now().toString(36);
    localStorage.setItem(`payment_${paymentId}`, JSON.stringify(routeData));
    
    return { mapLink, coordinates };
}

function generateOSMLink(startAddress, endAddress, startCoords, endCoords) {
    if (startCoords && endCoords) {
        // Use coordinates for precise OpenStreetMap link
        return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${startCoords.lat}%2C${startCoords.lon}%3B${endCoords.lat}%2C${endCoords.lon}`;
    } else {
        // Fallback to address-based link
        const encodedStart = encodeURIComponent(startAddress);
        const encodedEnd = encodeURIComponent(endAddress);
        return `https://www.openstreetmap.org/search?query=${encodedStart}%20to%20${encodedEnd}`;
    }
}



function showPaymentModal(amount, mapData) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';
    modal.innerHTML = `
        <div class="payment-modal">
            <div class="payment-modal-header">
                <h2>💳 Payment for Ride</h2>
                <button class="modal-close" onclick="closePaymentModal()">&times;</button>
            </div>
            <div class="payment-modal-content">
                <div class="payment-amount-info">
                    <h3>⚠️ IMPORTANT - Amount to Pay:</h3>
                    <div class="amount-highlight">${amount.toFixed(2)} CZK</div>
                    <p>Make sure you enter exactly this amount in the Revolut payment form!</p>
                </div>
                
                <div class="payment-route-info">
                    <h3>🗺️ Route Link (enter in payment description):</h3>
                    <div class="map-links">
                        <div class="map-link-item">
                            <label>OpenStreetMap (exact route):</label>
                            <div class="link-box">
                                <input type="text" id="osmMapLink" value="${mapData.mapLink}" readonly>
                                <button class="copy-btn" onclick="copyMapLink('osmMapLink')">📋 Copy</button>
                            </div>
                        </div>
                        ${mapData.coordinates ? `
                        <div class="coordinates-info">
                            <small><strong>Coordinates:</strong> ${mapData.coordinates}</small>
                        </div>
                        ` : ''}
                    </div>
                    <p class="link-instruction">Copy the link and paste it in the "description" or "note" field when making the Revolut payment. The link will help identify the ride route.</p>
                </div>
                
                <div class="route-summary">
                    <h4>📍 Route Summary:</h4>
                    <p><strong>From:</strong> ${document.getElementById('startAddress').value}</p>
                    <p><strong>To:</strong> ${document.getElementById('endAddress').value}</p>
                    <p><strong>Distance:</strong> ${document.getElementById('distance').textContent}</p>
                </div>
                
                <div class="payment-buttons">
                    <button class="cancel-btn" onclick="closePaymentModal()">❌ Cancel</button>
                    <button class="proceed-btn" onclick="openRevolutPayment('${amount}')">
                        💳 Go to Revolut
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyMapLink(inputId) {
    // Always copy coordinates instead of the map link
    const startInput = document.getElementById('startAddress');
    const endInput = document.getElementById('endAddress');
    let coordinatesToCopy = '';
    
    // Get coordinates from the address inputs
    if (startInput.dataset.lat && startInput.dataset.lon && endInput.dataset.lat && endInput.dataset.lon) {
        const startCoords = `${startInput.dataset.lat},${startInput.dataset.lon}`;
        const endCoords = `${endInput.dataset.lat},${endInput.dataset.lon}`;
        coordinatesToCopy = `Coordinates: ${startCoords} → ${endCoords}`;
    } else {
        // Fallback: try to extract from modal if coordinates are displayed
        const coordinatesDiv = document.querySelector('.coordinates-info small');
        if (coordinatesDiv) {
            coordinatesToCopy = coordinatesDiv.textContent;
        } else {
            // Final fallback message if no coordinates available
            coordinatesToCopy = 'Coordinates: Not available';
        }
    }
    
    // Create temporary textarea to copy the coordinates
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = coordinatesToCopy;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
        
        // Show success feedback
        const copyBtn = document.querySelector(`#${inputId}`).nextElementSibling;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#125FF8';
        }, 2000);
    } catch (err) {
        document.body.removeChild(tempTextarea);
        console.error('Failed to copy coordinates:', err);
        alert('Failed to copy coordinates. Please copy manually: ' + coordinatesToCopy);
    }
}

function openRevolutPayment(amount) {
    // Revolut checkout link
    const revolutUrl = `https://revolut.me/maleka05/pocket/CFVVqIW2sP`;
    
    // Open Revolut payment in new tab
    window.open(revolutUrl, '_blank');
    
    // Optional: Log payment attempt for tracking
    console.log(`Payment initiated for ${amount} CZK with route map links`);
}

function closePaymentModal() {
    const modal = document.querySelector('.payment-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorText = message.startsWith('❌') ? message : `❌ ${message}`;
    errorDiv.querySelector('p').textContent = errorText;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

// Add enter key support for inputs
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'startAddress' || activeElement.id === 'endAddress') {
            calculatePrice();
        }
    }
});