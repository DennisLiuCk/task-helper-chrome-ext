document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize all required elements
        const elements = {
            prefixSelect: document.getElementById('prefixSelect'),
            taskInput: document.getElementById('taskInput'),
            submitButton: document.getElementById('submitButton'),
            result: document.getElementById('result'),
            recentTasks: document.getElementById('recentTasks'),
            clearButton: document.getElementById('clearButton'),
            searchType: document.getElementById('searchType'),
            queryInput: document.getElementById('queryInput'),
            searchButton: document.getElementById('searchButton'),
            releaseGroups: document.getElementById('releaseGroups'),
            addReleaseGroup: document.getElementById('addReleaseGroup'),
            // Dialog elements
            taskSelectionDialog: document.getElementById('taskSelectionDialog'),
            addTaskDialog: document.getElementById('addTaskDialog'),
            dialogDateInput: document.getElementById('dialogDateInput'),
            dialogPrefixSelect: document.getElementById('dialogPrefixSelect'),
            dialogTaskInput: document.getElementById('dialogTaskInput'),
            // Settings
            settingsButton: document.querySelector('.settings-tab'),
            swaggerList: document.getElementById('swaggerList'),
            // Swagger elements
            addSwagger: document.getElementById('addSwagger'),
            swaggerName: document.getElementById('swaggerName'),
            swaggerUrl: document.getElementById('swaggerUrl'),
            // Service elements
            serviceList: document.getElementById('serviceList'),
            newServiceInput: document.getElementById('newServiceInput'),
            addService: document.getElementById('addService'),
        };

        // Validate all elements exist
        Object.entries(elements).forEach(([name, element]) => {
            if (!element) {
                throw new Error(`Missing required element: ${name}`);
            }
        });

        // Wait for config to load
        const configPromise = getConfig();
        console.log('Config loading...'); // Debug log

        // Initialize the extension
        async function initializeExtension() {
            try {
                console.log('Starting extension initialization...');
                
                // Wait for config to load
                const CONFIG = await configPromise;
                console.log('Default config loaded:', CONFIG);
                
                // Load user settings
                const data = await new Promise(resolve => 
                    chrome.storage.local.get(['userConfig'], resolve)
                );
                const userConfig = data.userConfig || {};
                console.log('User settings loaded:', userConfig);

                // Merge configs with user settings taking precedence
                const mergedConfig = {
                    ...CONFIG,
                    ...userConfig,
                    // Ensure arrays are properly merged
                    prefixes: userConfig.prefixes || CONFIG.prefixes,
                    swaggerLinks: userConfig.swaggerLinks || CONFIG.swaggerLinks
                };
                console.log('Final merged config:', mergedConfig);
                
                // Initialize UI components
                console.log('Initializing UI components...');
                initializeUIComponents(mergedConfig);
                
                // Initialize settings
                console.log('Initializing settings...');
                initializeSettings(mergedConfig);
                
                // Initialize Swagger links
                console.log('Initializing Swagger links...');
                updateSwaggerLinks(mergedConfig.swaggerLinks || []);
                
                // Load history and release groups
                console.log('Loading history and release groups...');
                await Promise.all([
                    loadHistory(),
                    loadReleaseGroups()
                ]);
                
                console.log('Extension initialization complete');
            } catch (error) {
                console.error('Failed to initialize extension:', error);
            }
        }

        // Initialize UI components with config
        function initializeUIComponents(config) {
            console.log('Setting up UI components with config:', config);
            
            // Initialize prefix selector
            const prefixSelect = document.getElementById('prefixSelect');
            if (prefixSelect) {
                prefixSelect.innerHTML = config.prefixes.map(prefix => 
                    `<option value="${prefix}" ${prefix === config.defaultPrefix ? 'selected' : ''}>${prefix}</option>`
                ).join('');
                console.log('Prefix selector initialized');
            }

            // Initialize task input
            const taskInput = document.getElementById('taskInput');
            if (taskInput) {
                taskInput.placeholder = config.placeholderText;
                console.log('Task input initialized');
            }

            // Initialize search handlers
            const searchButton = document.getElementById('searchButton');
            const queryInput = document.getElementById('queryInput');
            if (searchButton && queryInput) {
                searchButton.addEventListener('click', handleSearch);
                queryInput.addEventListener('keypress', e => {
                    if (e.key === 'Enter') handleSearch();
                });
                console.log('Search handlers initialized');
            }
        }

        // Initialize settings form
        function initializeSettings(config) {
            const settingsForm = document.getElementById('settingsForm');
            if (!settingsForm) {
                console.log('Settings form not found');
                return;
            }

            console.log('Initializing settings form with config:', config);

            // Set form values
            const baseUrlInput = document.getElementById('baseUrl');
            const maxHistoryInput = document.getElementById('maxHistory');
            const placeholderInput = document.getElementById('placeholder');

            if (baseUrlInput) baseUrlInput.value = config.baseUrl;
            if (maxHistoryInput) maxHistoryInput.value = config.maxHistoryItems;
            if (placeholderInput) placeholderInput.value = config.placeholderText;
            
            // Update prefix list and default prefix
            updatePrefixList(config.prefixes);
            updateDefaultPrefixSelect(config.prefixes, config.defaultPrefix);

            // Add form submit handler
            settingsForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await saveSettings();
            });

            console.log('Settings form initialized');
        }

        // Load and display history
        async function loadHistory() {
            return new Promise(resolve => {
                chrome.storage.local.get(['history'], data => {
                    if (data.history) {
                        updateHistoryDisplay(data.history);
                        console.log('History loaded:', data.history);
                    }
                    resolve();
                });
            });
        }

        // Load and display release groups
        async function loadReleaseGroups() {
            return new Promise(resolve => {
                chrome.storage.local.get(['releaseGroups'], data => {
                    updateReleaseGroupsDisplay(data.releaseGroups || {});
                    console.log('Release groups loaded:', data.releaseGroups);
                    resolve();
                });
            });
        }

        // Search functionality
        elements.searchButton.addEventListener('click', function() {
            handleSearch();
        });

        elements.queryInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        function handleSearch() {
            const query = elements.queryInput.value.trim();
            const searchType = elements.searchType.value;
            
            if (!query) {
                return;
            }

            // Get config and create URL
            configPromise.then(CONFIG => {
                let url;
                if (searchType === 'browse') {
                    url = `${CONFIG.baseUrl}?jql=text ~ "${encodeURIComponent(query)}"`;
                } else {
                    url = `${CONFIG.confluenceUrl}?search=${encodeURIComponent(query)}`;
                }
                chrome.tabs.create({ url });
            });
        }

        // Function to update Swagger links
        function updateSwaggerLinks(links) {
            // Get all swagger list containers
            const containers = document.querySelectorAll('#swaggerList');
            if (!containers.length) return;

            const content = !links || !links.length 
                ? '<div class="no-links">No links added yet</div>'
                : links.map(link => `
                    <div class="swagger-item">
                        <div class="swagger-info" data-url="${link.url}">
                            <div class="swagger-name">${link.name}</div>
                        </div>
                        <button type="button" class="remove-btn">Remove</button>
                    </div>
                `).join('');

            // Update all containers with the same content
            containers.forEach(container => {
                container.innerHTML = content;

                // Add click handlers
                container.querySelectorAll('.swagger-info').forEach(info => {
                    info.addEventListener('click', function() {
                        chrome.tabs.create({ url: this.dataset.url });
                    });
                });

                container.querySelectorAll('.remove-btn').forEach(button => {
                    button.addEventListener('click', async function(e) {
                        e.stopPropagation();
                        const item = this.closest('.swagger-item');
                        const info = item.querySelector('.swagger-info');
                        const url = info.dataset.url;
                        
                        chrome.storage.local.get(['userConfig'], function(data) {
                            const config = data.userConfig || {};
                            config.swaggerLinks = (config.swaggerLinks || []).filter(link => link.url !== url);
                            chrome.storage.local.set({ userConfig: config }, function() {
                                updateSwaggerLinks(config.swaggerLinks);
                            });
                        });
                    });
                });
            });
        }

        // Add event listener for adding new Swagger links
        if (elements.addSwagger && elements.swaggerName && elements.swaggerUrl) {
            elements.addSwagger.addEventListener('click', function() {
                const name = elements.swaggerName.value.trim();
                const url = elements.swaggerUrl.value.trim();

                if (!name || !url) {
                    alert('Please enter both name and URL');
                    return;
                }

                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    alert('Please enter a valid URL starting with http:// or https://');
                    return;
                }

                chrome.storage.local.get(['userConfig'], function(data) {
                    const config = data.userConfig || {};
                    const links = config.swaggerLinks || [];
                    
                    // Check for duplicates
                    if (links.some(link => link.url === url)) {
                        alert('This URL already exists in your links');
                        return;
                    }

                    links.push({ name, url });
                    config.swaggerLinks = links;

                    chrome.storage.local.set({ userConfig: config }, function() {
                        // Clear input fields after successful addition
                        elements.swaggerName.value = '';
                        elements.swaggerUrl.value = '';
                        
                        // Update the display
                        updateSwaggerLinks(links);
                    });
                });
            });
        }

        // Initial load of Swagger links
        chrome.storage.local.get(['userConfig'], function(data) {
            updateSwaggerLinks(data.userConfig || {});
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
        elements.swaggerList.addEventListener('click', function(e) {
            const item = e.target.closest('.swagger-link');
            if (item) {
                const url = item.href;
                chrome.tabs.create({ url: url }, (tab) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error creating tab:', chrome.runtime.lastError);
                        elements.result.textContent = 'Error opening tab: ' + chrome.runtime.lastError.message;
                        return;
                    }
                });
            }
        });

        // Update history display
        function updateHistoryDisplay(history) {
            const container = elements.recentTasks;
            
            if (!history || history.length === 0) {
                container.innerHTML = '<div class="no-tasks">No recent tasks</div>';
                return;
            }

            container.innerHTML = history.map(task => `
                <div class="task-item">
                    <span class="task-id">${task}</span>
                </div>
            `).join('');

            // Add click handlers for task items
            container.querySelectorAll('.task-item').forEach((item, index) => {
                item.addEventListener('click', async () => {
                    const currentConfig = await configPromise;
                    const jiraUrl = `${currentConfig.baseUrl}${history[index]}`;
                    chrome.tabs.create({ url: jiraUrl });
                });
            });
        }

        // Clear history button handler
        elements.clearButton.addEventListener('click', function() {
            if (confirm('Clear all recent tasks?')) {
                chrome.storage.local.set({ history: [] }, function() {
                    updateHistoryDisplay([]);
                });
            }
        });

        // Initialize history
        chrome.storage.local.get(['history'], function(data) {
            updateHistoryDisplay(data.history || []);
        });

        // Submit button handler with error handling
        elements.submitButton.addEventListener('click', handleSubmit);
        
        // Also handle Enter key
        elements.taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        });

        async function handleSubmit() {
            try {
                const prefix = elements.prefixSelect.value;
                const number = elements.taskInput.value.trim();
                const taskId = prefix + number;

                console.log('Processing task ID:', taskId);

                const currentConfig = await configPromise;
                const isValidFormat = /^\d+$/.test(number); // Only check if the input is a number

                if (number && isValidFormat) {
                    const jiraUrl = `${currentConfig.baseUrl}${taskId}`;
                    console.log('Opening URL:', jiraUrl);

                    chrome.tabs.create({ url: jiraUrl }, (tab) => {
                        if (chrome.runtime.lastError) {
                            console.error('Error creating tab:', chrome.runtime.lastError);
                            elements.result.textContent = 'Error opening tab: ' + chrome.runtime.lastError.message;
                            return;
                        }

                        chrome.storage.local.get(['history'], function(data) {
                            const history = data.history || [];
                            const newHistory = [taskId, ...history.filter(id => id !== taskId)]
                                .slice(0, currentConfig.maxHistoryItems);
                            chrome.storage.local.set({ history: newHistory });
                            updateHistoryDisplay(newHistory);
                        });

                        elements.result.textContent = `Opening: ${taskId}`;
                        elements.taskInput.value = '';
                    });
                } else {
                    elements.result.textContent = 'Please enter a valid ticket number';
                }
            } catch (error) {
                console.error('Error in submit handler:', error);
                elements.result.textContent = 'Error: ' + error.message;
            }
        }

        // Tab switching
        document.querySelectorAll('.nav-tab').forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remove active class from all tabs and contents
                document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
                
                // Add active class to clicked tab and show its content
                this.classList.add('active');
                document.getElementById(`${tabId}Tab`).style.display = 'block';

                // If settings tab is clicked, load the settings
                if (tabId === 'settings') {
                    loadSettings();
                }
            });
        });

        // Function to open a task in a new tab
        async function openTask(taskId) {
            if (!taskId) return;
            
            try {
                const config = await configPromise;
                console.log('Config loaded:', config); // Add debug log
                console.log('Base URL:', config.baseUrl); // Add debug log
                if (!config.baseUrl) {
                    throw new Error('Base URL not found in config');
                }
                const url = `${config.baseUrl}${taskId}`;
                console.log('Opening URL:', url); // Add debug log
                chrome.tabs.create({ url });
            } catch (error) {
                console.error('Error opening task:', error);
            }
        }

        // Function to update release groups display
        function updateReleaseGroupsDisplay(groups) {
            const container = elements.releaseGroups;
            
            if (!groups || Object.keys(groups).length === 0) {
                container.innerHTML = '<div class="no-groups">No release groups</div>';
                return;
            }

            container.innerHTML = Object.entries(groups)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, tasks]) => `
                    <div class="release-group" data-date="${date}">
                        <div class="release-group-header">
                            <span>${date}</span>
                            <div class="group-actions">
                                <button class="action-button add-task" title="Add Task">+</button>
                                <button class="action-button delete-group" title="Delete Group">×</button>
                            </div>
                        </div>
                        <div class="release-group-tasks">
                            ${tasks.map(task => `
                                <div class="task-item" data-task-id="${task}">
                                    <span class="task-id">${task}</span>
                                    <div class="task-actions">
                                        <button class="action-button service-button" title="Service">-</button>
                                        <button class="action-button status-button" title="Task Status">NA</button>
                                        <button class="action-button slack-link" title="Slack Link">💬</button>
                                        <button class="action-button delete" title="Remove Task">×</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('');

            // Add event listeners for group actions
            container.querySelectorAll('.release-group').forEach(group => {
                const date = group.dataset.date;
                const tasks = groups[date];

                // Add task button
                group.querySelector('.add-task').onclick = (e) => {
                    e.stopPropagation();
                    showAddTaskDialog(date);
                };

                // Delete group button
                group.querySelector('.delete-group').onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete group "${date}"?`)) {
                        delete groups[date];
                        chrome.storage.local.set({ releaseGroups: groups }, () => {
                            updateReleaseGroupsDisplay(groups);
                        });
                    }
                };

                // Task actions
                group.querySelectorAll('.task-item').forEach((taskItem, taskIndex) => {
                    const task = tasks[taskIndex];

                    // Service button
                    const serviceButton = taskItem.querySelector('.service-button');
                    chrome.storage.local.get(['taskServices'], (result) => {
                        const services = result.taskServices || {};
                        const currentService = services[task] || '-';
                        serviceButton.textContent = currentService;
                        serviceButton.classList.remove('service-product', 'service-store', 'service-gateway', 'service-others');
                        if (currentService !== '-') {
                            serviceButton.classList.add(`service-${currentService.toLowerCase()}`);
                        }
                    });

                    serviceButton.onclick = async (e) => {
                        e.stopPropagation();
                        const services = await getAvailableServices();
                        const result = await chrome.storage.local.get(['taskServices']);
                        const taskServices = result.taskServices || {};
                        
                        // Create and show dropdown
                        const dropdown = document.createElement('select');
                        dropdown.className = 'service-dropdown';
                        dropdown.style.position = 'absolute';
                        dropdown.style.zIndex = '1000';
                        
                        // Add default option
                        dropdown.add(new Option('-', '-'));
                        services.forEach(service => {
                            dropdown.add(new Option(service, service));
                        });
                        
                        // Set current value
                        dropdown.value = taskServices[task] || '-';
                        
                        // Position dropdown under button
                        const rect = serviceButton.getBoundingClientRect();
                        dropdown.style.left = rect.left + 'px';
                        dropdown.style.top = (rect.bottom + 2) + 'px';
                        
                        document.body.appendChild(dropdown);
                        dropdown.focus();
                        
                        // Handle selection
                        dropdown.onchange = async () => {
                            const selectedService = dropdown.value;
                            taskServices[task] = selectedService;
                            await chrome.storage.local.set({ taskServices });
                            serviceButton.textContent = selectedService;
                            serviceButton.classList.remove('service-product', 'service-store', 'service-gateway', 'service-others');
                            if (selectedService !== '-') {
                                serviceButton.classList.add(`service-${selectedService.toLowerCase()}`);
                            }
                            dropdown.remove();
                        };
                        
                        // Remove dropdown when clicking outside
                        const closeDropdown = (event) => {
                            if (!dropdown.contains(event.target) && event.target !== serviceButton) {
                                dropdown.remove();
                                document.removeEventListener('click', closeDropdown);
                            }
                        };
                        
                        // Delay adding the click listener to prevent immediate closure
                        setTimeout(() => {
                            document.addEventListener('click', closeDropdown);
                        }, 0);
                    };

                    // Status button
                    const statusButton = taskItem.querySelector('.status-button');
                    chrome.storage.local.get(['taskStatuses'], (result) => {
                        const statuses = result.taskStatuses || {};
                        const currentStatus = statuses[task] || 'NA';
                        statusButton.textContent = currentStatus;
                        // Remove all status classes first
                        statusButton.classList.remove('status-na', 'status-dev', 'status-qa');
                        // Add the current status class
                        statusButton.classList.add(`status-${currentStatus.toLowerCase()}`);
                    });

                    statusButton.onclick = async (e) => {
                        e.stopPropagation();
                        const states = ['NA', 'DEV', 'QA'];
                        const result = await chrome.storage.local.get(['taskStatuses']);
                        const statuses = result.taskStatuses || {};
                        const currentStatus = statuses[task] || 'NA';
                        const currentIndex = states.indexOf(currentStatus);
                        const nextStatus = states[(currentIndex + 1) % states.length];
                        
                        statuses[task] = nextStatus;
                        await chrome.storage.local.set({ taskStatuses: statuses });
                        statusButton.textContent = nextStatus;
                        // Update the status class
                        statusButton.classList.remove('status-na', 'status-dev', 'status-qa');
                        statusButton.classList.add(`status-${nextStatus.toLowerCase()}`);
                    };

                    // Slack link button
                    const slackButton = taskItem.querySelector('.slack-link');
                    
                    // Initialize button state
                    chrome.storage.local.get(['slackLinks'], (result) => {
                        const slackLinks = result.slackLinks || {};
                        if (slackLinks[task]) {
                            slackButton.classList.add('has-link');
                            slackButton.title = 'Open Slack Thread';
                        } else {
                            slackButton.classList.remove('has-link');
                            slackButton.title = 'Set Slack Link';
                        }
                    });

                    slackButton.onclick = async (e) => {
                        e.stopPropagation();
                        
                        // Get existing slack links
                        const result = await chrome.storage.local.get(['slackLinks']);
                        const slackLinks = result.slackLinks || {};
                        
                        if (slackLinks[task]) {
                            // If link exists, open it
                            window.open(slackLinks[task], '_blank');
                        } else {
                            // If no link exists, prompt to set one
                            const url = prompt('Enter Slack thread URL:', '');
                            if (url) {
                                slackLinks[task] = url;
                                await chrome.storage.local.set({ slackLinks });
                                slackButton.classList.add('has-link');
                                slackButton.title = 'Open Slack Thread';
                            }
                        }
                    };

                    // Delete task button
                    taskItem.querySelector('.delete').onclick = (e) => {
                        e.stopPropagation();
                        const updatedTasks = tasks.filter(t => t !== task);
                        groups[date] = updatedTasks;
                        chrome.storage.local.set({ releaseGroups: groups }, () => {
                            updateReleaseGroupsDisplay(groups);
                        });
                    };

                    // Click on task
                    taskItem.onclick = (e) => {
                        if (!e.target.closest('.action-button')) {
                            openTask(task);
                        }
                    };
                });
            });
        }

        // Add release group button handler
        elements.addReleaseGroup.addEventListener('click', () => {
            console.log('Add Release Group button clicked');
            showTaskSelectionDialog();
        });

        // Function to show task selection dialog
        function showTaskSelectionDialog() {
            console.log('Showing task selection dialog');
            const dialog = elements.taskSelectionDialog;
            console.log('Dialog element:', dialog);
            
            if (!dialog) {
                console.error('Task selection dialog element not found');
                return;
            }

            const dateInput = elements.dialogDateInput;
            const historySelection = dialog.querySelector('.history-selection');
            const confirmButton = dialog.querySelector('.confirm');
            const cancelButton = dialog.querySelector('.cancel');

            // Get current history
            chrome.storage.local.get(['history'], function(data) {
                console.log('Loading history:', data.history);
                const history = data.history || [];

                // Clear and populate history selection
                historySelection.innerHTML = history.map(task => `
                    <div class="dialog-task-item">
                        <label>
                            <input type="checkbox" value="${task}">
                            <span>${task}</span>
                        </label>
                    </div>
                `).join('');

                // Clear previous input and set default date
                dateInput.value = new Date().toISOString().split('T')[0];

                // Show dialog
                dialog.classList.add('active');
                console.log('Dialog shown');

                // Handle confirm
                confirmButton.addEventListener('click', () => {
                    const selectedDate = dateInput.value;
                    if (!selectedDate) {
                        alert('Please select a date');
                        return;
                    }

                    // Get selected tasks
                    const selectedTasks = Array.from(historySelection.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(checkbox => checkbox.value);

                    // Save the new group
                    chrome.storage.local.get(['releaseGroups'], function(data) {
                        const groups = data.releaseGroups || {};
                        groups[selectedDate] = selectedTasks;
                        chrome.storage.local.set({ releaseGroups: groups }, function() {
                            console.log('Release group saved');
                            dialog.classList.remove('active');
                            updateReleaseGroupsDisplay(groups);
                        });
                    });
                });

                // Handle cancel
                cancelButton.addEventListener('click', () => {
                    dialog.classList.remove('active');
                });
            });
        }

        // Show add task dialog
        function showAddTaskDialog(groupDate) {
            const dialog = elements.addTaskDialog;
            const historySelection = dialog.querySelector('.history-selection');
            const prefixSelect = elements.dialogPrefixSelect;
            const taskInput = elements.dialogTaskInput;
            const confirmButton = dialog.querySelector('.confirm');
            const cancelButton = dialog.querySelector('.cancel');

            // Get current config and history
            Promise.all([
                configPromise,
                new Promise(resolve => chrome.storage.local.get(['history'], resolve))
            ]).then(([CONFIG, { history }]) => {
                // Initialize prefix selector
                prefixSelect.innerHTML = CONFIG.prefixes.map(prefix => 
                    `<option value="${prefix}" ${prefix === CONFIG.defaultPrefix ? 'selected' : ''}>${prefix}</option>`
                ).join('');

                // Clear and populate history selection with horizontal layout
                historySelection.innerHTML = `
                    <div class="dialog-history-items">
                        ${(history || []).map(task => `
                            <div class="dialog-task-item">
                                <label>
                                    <input type="checkbox" value="${task}">
                                    <span>${task}</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Clear previous input
                taskInput.value = '';

                // Show dialog
                dialog.classList.add('active');
                taskInput.focus();

                // Handle confirm
                const handleConfirm = () => {
                    let taskId = '';
                    
                    // Get task ID from input if provided
                    if (taskInput.value) {
                        taskId = prefixSelect.value + taskInput.value;
                    }
                    
                    // Get selected tasks from history
                    const selectedTasks = Array.from(historySelection.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(checkbox => checkbox.value);
                    
                    if (!taskId && selectedTasks.length === 0) {
                        alert('Please enter a task number or select from history');
                        return;
                    }

                    // Combine manually entered task and selected tasks
                    const tasksToAdd = [...new Set([
                        ...(taskId ? [taskId] : []),
                        ...selectedTasks
                    ])];

                    // Update storage
                    chrome.storage.local.get(['releaseGroups'], function(data) {
                        const groups = data.releaseGroups || {};
                        groups[groupDate] = groups[groupDate] || [];
                        
                        // Add new tasks
                        tasksToAdd.forEach(task => {
                            if (!groups[groupDate].includes(task)) {
                                groups[groupDate].push(task);
                            }
                        });

                        // Save and update display
                        chrome.storage.local.set({ releaseGroups: groups }, function() {
                            updateReleaseGroupsDisplay(groups);
                            dialog.classList.remove('active');
                            
                            // Clear inputs
                            taskInput.value = '';
                            historySelection.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                        });
                    });
                };

                // Handle cancel
                const handleCancel = () => {
                    dialog.classList.remove('active');
                    taskInput.value = '';
                    historySelection.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                };

                // Remove old event listeners
                confirmButton.onclick = null;
                cancelButton.onclick = null;
                taskInput.onkeypress = null;

                // Add new event listeners
                confirmButton.addEventListener('click', handleConfirm);
                cancelButton.addEventListener('click', handleCancel);

                // Handle Enter key in task input
                taskInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        handleConfirm();
                    }
                });
            }).catch(error => {
                console.error('Error initializing add task dialog:', error);
                alert('Error initializing dialog. Please try again.');
            });
        }

        // Load release groups when popup opens
        chrome.storage.local.get(['releaseGroups'], function(data) {
            updateReleaseGroupsDisplay(data.releaseGroups || {});
        });

        // Settings functionality
        const settingsForm = document.getElementById('settingsForm');
        const resetButton = document.getElementById('resetButton');
        const addPrefixButton = document.getElementById('addPrefix');
        const prefixList = document.getElementById('prefixList');
        const defaultPrefixSelect = document.getElementById('defaultPrefix');
        
        async function loadSettings() {
            try {
                // Wait for config to be available
                const CONFIG = await configPromise;
                
                chrome.storage.local.get(['userConfig'], function(data) {
                    const currentConfig = data.userConfig || {};
                    
                    // Set values with fallbacks to CONFIG defaults
                    document.getElementById('baseUrl').value = currentConfig.baseUrl || CONFIG.baseUrl || '';
                    document.getElementById('maxHistory').value = currentConfig.maxHistoryItems || CONFIG.maxHistoryItems || 10;
                    document.getElementById('placeholder').value = currentConfig.placeholderText || CONFIG.placeholderText || 'Enter ticket number';

                    // Set prefixes with fallback
                    const prefixes = currentConfig.prefixes || CONFIG.prefixes || [];
                    updatePrefixList(prefixes);
                    updateDefaultPrefixSelect(prefixes, currentConfig.defaultPrefix || CONFIG.defaultPrefix);

                    // Set Swagger links with fallback
                    const swaggerLinks = currentConfig.swaggerLinks || CONFIG.swaggerLinks || [];
                    updateSwaggerList(swaggerLinks);

                    console.log('Settings loaded:', {
                        currentConfig,
                        CONFIG,
                        title: document.getElementById('title').value
                    });
                });
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }

        async function saveSettings() {
            try {
                const CONFIG = await configPromise;
                const newSettings = {
                    baseUrl: document.getElementById('baseUrl').value || CONFIG.baseUrl,
                    maxHistoryItems: parseInt(document.getElementById('maxHistory').value) || CONFIG.maxHistoryItems,
                    placeholderText: document.getElementById('placeholder').value || CONFIG.placeholderText,
                    prefixes: getPrefixesFromList(),
                    defaultPrefix: document.getElementById('defaultPrefix').value,
                    swaggerLinks: getSwaggerLinksFromList()
                };

                chrome.storage.local.set({ userConfig: newSettings }, function() {
                    if (chrome.runtime.lastError) {
                        console.error('Error saving settings:', chrome.runtime.lastError);
                        alert('Failed to save settings. Please try again.');
                    } else {
                        // Update UI elements with new settings
                        document.getElementById('taskInput').placeholder = newSettings.placeholderText;
                        
                        updatePrefixList(newSettings.prefixes);
                        updateDefaultPrefixSelect(newSettings.prefixes, newSettings.defaultPrefix);
                        updateSwaggerList(newSettings.swaggerLinks);
                        
                        alert('Settings saved successfully!');
                    }
                });
            } catch (error) {
                console.error('Error saving settings:', error);
                alert('Failed to save settings. Please try again.');
            }
        }

        function updatePrefixList(prefixes) {
            prefixList.innerHTML = '';
            prefixes.forEach(prefix => {
                const div = document.createElement('div');
                div.className = 'prefix-item';
                div.innerHTML = `
                    <span>${prefix}</span>
                    <button type="button" class="remove-btn">Remove</button>
                `;
                div.querySelector('.remove-btn').addEventListener('click', function() {
                    div.remove();
                    const currentPrefixes = getPrefixesFromList();
                    updateDefaultPrefixSelect(currentPrefixes);
                });
                prefixList.appendChild(div);
            });
        }

        function updateDefaultPrefixSelect(prefixes, selectedPrefix = null) {
            defaultPrefixSelect.innerHTML = prefixes.map(prefix => 
                `<option value="${prefix}" ${prefix === selectedPrefix ? 'selected' : ''}>${prefix}</option>`
            ).join('');
        }

        function getPrefixesFromList() {
            return Array.from(prefixList.querySelectorAll('.prefix-item')).map(item => item.querySelector('span').textContent);
        }

        function updateSwaggerList(links) {
            const swaggerList = document.getElementById('swaggerList');
            swaggerList.innerHTML = '';
            links.forEach(link => {
                const div = document.createElement('div');
                div.className = 'swagger-item';
                div.innerHTML = `
                    <div class="swagger-info" data-url="${link.url}">
                        <div class="swagger-name">${link.name || 'Unnamed API'}</div>
                    </div>
                    <button type="button" class="remove-btn">Remove</button>
                `;

                // Add click handler to open URL in new tab
                div.querySelector('.swagger-info').addEventListener('click', function() {
                    const url = this.dataset.url;
                    chrome.tabs.create({ url: url });
                });

                div.querySelector('.remove-btn').addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering the parent's click event
                    div.remove();
                });
                swaggerList.appendChild(div);
            });
        }

        function getSwaggerLinksFromList() {
            return Array.from(document.querySelectorAll('.swagger-item')).map(item => ({
                name: item.querySelector('.swagger-name').textContent,
                url: item.querySelector('.swagger-info').dataset.url
            }));
        }

        // Add event listeners for settings
        if (settingsForm) {
            addPrefixButton.addEventListener('click', function() {
                const newPrefix = prompt('Enter new prefix (e.g., "MS-"):');
                if (newPrefix) {
                    const formattedPrefix = newPrefix.endsWith('-') ? newPrefix : `${newPrefix}-`;
                    const currentPrefixes = getPrefixesFromList();
                    if (!currentPrefixes.includes(formattedPrefix)) {
                        updatePrefixList([...currentPrefixes, formattedPrefix]);
                        updateDefaultPrefixSelect([...currentPrefixes, formattedPrefix]);
                    }
                }
            });

            settingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveSettings();
            });

            resetButton.addEventListener('click', async function() {
                if (confirm('Reset all settings to default?')) {
                    chrome.storage.local.remove('userConfig', function() {
                        if (chrome.runtime.lastError) {
                            console.error('Error resetting settings:', chrome.runtime.lastError);
                            alert('Failed to reset settings. Please try again.');
                        } else {
                            alert('Settings reset to default!');
                            window.location.reload();
                        }
                    });
                }
            });
        }

        // Function to update service list display
        function updateServiceList(services = []) {
            if (!elements.serviceList) return;
            
            // Ensure services is an array
            services = Array.isArray(services) ? services : [];
            
            elements.serviceList.innerHTML = services.length === 0
                ? '<div class="no-services">No services added yet</div>'
                : services.map(service => `
                    <div class="service-item">
                        <span>${service}</span>
                        <button class="remove-btn" data-service="${service}">Remove</button>
                    </div>
                `).join('');

            // Add remove button handlers
            elements.serviceList.querySelectorAll('.remove-btn').forEach(button => {
                button.onclick = async () => {
                    const serviceToRemove = button.dataset.service;
                    const result = await chrome.storage.local.get(['userConfig']);
                    let config = result.userConfig || {};
                    
                    // Initialize services array if it doesn't exist
                    config.services = Array.isArray(config.services) ? config.services : ['PRODUCT', 'STORE', 'GATEWAY', 'OTHERS'];
                    
                    // Remove the specific service
                    config.services = config.services.filter(s => s !== serviceToRemove);
                    
                    // Save updated config
                    await chrome.storage.local.set({ userConfig: config });
                    
                    // Update the display with the filtered services
                    updateServiceList(config.services);
                };
            });
        }

        // Add service button handler
        if (elements.addService) {
            elements.addService.onclick = async () => {
                const newService = elements.newServiceInput.value.trim().toUpperCase();
                if (!newService) return;

                const result = await chrome.storage.local.get(['userConfig']);
                let config = result.userConfig || {};
                
                // Initialize services array if it doesn't exist
                config.services = Array.isArray(config.services) ? config.services : ['PRODUCT', 'STORE', 'GATEWAY', 'OTHERS'];

                if (!config.services.includes(newService)) {
                    config.services.push(newService);
                    await chrome.storage.local.set({ userConfig: config });
                    updateServiceList(config.services);
                    elements.newServiceInput.value = '';
                }
            };
        }

        // Load services when settings tab is opened
        document.querySelector('[data-tab="settings"]').addEventListener('click', async () => {
            const result = await chrome.storage.local.get(['userConfig']);
            const config = result.userConfig || {};
            const defaultServices = ['PRODUCT', 'STORE', 'GATEWAY', 'OTHERS'];
            const services = Array.isArray(config.services) ? config.services : defaultServices;
            updateServiceList(services);
        });

        // Function to get available services
        async function getAvailableServices() {
            const result = await chrome.storage.local.get(['userConfig']);
            const config = result.userConfig || {};
            return Array.isArray(config.services) ? config.services : ['PRODUCT', 'STORE', 'GATEWAY', 'OTHERS'];
        }

        // Wait for DOM to be fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeExtension);
        } else {
            initializeExtension();
        }
    } catch (error) {
        console.error('Error initializing popup:', error);
    }
});