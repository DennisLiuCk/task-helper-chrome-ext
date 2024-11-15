console.log('Loading config.js');

// Default configuration - safe to commit
const DEFAULT_CONFIG = {
  baseUrl: 'https://jira.example.com/browse/',
  taskIdPattern: '^MS-\\d+$',
  maxHistoryItems: 5,
  placeholderText: 'Enter ticket number',
  title: 'Task Helper',
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
const configPromise = new Promise((resolve) => {
    // Function to check if LOCAL_CONFIG is available
    const checkLocalConfig = () => {
        console.log('Checking LOCAL_CONFIG:', !!window.LOCAL_CONFIG);
        if (window.LOCAL_CONFIG) {
            loadConfig();
        } else {
            // If LOCAL_CONFIG is not available yet, wait and try again
            setTimeout(checkLocalConfig, 50);
        }
    };

    // Function to load and merge configs
    const loadConfig = () => {
        chrome.storage.local.get(['userConfig'], function(data) {
            // Deep merge function for nested objects
            const deepMerge = (target, source) => {
                for (const key in source) {
                    if (Array.isArray(source[key])) {
                        target[key] = [...source[key]];
                    } else if (source[key] instanceof Object && key in target) {
                        target[key] = deepMerge({...target[key]}, source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
                return target;
            };

            // Start with default config
            let config = {...DEFAULT_CONFIG};
            
            // Apply user config if exists
            if (data.userConfig) {
                console.log('Applying user config:', data.userConfig);
                config = deepMerge(config, data.userConfig);
            }
            
            // Apply local config (highest priority)
            console.log('Applying local config:', window.LOCAL_CONFIG);
            config = deepMerge(config, window.LOCAL_CONFIG);

            config.taskIdPattern = new RegExp(config.taskIdPattern);
            console.log('Final merged config:', config);
            resolve(config);
        });
    };

    // Start checking for LOCAL_CONFIG
    checkLocalConfig();
});

// Export the promise
window.getConfig = () => configPromise; 