// ==========================================
// 1. LIST.JS INITIALIZATION
// ==========================================

const options = {
	valueNames: [
		'anatomyTD',
		'procedureTD',
		'protTD',
		'indicationTD',
		'durationTD',
		'prepTD',
	],
	page: 2000
};

const protocolList = new List('protocolDIV', options);

// --- Dynamic Search Term Highlighting ---
protocolList.on('searchComplete', function (list) {
	// Find the search input box inside #protocolDIV
	const searchInput = document.querySelector('#protocolDIV .search');
	const query = searchInput ? searchInput.value.trim() : '';

	// 1. Remove existing highlights from previous queries
	document.querySelectorAll('table tbody mark.highlight').forEach(mark => {
		const parent = mark.parentNode;
		parent.replaceChild(document.createTextNode(mark.textContent), mark);
		parent.normalize(); // Merges split text nodes back together cleanly
	});

	// If the search bar is empty, exit early
	if (!query) return;

	// Escape special regex characters (like +, *, (, ), etc.)
	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(`(${escapedQuery})`, 'gi');

	// 2. Wrap matching text in visible rows with <mark class="highlight">
	list.matchingItems.forEach(item => {
		// Only target textual columns, skipping buttons or badge-styled columns
		const targetCells = item.elm.querySelectorAll('.anatomyTD, .procedureTD, .protTD, .indicationTD');

		targetCells.forEach(cell => {
			// Skip cells that contain full anchor links or complex children
			if (cell.children.length === 0) {
				const originalText = cell.textContent;
				if (regex.test(originalText)) {
					cell.innerHTML = originalText.replace(regex, '<mark class="highlight">$1</mark>');
				}
			}
		});
	});
});

// Toggle "No matching results" banner
protocolList.on('updated', function (list) {
	const noResultElem = document.querySelector('.no-result');
	if (noResultElem) {
		const hasNoMatches = list.searched && list.matchingItems.length === 0;
		noResultElem.style.display = hasNoMatches ? 'table-row-group' : 'none';
	}
});

// ==========================================
// 2. DATA PROCESSING HELPERS
// ==========================================

// Parse CSV text into a 2D array
const CSVtoArray = (data, delimiter = ';', omitFirstRow = false) =>
	data
		.slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
		.split('\n')
		.map(v => v.split(delimiter));

// Transform 2D array to object list and add to List.js in bulk
function addProtocolsToList(data) {
	const itemsToAdd = data.map(row => ({
		anatomyTD:    row[0],
		procedureTD:  row[1],
		protTD:       row[2],
		indicationTD: row[3],
		durationTD:   row[4],
		prepTD:       row[5],
	}));

	protocolList.add(itemsToAdd);
}

// Convert prep text into styled badges
function formatPrepBadge(rawText) {
	if (!rawText) return '';

	const cleanText = rawText.trim();
	const lower = cleanText.toLowerCase();

	// 1. Combo check (must evaluate before individual checks)
	if (lower.includes('fasted w/ water prep') || lower.includes('fasted with water prep')) {
		return `<span class="badge-prep badge-combo">${cleanText}</span>`;
	}

	// 2. Fasted Preferred check
	if (lower.includes('fasted preferred')) {
		return `<span class="badge-prep badge-fasted-pref">${cleanText}</span>`;
	}

	// 3. Fasted check
	if (lower.includes('fasted')) {
		return `<span class="badge-prep badge-fasted">${cleanText}</span>`;
	}

	// 4. Water Prep check
	if (lower.includes('water prep')) {
		return `<span class="badge-prep badge-water">${cleanText}</span>`;
	}

	// 5. No Prep check
	if (lower.includes('no prep')) {
		return `<span class="badge-prep badge-no-prep">${cleanText}</span>`;
	}

	return cleanText;
}

// Apply badges to the rendered table cells
function applyPrepBadgesToTable() {
	document.querySelectorAll('table tbody tr').forEach(row => {
		const prepCell = row.cells[5]; // Prep is column index 5
		if (prepCell && !prepCell.querySelector('.badge-prep')) {
			prepCell.innerHTML = formatPrepBadge(prepCell.textContent);
		}
	});
}

// ==========================================
// 3. MAIN LOADER & EXECUTION
// ==========================================

async function loadProtocols() {
	try {
		const response = await fetch('usprotocols.csv');
		if (!response.ok) {
			throw new Error(`Failed to fetch CSV. Status: ${response.status}`);
		}

		const rawCSVText = await response.text();
		const csvData = CSVtoArray(rawCSVText);

		// Remove the two header rows
		csvData.splice(0, 2);

		// Bulk-add items to List.js
		addProtocolsToList(csvData);

		// Remove placeholder "Loading..." row
		protocolList.remove('anatomyTD', '');

		// Format prep badges once elements are in the DOM
		applyPrepBadgesToTable();

	} catch (error) {
		console.error("Error loading protocol list:", error);
	}
}

// Run the loader
loadProtocols();