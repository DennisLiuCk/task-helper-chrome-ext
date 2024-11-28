document.addEventListener('DOMContentLoaded', async function() {
	const taskInput = document.getElementById('taskInput');
	const submitButton = document.getElementById('submitButton');
	const result = document.getElementById('result');
	const clearButton = document.getElementById('clearHistory');
	const settingsButton = document.getElementById('settingsButton');
	const titleElement = document.getElementById('title');
	const addReleaseGroupButton = document.getElementById('addReleaseGroup');
	const searchButton = document.getElementById('searchButton');
	const queryInput = document.getElementById('queryInput');

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

			// Add click handlers for Swagger links
			document.querySelectorAll('.swagger-item').forEach(item => {
				item.addEventListener('click', function() {
					const url = this.dataset.url;
					if (url) {
						chrome.tabs.create({ url });
					}
				});
			});
		}

		// Initial load of Swagger links
		chrome.storage.local.get(['userConfig'], function(data) {
			if (data.userConfig && data.userConfig.swaggerLinks) {
				updateSwaggerLinks(data.userConfig.swaggerLinks);
			} else {
				updateSwaggerLinks(CONFIG.swaggerLinks || []);
			}
		});

		// Listen for changes in storage
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			if (namespace === 'local' && changes.userConfig) {
				const newConfig = changes.userConfig.newValue;
				if (newConfig && newConfig.swaggerLinks) {
					console.log('Swagger links updated:', newConfig.swaggerLinks);
					updateSwaggerLinks(newConfig.swaggerLinks);
				}
			}
		});

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

		// Add new function to handle release groups
		function updateReleaseGroupsDisplay(releaseGroups) {
			const releaseGroupsContainer = document.getElementById('releaseGroups');
			
			if (!releaseGroups || Object.keys(releaseGroups).length === 0) {
				releaseGroupsContainer.innerHTML = '<div class="no-history">No release groups</div>';
				return;
			}

			releaseGroupsContainer.innerHTML = Object.entries(releaseGroups)
				.map(([date, items]) => `
					<div class="release-group" data-date="${date}">
						<div class="release-group-header">
							<span class="release-title">${date}</span>
							<div class="release-actions">
								<button class="release-action-button add-to-group" title="Add task">
									<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
										<path d="M8 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 0 1-2 0V9H3a1 1 0 1 1 0-2h4V3a1 1 0 0 1 1-1z"/>
									</svg>
								</button>
								<button class="release-action-button delete-group" title="Delete group">
									<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
										<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/>
									</svg>
								</button>
							</div>
						</div>
						<div class="release-items">
							${items.map(id => `
								<div class="release-item" data-id="${id}">
									<span>${id}</span>
									<div class="release-item-actions">
										<button class="release-action-button slack-link" title="Slack Link" data-id="${id}">
											<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
												<path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z"/>
											</svg>
										</button>
										<button class="release-action-button remove-from-group" title="Remove from group">
											<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
												<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
											</svg>
										</button>
									</div>
								</div>
							`).join('')}
						</div>
					</div>
				`).join('');

			addReleaseGroupEventListeners();
		}

		// Add event listeners for release group actions
		function addReleaseGroupEventListeners() {
			// Delete group
			document.querySelectorAll('.delete-group').forEach(button => {
				button.addEventListener('click', function(e) {
					const group = e.target.closest('.release-group');
					const date = group.dataset.date;
					
					if (confirm(`Delete release group ${date}?`)) {
						chrome.storage.local.get(['releaseGroups'], function(data) {
							const groups = data.releaseGroups || {};
							delete groups[date];
							chrome.storage.local.set({ releaseGroups: groups }, function() {
								updateReleaseGroupsDisplay(groups);
							});
						});
					}
				});
			});

			// Add task to group
			document.querySelectorAll('.add-to-group').forEach(button => {
				button.addEventListener('click', async function(e) {
					const group = e.target.closest('.release-group');
					const date = group.dataset.date;
					
					chrome.storage.local.get(['history'], async function(data) {
						const history = data.history || [];
						try {
							const config = await getConfig();
							showAddTaskDialog(date, history, config);
						} catch (error) {
							console.error('Error loading config:', error);
							alert('Error loading configuration. Please try again.');
						}
					});
				});
			});

			// Remove task from group
			document.querySelectorAll('.remove-from-group').forEach(button => {
				button.addEventListener('click', function(e) {
					const group = e.target.closest('.release-group');
					const item = e.target.closest('.release-item');
					const date = group.dataset.date;
					const taskId = item.dataset.id;

					chrome.storage.local.get(['releaseGroups'], function(data) {
						const groups = data.releaseGroups || {};
						groups[date] = groups[date].filter(id => id !== taskId);
						if (groups[date].length === 0) {
							delete groups[date];
						}
						chrome.storage.local.set({ releaseGroups: groups }, function() {
							updateReleaseGroupsDisplay(groups);
						});
					});
				});
			});

			// Add Slack link button handler
			document.querySelectorAll('.slack-link').forEach(button => {
				button.addEventListener('click', async function(e) {
					e.preventDefault();
					const taskId = this.dataset.id;
					const date = this.closest('.release-group').dataset.date;

					// Get existing slack links
					chrome.storage.local.get(['slackLinks'], async function(data) {
						const slackLinks = data.slackLinks || {};
						const currentLink = slackLinks[taskId];

						if (currentLink) {
							// If link exists, open it
							chrome.tabs.create({ url: currentLink });
						} else {
							// If no link exists, prompt to add one
							const url = prompt('Enter Slack link for task ' + taskId + ':');
							if (url) {
								// Save the new link
								slackLinks[taskId] = url;
								await chrome.storage.local.set({ slackLinks: slackLinks });
								console.log('Saved Slack link for task:', taskId, url);
							}
						}
					});
				});
			});

			// Click handler for release items
			document.querySelectorAll('.release-item').forEach(item => {
				item.addEventListener('click', async function(e) {
					if (e.target.closest('.remove-from-group') || e.target.closest('.slack-link')) return;
					
					const taskId = this.dataset.id;
					const currentConfig = await getConfig();
					const jiraUrl = `${currentConfig.baseUrl}${taskId}`;
					
					chrome.tabs.create({ url: jiraUrl });
				});
			});
		}

		// Add release group button handler
		addReleaseGroupButton.addEventListener('click', function() {
			chrome.storage.local.get(['history'], function(data) {
				const history = data.history || [];
				showTaskSelectionDialog(history);
			});
		});

		// Load release groups when popup opens
		chrome.storage.local.get(['releaseGroups'], function(data) {
			updateReleaseGroupsDisplay(data.releaseGroups || {});
		});

		function showTaskSelectionDialog(history) {
			const dialog = document.getElementById('taskSelectionDialog');
			const historySelection = dialog.querySelector('.history-selection');
			const cancelButton = dialog.querySelector('.cancel');
			const confirmButton = dialog.querySelector('.confirm');
			const dateInput = dialog.querySelector('#dialogDateInput');

			// Populate dialog with history items
			historySelection.innerHTML = history.map(item => `
				<div class="history-item" data-id="${item}">
					<span>${item}</span>
				</div>
			`).join('');

			// Handle item selection
			historySelection.addEventListener('click', function(e) {
				const item = e.target.closest('.history-item');
				if (item) {
					item.classList.toggle('selected');
				}
			});

			// Handle dialog buttons
			cancelButton.onclick = function() {
				dialog.style.display = 'none';
			};

			confirmButton.onclick = function() {
				const groupName = dateInput.value.trim();
				if (!groupName) {
					alert('Please enter a group name');
					return;
				}

				const selectedItems = Array.from(historySelection.querySelectorAll('.history-item.selected'))
					.map(item => item.dataset.id);

				chrome.storage.local.get(['releaseGroups'], function(data) {
					const groups = data.releaseGroups || {};
					if (groups[groupName]) {
						alert('Group already exists');
						return;
					}

					groups[groupName] = selectedItems;
					chrome.storage.local.set({ releaseGroups: groups }, function() {
						updateReleaseGroupsDisplay(groups);
						dialog.style.display = 'none';
					});
				});
			};

			// Show dialog and focus input
			dialog.style.display = 'flex';
			dateInput.focus();
		}

		function showAddTaskDialog(date, history, config) {
			const dialog = document.getElementById('addTaskDialog');
			const historySelection = dialog.querySelector('.history-selection');
			const cancelButton = dialog.querySelector('.cancel');
			const confirmButton = dialog.querySelector('.confirm');
			const prefixSelect = dialog.querySelector('#dialogPrefixSelect');
			const taskInput = dialog.querySelector('#dialogTaskInput');

			// Initialize prefix selector
			prefixSelect.innerHTML = config.prefixes.map(prefix => `
				<option value="${prefix}" ${prefix === config.defaultPrefix ? 'selected' : ''}>
					${prefix}
				</option>
			`).join('');

			// Populate dialog with history items
			historySelection.innerHTML = history.map(item => `
				<div class="history-item" data-id="${item}">
					<span>${item}</span>
				</div>
			`).join('');

			// Handle item selection
			historySelection.addEventListener('click', function(e) {
				const item = e.target.closest('.history-item');
				if (item) {
					// Deselect other items
					historySelection.querySelectorAll('.history-item').forEach(i => {
						i.classList.remove('selected');
					});
					item.classList.add('selected');
					
					// Update input field with selected item
					const taskId = item.dataset.id;
					const prefix = taskId.split('-')[0] + '-';
					const number = taskId.split('-')[1];
					
					prefixSelect.value = prefix;
					taskInput.value = number;
				}
			});

			// Handle dialog buttons
			cancelButton.onclick = function() {
				dialog.style.display = 'none';
			};

			confirmButton.onclick = function() {
				let taskId;
				
				if (taskInput.value) {
					taskId = prefixSelect.value + taskInput.value;
				} else {
					const selectedItem = historySelection.querySelector('.history-item.selected');
					if (!selectedItem) {
						alert('Please enter a task number or select from history');
						return;
					}
					taskId = selectedItem.dataset.id;
				}

				chrome.storage.local.get(['releaseGroups'], function(data) {
					const groups = data.releaseGroups || {};
					groups[date] = groups[date] || [];
					if (!groups[date].includes(taskId)) {
						groups[date].push(taskId);
						chrome.storage.local.set({ releaseGroups: groups }, function() {
							updateReleaseGroupsDisplay(groups);
							dialog.style.display = 'none';
						});
					} else {
						alert('Task already exists in this group');
					}
				});
			};

			// Show dialog
			dialog.style.display = 'flex';
			taskInput.focus();
		}

		// Set up search functionality
		searchButton.addEventListener('click', function() {
			handleSearch();
		});
		
		queryInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				handleSearch();
			}
		});
		
		function handleSearch() {
			const query = queryInput.value.trim();
			const searchType = document.getElementById('searchType').value;

			if (!query) {
				alert('Please enter a search term');
				return;
			}
			
			let searchUrl;
			if (searchType === 'browse') {
				const baseUrl = CONFIG.baseUrl.replace('/browse/', '');
				const jql = `text ~ %22${encodeURIComponent(query)}%22 ORDER BY updated DESC`;
				searchUrl = `${baseUrl}/issues/?smartQueryDisabled=false&jql=${jql}`;
			} else {
				// Wiki search
				searchUrl = `${CONFIG.confluenceUrl}search?text=${encodeURIComponent(query)}`;
			}

			chrome.tabs.create({ url: searchUrl });
		}

	} catch (error) {
		console.error('Error initializing popup:', error);
		result.textContent = 'Error initializing: ' + error.message;
	}
}); 