// --- 1. Initialize List.js
const options ={
	valueNames: [
		'anatomyTD',
		'procedureTD',
		'protTD',
		'indicationTD',
		'durationTD',
		'prepTD',
	],
	page: [2000]
};

const protocolList = new List('protocolDIV', options);

// --- Handle "No results found" message ---
protocolList.on('updated', function (list) {
    const noResultElem = document.querySelector('.no-result');
    if (noResultElem) {
        // Show message only if search is active and 0 items matched
        if (list.searched && list.matchingItems.length === 0) {
            noResultElem.style.display = 'block';
        } else {
            noResultElem.style.display = 'none';
        }
    }
});

// --- 2. Main logic wrapped in a modern async function ---
async function loadProtocols() {
    try {
        // Use the modern `fetch` to get the file.
        const response = await fetch('usprotocols.csv');

        // Check if the file was found and the request was successful.
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV. Status: ${response.status}`);
        }

        const rawCSVText = await response.text();
        
        // Parse the CSV, explicitly using a comma ',' as the delimiter.
        let csvData = CSVtoArray(rawCSVText);

        // Remove the first two rows (headers).
        csvData.splice(0, 2);

        // Add the parsed data to the list using the fast, bulk method.
        addProtocolsToList(csvData);

        // Remove the placeholder "Loading..." entry.
        protocolList.remove('anatomyTD', '');

    } catch (error) {
        // If anything fails (e.g., file not found), log the error.
        console.error("Error loading protocol list:", error);
        // You could also display a user-friendly error message on the page.
    }
}

// --- 3. Helper functions
// Convert the XML responseText (raw data of CSV file) into an array
const CSVtoArray = (data, delimiter = ';', omitFirstRow = false) =>
	data
		.slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
		.split('\n')
		.map(v => v.split(delimiter));

// Add CSV Data to the table
function addProtocolsToList(data) {
	// 2025-08-16 - Gemini Refactored to improve performance by reducing the number of calls to protocolList.add().
	// 1. First, transform the entire 2D array into an array of objects.
	//    The Array.map() method is ideal for this kind of data transformation.
	const itemsToAdd = data.map(row => {
		return {
			anatomyTD: 		row[0],
			procedureTD:  	row[1],
			protTD:         row[2],
			indicationTD:   row[3],
			durationTD:     row[4],
			prepTD:    	    row[5],
		};
	});

	// 2. Now, call .add() only ONCE with the complete array of new items.
    protocolList.add(itemsToAdd);
}

// --- 4. Run the main function ---
loadProtocols();