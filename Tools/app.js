{/* <script> */}


let currentTool = 'rangeFinder';
let itemCounter = 0;

function selectTool(tool, button) {
    currentTool = tool;
    document.querySelector('.container').style.display = 'block';
    document.getElementById('container').classList.add('hidden');
    const buttons = document.querySelectorAll('.tool-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelector('.button-container').style.display = 'block';
    


    document.getElementById('rangeFinder').style.display = tool === 'rangeFinder' ? 'block' : 'none';
    document.getElementById('otherTools').style.display = tool !== 'rangeFinder' ? 'block' : 'none';
    
    document.getElementById('toolTitle').style.display = 'block';
    document.getElementById('toolDescription').style.display = 'block';

    document.getElementById('toolTitle').innerText = tool;

    const titles = {
        rangeFinder: "Telephone Number Range Finder",
        numberCleaner: "Telephone Number Cleaner",
        addOne: "Add 1 to Telephone Numbers",
        removeOne: "Remove 1 from Telephone Numbers",
        commaSeparated: "Comma Separated Numbers (10-digits)",
    };
    const descriptions = {
        rangeFinder: "Find and extend ranges of telephone numbers.",
        numberCleaner: "Remove all special characters from telephone numbers.",
        addOne: "Add a '1' prefix to telephone numbers and remove special characters.",
        removeOne: "Remove the '1' prefix from telephone numbers and remove special characters.",
        commaSeparated: "Add commas to the end of each number.",
    };
    document.getElementById('toolTitle').textContent = titles[tool];
    document.getElementById('toolDescription').textContent = descriptions[tool];

    if (tool === 'rangeFinder') {
        document.getElementById('rangeFinder').style.display = 'block';
        document.getElementById('otherTools').style.display = 'none';
        initializeRangeFinder();
    } else {
        document.getElementById('rangeFinder').style.display = 'none';
        document.getElementById('otherTools').style.display = 'block';
    }

    resetTool();
}


// function showContent() {
//     // Hide all tool blocks
//     document.getElementById('rangeFinder').style.display = 'none';
//     document.getElementById('otherTools').style.display = 'none';
//     // document.getElementById('newResults').style.display = 'none';

//     // document.querySelector('.button-container').style.display = 'none';
    
  
//     // Hide the title/description if needed
//     document.getElementById('toolTitle').style.display = 'none';
//     document.getElementById('toolDescription').style.display = 'none';
  
//     // Show only the TN Validation block
//     document.getElementById('container').classList.remove('hidden');
//     document.getElementById('output').style.display = 'none';
    


//     const buttons = document.querySelectorAll('.tool-button');
//     buttons.forEach(btn => btn.classList.remove('active'));
//     document.querySelector('.tool-button.table').classList.add('active');  
//     document.querySelector('.button-container').style.display = 'none';
//     document.getElementById('results').style.display = 'none';
//   }
  

function initializeRangeFinder() {
    const findRangeToggle = document.getElementById('findRangeToggle');
    const extendRangeToggle = document.getElementById('extendRangeToggle');
    const findRangeContent = document.getElementById('findRangeContent');
    const extendRangeContent = document.getElementById('extendRangeContent');

    function toggleScenario() {
        findRangeContent.style.display = findRangeToggle.checked ? 'block' : 'none';
        extendRangeContent.style.display = extendRangeToggle.checked ? 'block' : 'none';
    }

    findRangeToggle.addEventListener('change', toggleScenario);
    extendRangeToggle.addEventListener('change', toggleScenario);

    toggleScenario();
}

function processRangeFinder() {
    let numbers = [];
    let inRange = [];
    let notInRange = [];
    let duplicates = [];
    let allNumbers = [];

    const findRangeToggle = document.getElementById('findRangeToggle');
    const extendRangeToggle = document.getElementById('extendRangeToggle');

    if (findRangeToggle.checked) {
        const multipleNumbers = document.getElementById('multipleNumbers').value;
        numbers = multipleNumbers.split(/[\n\s]+/).map(n => formatPhoneNumber(n)).filter(n => n);

        const numberCounts = numbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});
        duplicates = Object.keys(numberCounts).filter(num => numberCounts[num] > 1);

        numbers = [...new Set(numbers)];
        numbers.sort();

        let range = [];
        for (let i = 0; i < numbers.length; i++) {
            const currentNumber = numbers[i];
            const nextNumber = numbers[i + 1];

            range.push(currentNumber);

            if (nextNumber) {
                const currentNumberInt = parseInt(currentNumber.replace(/\D/g, ''));
                const nextNumberInt = parseInt(nextNumber.replace(/\D/g, ''));

                if (nextNumberInt !== currentNumberInt + 1) {
                    if (range.length > 1) {
                        inRange.push(...range);
                    } else {
                        notInRange.push(range[0]);
                    }
                    range = [];
                }
            }
        }

        if (range.length > 1) {
            inRange.push(...range);
        } else if (range.length === 1) {
            notInRange.push(range[0]);
        }

        allNumbers = [...inRange, ...notInRange];
    }

    if (extendRangeToggle.checked) {
        const items = document.querySelectorAll('.item-container');
        items.forEach(item => {
            const telephoneInput = item.querySelector('.telephone-input');
            const rangeInput = item.querySelector('.range-input');
            const baseNumber = telephoneInput.value.replace(/\D/g, '');
            const rangeEnd = parseInt(rangeInput.value);

            if (baseNumber && rangeEnd) {
                const start = parseInt(baseNumber);
                const end = parseInt(baseNumber.slice(0, -4) + rangeEnd.toString().padStart(4, '0'));
                const generatedRange = generateRange(start, end);
                inRange = inRange.concat(generatedRange);
                allNumbers = allNumbers.concat(generatedRange);
            }
        });
    }

    inRange = [...new Set(inRange)];
    duplicates = [...new Set(duplicates)];

    displayRangeFinderResults(inRange, notInRange, duplicates);
}
//added a code here
function addItem() {
itemCounter++;
const itemContainer = document.createElement('div');
itemContainer.className = 'item-container';
itemContainer.innerHTML = `
<div class="flex-container">
    <button class="remove-btn" onclick="this.parentElement.parentElement.remove()">Remove</button>
</div>
<div class="flex-container">
    <div>
        <label>Telephone Numbers</label>
        <input type="text" class="telephone-input" placeholder="Enter 10-digit number">
    </div>
    <div>
        <label>Range</label>
        <input type="number" class="range-input" placeholder="Enter range">
    </div>
</div>
`;
document.getElementById('itemsContainer').appendChild(itemContainer);
}

