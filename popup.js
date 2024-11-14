document.addEventListener('DOMContentLoaded', async function() {
	const taskInput = document.getElementById('taskInput');
	const submitButton = document.getElementById('submitButton');
	const result = document.getElementById('result');
	const clearButton = document.getElementById('clearHistory');
	const settingsButton = document.getElementById('settingsButton');
	const titleElement = document.getElementById('title');

	try {
		// Wait for config to load
		const CONFIG = await getConfig();
		console.log('Config loaded:', CONFIG); // Debug log

		// Initialize UI with config values
		titleElement.textContent = CONFIG.title;
		taskInput.placeholder = CONFIG.placeholderText;

		// Initialize prefix selector
		const prefixSelect = document.getElementById('prefixSelect');
		CONFIG.prefixes.forEach(prefix => {
			const option = document.createElement('option');
			option.value = prefix;
			option.textContent = prefix;
			if (prefix === CONFIG.defaultPrefix) {
				option.selected = true;
			}
			prefixSelect.appendChild(option);
		});

		// Load history when popup opens
		chrome.storage.local.get(['history'], function(data) {
			const history = data.history || [];
			updateHistoryDisplay(history);
		});

		// Settings button handler
		settingsButton.addEventListener('click', function() {
			chrome.tabs.create({ url: 'settings.html' });
		});

		// Clear history button handler
		clearButton.addEventListener('click', function() {
			chrome.storage.local.set({ history: [] }, function() {
				updateHistoryDisplay([]);
				result.textContent = 'History cleared';
			});
		});

		// Submit button handler with error handling
		submitButton.addEventListener('click', handleSubmit);
		
		// Also handle Enter key
		taskInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				handleSubmit();
			}
		});

		async function handleSubmit() {
			try {
				const prefix = prefixSelect.value;
				const number = taskInput.value.trim();
				const taskId = prefix + number;

				console.log('Processing task ID:', taskId);

				const currentConfig = await getConfig();
				const isValidFormat = /^\d+$/.test(number); // Only check if the input is a number

				if (number && isValidFormat) {
					const jiraUrl = `${currentConfig.baseUrl}${taskId}`;
					console.log('Opening URL:', jiraUrl);

					chrome.tabs.create({ url: jiraUrl }, (tab) => {
						if (chrome.runtime.lastError) {
							console.error('Error creating tab:', chrome.runtime.lastError);
							result.textContent = 'Error opening tab: ' + chrome.runtime.lastError.message;
							return;
						}

						chrome.storage.local.get(['history'], function(data) {
							const history = data.history || [];
							const newHistory = [taskId, ...history.filter(id => id !== taskId)]
								.slice(0, currentConfig.maxHistoryItems);
							chrome.storage.local.set({ history: newHistory });
							updateHistoryDisplay(newHistory);
						});

						result.textContent = `Opening: ${taskId}`;
						taskInput.value = '';
					});
				} else {
					result.textContent = 'Please enter a valid ticket number';
				}
			} catch (error) {
				console.error('Error in submit handler:', error);
				result.textContent = 'Error: ' + error.message;
			}
		}

		function updateHistoryDisplay(history) {
			const historyContainer = document.getElementById('history');
			if (history.length > 0) {
				historyContainer.innerHTML = history.map(id => 
					`<div class="history-item" data-id="${id}">${id}</div>`
				).join('');
			} else {
				historyContainer.innerHTML = '<div class="no-history">No recent tasks</div>';
			}
		}

		// Click handler for history items - modified to open URL directly
		document.getElementById('history').addEventListener('click', async function(e) {
			if (e.target.classList.contains('history-item')) {
				const taskId = e.target.dataset.id;
				const currentConfig = await getConfig();
				const jiraUrl = `${currentConfig.baseUrl}${taskId}`;
				
				chrome.tabs.create({ url: jiraUrl }, (tab) => {
					if (chrome.runtime.lastError) {
						console.error('Error creating tab:', chrome.runtime.lastError);
						result.textContent = 'Error opening tab: ' + chrome.runtime.lastError.message;
						return;
					}
					result.textContent = `Opening: ${taskId}`;
				});
			}
		});

	} catch (error) {
		console.error('Error initializing popup:', error);
		result.textContent = 'Error initializing: ' + error.message;
	}
}); 