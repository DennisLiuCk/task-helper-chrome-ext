document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('settingsForm');
    const resetButton = document.getElementById('resetButton');
    const addPrefixButton = document.getElementById('addPrefix');
    const prefixList = document.getElementById('prefixList');
    const defaultPrefixSelect = document.getElementById('defaultPrefix');
    const addSwaggerButton = document.getElementById('addSwagger');

    // Load current settings using the config promise
    try {
        const CONFIG = await getConfig();
        
        // Load current user settings
        chrome.storage.local.get(['userConfig'], function(data) {
            const currentConfig = data.userConfig || CONFIG;
            
            document.getElementById('baseUrl').value = currentConfig.baseUrl;
            document.getElementById('maxHistory').value = currentConfig.maxHistoryItems;
            document.getElementById('title').value = currentConfig.title;
            document.getElementById('placeholder').value = currentConfig.placeholderText;

            // Load prefixes
            updatePrefixList(currentConfig.prefixes || CONFIG.prefixes);
            updateDefaultPrefixSelect(currentConfig.prefixes || CONFIG.prefixes, currentConfig.defaultPrefix);

            // Load Swagger links
            updateSwaggerList(currentConfig.swaggerLinks || CONFIG.swaggerLinks);
        });
    } catch (error) {
        console.error('Error loading config:', error);
    }

    // Add new prefix
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

    // Add new Swagger link
    addSwaggerButton.addEventListener('click', function() {
        const name = prompt('Enter name for the Swagger link:');
        if (name) {
            const url = prompt('Enter URL for the Swagger link:');
            if (url) {
                const currentLinks = getSwaggerLinksFromList();
                updateSwaggerList([...currentLinks, { name, url }]);
            }
        }
    });

    // Handle prefix list updates
    function updatePrefixList(prefixes) {
        prefixList.innerHTML = prefixes.map(prefix => `
            <div class="prefix-item">
                <span>${prefix}</span>
                <button type="button" class="remove-prefix" data-prefix="${prefix}">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Add remove handlers
        document.querySelectorAll('.remove-prefix').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const prefixToRemove = this.dataset.prefix;
                const updatedPrefixes = prefixes.filter(p => p !== prefixToRemove);
                updatePrefixList(updatedPrefixes);
                updateDefaultPrefixSelect(updatedPrefixes);
            });
        });
    }

    function updateDefaultPrefixSelect(prefixes, selectedPrefix = null) {
        defaultPrefixSelect.innerHTML = prefixes.map(prefix => 
            `<option value="${prefix}" ${prefix === selectedPrefix ? 'selected' : ''}>${prefix}</option>`
        ).join('');
    }

    function getPrefixesFromList() {
        return Array.from(prefixList.querySelectorAll('.prefix-item span')).map(span => span.textContent);
    }

    function updateSwaggerList(links) {
        const swaggerList = document.getElementById('swaggerList');
        swaggerList.innerHTML = links.map(link => `
            <div class="swagger-item">
                <span>${link.name}</span>
                <input type="text" value="${link.url}" readonly>
                <button type="button" class="remove-swagger" data-name="${link.name}">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Add remove handlers
        document.querySelectorAll('.remove-swagger').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const nameToRemove = this.dataset.name;
                const updatedLinks = links.filter(l => l.name !== nameToRemove);
                updateSwaggerList(updatedLinks);
            });
        });
    }

    function getSwaggerLinksFromList() {
        return Array.from(document.querySelectorAll('.swagger-item')).map(item => ({
            name: item.querySelector('span').textContent,
            url: item.querySelector('input').value
        }));
    }

    // Save settings
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const prefixes = getPrefixesFromList();
        const newConfig = {
            baseUrl: document.getElementById('baseUrl').value,
            taskIdPattern: '^[A-Z]+-\\d+$', // Generic pattern for all prefixes
            maxHistoryItems: parseInt(document.getElementById('maxHistory').value),
            title: document.getElementById('title').value,
            placeholderText: document.getElementById('placeholder').value,
            defaultErrorMessage: 'Please enter a valid ticket number',
            prefixes: prefixes,
            defaultPrefix: defaultPrefixSelect.value,
            swaggerLinks: getSwaggerLinksFromList()
        };

        chrome.storage.local.set({ userConfig: newConfig }, function() {
            alert('Settings saved successfully!');
        });
    });

    // Reset to defaults
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            chrome.storage.local.remove('userConfig', function() {
                location.reload();
            });
        }
    });
}); 