function formatPhoneNumber(number) {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return match[1] + '-' + match[2] + '-' + match[3];
    }
    return null;
}

function generateRange(start, end) {
    let range = [];
    for (let i = start; i <= end; i++) {
        range.push(formatPhoneNumber(i));
    }
    return range;
}

function processNumbers() {
if (currentTool === 'rangeFinder') {
processRangeFinder();
} else {
processOtherTools();
}
}

function processRangeFinder() {
    let numbers = [];
    let inRange = [];
    let notInRange = [];
    let duplicates = [];
    let allNumbers = [];

    const multipleNumbers = document.getElementById('multipleNumbers').value;
    if (multipleNumbers) {
        numbers = multipleNumbers.split(/[\n\s]+/).map(n => formatPhoneNumber(n)).filter(n => n);
        const numberCounts = numbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});
        duplicates = Object.keys(numberCounts).filter(num => numberCounts[num] > 1);
        numbers = [...new Set(numbers)].sort();

        let range = [];
        for (let i = 0; i < numbers.length; i++) {
            const currentNumber = numbers[i];
            const nextNumber = numbers[i + 1];
            range.push(currentNumber);

            if (nextNumber) {
                const currentNumberInt = parseInt(currentNumber.replace(/\D/g, ''));
                const nextNumberInt = parseInt(nextNumber.replace(/\D/g, ''));
                if (nextNumberInt !== currentNumberInt + 1) {
                    if (range.length > 1) {
                        inRange.push(...range);
                    } else {
                        notInRange.push(range[0]);
                    }
                    range = [];
                }
            }
        }
        if (range.length > 1) {
            inRange.push(...range);
        } else if (range.length === 1) {
            notInRange.push(range[0]);
        }
        allNumbers = [...inRange, ...notInRange];
    }

    const items = document.querySelectorAll('.item-container');
    items.forEach(item => {
        const telephoneInput = item.querySelector('.telephone-input');
        const rangeInput = item.querySelector('.range-input');
        const baseNumber = telephoneInput.value.replace(/\D/g, '');
        const rangeEnd = parseInt(rangeInput.value);

        if (baseNumber && rangeEnd) {
            const start = parseInt(baseNumber);
            const end = parseInt(baseNumber.slice(0, -4) + rangeEnd.toString().padStart(4, '0'));
            const generatedRange = generateRange(start, end);
            inRange = inRange.concat(generatedRange);
            allNumbers = allNumbers.concat(generatedRange);
        }
    });

    inRange = [...new Set(inRange)];
    duplicates = [...new Set(duplicates)];

    displayRangeFinderResults(inRange, notInRange, duplicates);
}

