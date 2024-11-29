// Config module
(function() {
    console.log('Loading config.js');

    // Default configuration - safe to commit
    const DEFAULT_CONFIG = {
        baseUrl: 'https://jira.example.com/browse/',
        confluenceUrl: 'https://jira.example.com/wiki/',
        taskIdPattern: '^MS-\\d+$',
        maxHistoryItems: 5,
        placeholderText: 'Enter ticket number',
        defaultErrorMessage: 'Please enter a valid ticket number',
        prefixes: ['MS-', 'BUILD-'],
        defaultPrefix: 'MS-',
        swaggerLinks: [
            {
                name: 'Example API',
                url: 'https://api.example.com/swagger-ui.html'
            },
            {
                name: 'Another API',
                url: 'https://api.another.com/swagger-ui.html'
            }
        ]
    };

    // Create a promise to handle config loading
    window.configPromise = new Promise((resolve) => {
        // Function to check if LOCAL_CONFIG is available
        const checkLocalConfig = () => {
            console.log('LOCAL_CONFIG value:', window.LOCAL_CONFIG); // Add debug log
            if (window.LOCAL_CONFIG) {
                const config = { ...DEFAULT_CONFIG, ...window.LOCAL_CONFIG };
                console.log('Final merged config:', config); // Add debug log
                resolve(config);
            } else {
                console.log('Using DEFAULT_CONFIG:', DEFAULT_CONFIG); // Add debug log
                resolve(DEFAULT_CONFIG);
            }
        };

        // Check immediately and also set a small timeout as backup
        checkLocalConfig();
        setTimeout(checkLocalConfig, 100);
    });

    // Export getConfig function
    window.getConfig = async function() {
        return await window.configPromise;
    };
})();