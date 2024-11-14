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

		// Initialize Swagger Links
		function updateSwaggerLinks(links) {
			const swaggerList = document.getElementById('swaggerList');
			if (!links || links.length === 0) {
				swaggerList.innerHTML = '<div class="no-history">No Swagger links configured</div>';
				return;
			}
			
			swaggerList.innerHTML = links.map(link => `
				<div class="swagger-item" data-url="${link.url}">
					<svg viewBox="0 0 16 16" fill="currentColor">
						<path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
						<path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
					</svg>
					<span>${link.name}</span>
				</div>
			`).join('');
		}

		// Initialize Swagger links
		updateSwaggerLinks(CONFIG.swaggerLinks);

		// Handle Swagger link clicks
		document.getElementById('swaggerList').addEventListener('click', function(e) {
			const item = e.target.closest('.swagger-item');
			if (item) {
				const url = item.dataset.url;
				chrome.tabs.create({ url }, (tab) => {
					if (chrome.runtime.lastError) {
						console.error('Error creating tab:', chrome.runtime.lastError);
						result.textContent = 'Error opening tab: ' + chrome.runtime.lastError.message;
						return;
					}
				});
			}
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

		// Tab switching
		document.querySelectorAll('.tab-button').forEach(button => {
			button.addEventListener('click', function() {
				const tabId = this.dataset.tab;
				
				// Update button states
				document.querySelectorAll('.tab-button').forEach(btn => 
					btn.classList.remove('active'));
				this.classList.add('active');
				
				// Update content visibility
				document.querySelectorAll('.tab-content').forEach(content => 
					content.classList.remove('active'));
				document.getElementById(`${tabId}Tab`).classList.add('active');
			});
		});

	} catch (error) {
		console.error('Error initializing popup:', error);
		result.textContent = 'Error initializing: ' + error.message;
	}
}); 