function displayRangeFinderResults(inRange, notInRange, duplicates) {
    const tbody = document.createElement('tbody');
    let currentRange = [];

    function addRangeToTable(range, total) {
        for (let i = 0; i < range.length; i++) {
            const row = tbody.insertRow();
            row.insertCell().textContent = range[i];
            row.insertCell().textContent = i === 0 ? total : '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
        }
        const emptyRow = tbody.insertRow();
        emptyRow.insertCell().textContent = '--- End of Range ---';
        emptyRow.cells[0].colSpan = 6;
        emptyRow.style.backgroundColor = '#f0f0f0';
    }

    for (let i = 0; i < inRange.length; i++) {
        const current = parseInt(inRange[i].replace(/\D/g, ''));
        const next = i < inRange.length - 1 ? parseInt(inRange[i + 1].replace(/\D/g, '')) : null;
        currentRange.push(inRange[i]);
        if (next === null || next !== current + 1) {
            addRangeToTable(currentRange, currentRange.length);
            currentRange = [];
        }
    }

    if (notInRange.length > 0) {
        for (let i = 0; i < notInRange.length; i++) {
            const row = tbody.insertRow();
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = notInRange[i];
            row.insertCell().textContent = i === 0 ? notInRange.length : '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
        }
    }

    if (duplicates.length > 0) {
        for (let i = 0; i < duplicates.length; i++) {
            const row = tbody.insertRow();
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = '';
            row.insertCell().textContent = duplicates[i];
            row.insertCell().textContent = i === 0 ? duplicates.length : '';
        }
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Number in Range</th>
            <th>Total</th>
            <th>Not in Range</th>
            <th>Total</th>
            <th>Duplicates</th>
            <th>Total</th>
        </tr>
    `;
    table.appendChild(thead);
    table.appendChild(tbody);

    const results = document.getElementById('results');
    results.innerHTML = '<h2>Results:</h2>';
    results.appendChild(table);
}

function processOtherTools() {
const input = document.getElementById('input').value;
const inputLines = input.split('\n');
let results = [];

inputLines.forEach(line => {
let cleanedNumber = line.replace(/\D/g, '');

switch (currentTool) {
    case 'numberCleaner':
        if (cleanedNumber.length === 10) {
            results.push(cleanedNumber);
        }
        break;
    case 'addOne':
        if (cleanedNumber.length === 10) {
            results.push('1' + cleanedNumber);
        }
        break;
    case 'removeOne':
        if (cleanedNumber.length === 11 && cleanedNumber.startsWith('1')) {
            results.push(cleanedNumber.slice(1));
        }
        break;
    case 'commaSeparated':
        if (cleanedNumber.length === 10 || cleanedNumber.length === 11) {
            results.push(cleanedNumber + ',');
        }
        break;
}
});

// Create a new div for results
const newResultsDiv = document.createElement('div');
newResultsDiv.id = 'newResults';
newResultsDiv.style.cssText = 'margin-top: 20px; padding: 10px; border: 1px solid #ccc; background-color: #515257;';     // newresults container backgroundColor//

// Format results as a vertical list
const formattedResults = results.join('\n');
newResultsDiv.innerHTML = `<h3>Results:</h3><pre style="white-space: pre-wrap; word-break: break-all;">${formattedResults}</pre>`;

// Find the container and append the new results div
const container = document.querySelector('.container') || document.body;
const existingResults = document.getElementById('newResults');
if (existingResults) {
container.removeChild(existingResults);
}
container.appendChild(newResultsDiv);

console.log("New results div added to DOM");
}

// function exportResults() {
//     let content;
//     if (currentTool === 'rangeFinder') {
//         content = document.getElementById('results').innerText;
//     } else {
//         content = document.getElementById('results').querySelector('pre').innerText;
//     }
//     const blob = new Blob([content], { type: 'text/plain' });
//     const a = document.createElement('a');
//     a.href = URL.createObjectURL(blob);
//     a.download = 'telephone_number_results.txt';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
// }


// function exportResults() {
    
//     let content;
//     if (currentTool === 'rangeFinder') {
//         content = document.getElementById('results').innerText;
//     } else {
//         const preTag = document.getElementById('results').querySelector('pre');
//         content = preTag ? preTag.innerText : '';
//     }

//     // Convert plain text lines to CSV format
//     const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
//     const csvContent = lines.map(line => `"${line.replace(/"/g, '""')}"`).join("\n");


//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const a = document.createElement('a');
//     a.href = URL.createObjectURL(blob);
//     a.download = 'telephone_number_results.csv';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
// }



function exportResults() {
    const resultsDiv = document.getElementById('results');
    let csvContent = '';

    // If there's a table (for rangeFinder), convert it to CSV
    const table = resultsDiv.querySelector('table');
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowData = Array.from(cells).map(cell => `"${cell.innerText.trim()}"`);
            csvContent += rowData.join(',') + '\n';
        });
    } else {
        // For tools that just show text (e.g., in a <pre> tag or plain text)
        const pre = resultsDiv.querySelector('pre');
        let textOutput = pre ? pre.innerText : resultsDiv.innerText;
        // Split by line, and treat each line as a row in CSV
        const lines = textOutput.split('\n').filter(line => line.trim() !== '');
        lines.forEach(line => {
            csvContent += `"${line.trim()}"\n`;
        });
    }

    // Create and trigger file download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



function copyResults() {
let content;
if (currentTool === 'rangeFinder') {
content = document.getElementById('results').innerText;
} else {
const newResultsDiv = document.getElementById('newResults');
content = newResultsDiv ? newResultsDiv.querySelector('pre').innerText : '';
}

if (!content) {
showCopyFeedback('No content to copy');
return;
}

// Try to use the Clipboard API first
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(content)
    .then(() => {
        showCopyFeedback('Results Copied');
    })
    .catch(err => {
        console.error('Failed to copy: ', err);
        fallbackCopyTextToClipboard(content);
    });
} else {
fallbackCopyTextToClipboard(content);
}
}

function fallbackCopyTextToClipboard(text) {
const textArea = document.createElement("textarea");
textArea.value = text;

textArea.style.position = "fixed";
textArea.style.left = "-999999px";
textArea.style.top = "-999999px";
document.body.appendChild(textArea);
textArea.focus();
textArea.select();

try {
const successful = document.execCommand('copy');
if (successful) {
    showCopyFeedback('Results Copied');
} else {
    showCopyFeedback('Copy failed');
}
} catch (err) {
console.error('Fallback: Oops, unable to copy', err);
showCopyFeedback('Copy failed');
}

document.body.removeChild(textArea);
}

function resetTool() {
document.getElementById('multipleNumbers').value = '';
document.getElementById('input').value = '';
document.getElementById('itemsContainer').innerHTML = '';
document.getElementById('results').innerHTML = '';

const newResultsDiv = document.getElementById('newResults');
if (newResultsDiv) {
newResultsDiv.remove();
}

// Reset toggles for Range Finder
document.getElementById('findRangeToggle').checked = true;
document.getElementById('extendRangeToggle').checked = false;

// Reset visibility of Range Finder content
document.getElementById('findRangeContent').style.display = 'block';
document.getElementById('extendRangeContent').style.display = 'none';

// Remove any existing copy feedback
const existingFeedback = document.querySelector('.copy-feedback');
if (existingFeedback) {
existingFeedback.remove();
}
}

function showCopyFeedback(message = 'Results Copied') {
const feedbackSpan = document.createElement('span');
feedbackSpan.textContent = message;
feedbackSpan.style.marginLeft = '10px';
feedbackSpan.style.color = message === 'Results Copied' ? 'green' : 'red';
feedbackSpan.style.position = 'fixed';
feedbackSpan.style.top = '10px';
feedbackSpan.style.right = '10px';
feedbackSpan.style.backgroundColor = 'white';
feedbackSpan.style.padding = '5px 10px';
feedbackSpan.style.borderRadius = '5px';
feedbackSpan.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
feedbackSpan.style.zIndex = '9999';

// Remove any existing feedback
const existingFeedback = document.querySelector('.copy-feedback');
if (existingFeedback) {
existingFeedback.remove();
}

feedbackSpan.classList.add('copy-feedback');
document.body.appendChild(feedbackSpan);

// Remove the feedback after 3 seconds
setTimeout(() => {
feedbackSpan.remove();
}, 3000);
}
// Initialize with Range Finder as active
selectTool('rangeFinder', document.querySelector('.tool-button'));

// Add event listener for the Add Item button
document.getElementById('addItemBtn').addEventListener('click', addItem);

// </script>





















// TN Validation Tool


function showContent() {
    // Hide all tool blocks
    document.querySelector('.container').style.display = 'none';
    document.getElementById('rangeFinder').style.display = 'none';
    document.getElementById('otherTools').style.display = 'none';
    const newResults = document.getElementById('newResults');
    if (newResults) {
      newResults.style.display = 'none';
    }
    

    // document.querySelector('.button-container').style.display = 'none';
    
  
    // Hide the title/description if needed
    document.getElementById('toolTitle').style.display = 'none';
    document.getElementById('toolDescription').style.display = 'none';
  
    // Show only the TN Validation block
    
    document.getElementById('container').classList.remove('hidden');
    document.getElementById('output').style.display = 'none';
    
    


    const buttons = document.querySelectorAll('.tool-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tool-button.table').classList.add('active');  
    document.querySelector('.button-container').style.display = 'none';
    document.getElementById('results').style.display = 'none';
  }



function cleanPhoneNumbers(input) {
    return input.split('\n').map(num => num.replace(/\D/g, '')).filter(num => num.length === 10);
}

function findDuplicatesWithSource(numbers, source) {
    const counts = {};
    const duplicates = [];
    numbers.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
        if (counts[num] === 2) duplicates.push(`${num} (${source})`);
    });
    return duplicates;
}

function removeDuplicates(numbers) {
    return [...new Set(numbers)];
}

function updateTNCount(inputId, countId) {
    const input = document.getElementById(inputId);
    const countElement = document.getElementById(countId);
    const count = cleanPhoneNumbers(input.value).length;
    countElement.textContent = `TN Count: ${count}`;
}

function compareNumbers() {
    const salesforceTNs = cleanPhoneNumbers(document.getElementById('salesforceTNs').value);
    const loaTNs = cleanPhoneNumbers(document.getElementById('loaTNs').value);

    const salesforceDuplicates = findDuplicatesWithSource(salesforceTNs, 'Salesforce');
    const loaDuplicates = findDuplicatesWithSource(loaTNs, 'LOA');
    const uniqueSalesforceTNs = removeDuplicates(salesforceTNs);
    const uniqueLoaTNs = removeDuplicates(loaTNs);

    const matching = uniqueSalesforceTNs.filter(num => uniqueLoaTNs.includes(num));
    const salesforceMismatched = uniqueSalesforceTNs.filter(num => !uniqueLoaTNs.includes(num));
    const loaMismatched = uniqueLoaTNs.filter(num => !uniqueSalesforceTNs.includes(num));

    document.getElementById('duplicatesTNs').textContent =
        [...salesforceDuplicates, ...loaDuplicates].join('\n');
    document.getElementById('matchingTNs').textContent = matching.join('\n');
    document.getElementById('mismatchedTNs').textContent =
        `Missing in LOA:\n${salesforceMismatched.join('\n')}\n\nMissing in Salesforce:\n${loaMismatched.join('\n')}`;
    document.getElementById('remarks').textContent =
        matching.length > 0 && (salesforceMismatched.length === 0 && loaMismatched.length === 0) ? 'Matching' : 'Mismatch';

    document.getElementById('output').style.display = 'block';
}

function resetForm() {
    document.getElementById('salesforceTNs').value = '';
    document.getElementById('loaTNs').value = '';
    document.getElementById('output').style.display = 'none';
    updateTNCount('salesforceTNs', 'salesforceTNCount');
    updateTNCount('loaTNs', 'loaTNCount');
}

function showCopyFeedback(message) {
    const feedback = document.getElementById('copyFeedback');
    feedback.textContent = message;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 2000);
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback('Results Copied');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

function copyOutput() {
    const table = document.getElementById('resultTable');
    let copyText = 'Results:\n\n';
    const headers = table.querySelectorAll('th');
    const data = table.querySelectorAll('td');
    
    for (let i = 0; i < headers.length; i++) {
        copyText += `${headers[i].textContent}:\n${data[i].textContent}\n\n`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText.trim())
            .then(() => {
                showCopyFeedback('Results Copied');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopyTextToClipboard(copyText.trim());
            });
    } else {
        fallbackCopyTextToClipboard(copyText.trim());
    }

}





document.getElementById('salesforceTNs').addEventListener('input', () => updateTNCount('salesforceTNs', 'salesforceTNCount'));
document.getElementById('loaTNs').addEventListener('input', () => updateTNCount('loaTNs', 'loaTNCount'));
document.getElementById('submitBttn').addEventListener('click', compareNumbers);
document.getElementById('resetBtn').addEventListener('click', resetForm);
document.getElementById('copyBtn').addEventListener('click', copyOutput);



