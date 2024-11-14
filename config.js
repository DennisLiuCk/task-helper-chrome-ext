const DEFAULT_CONFIG = {
  baseUrl: 'your-jira-url',
  taskIdPattern: '^MS-\\d+$',
  maxHistoryItems: 5,
  placeholderText: 'Enter ticket number',
  title: 'Task Helper',
  defaultErrorMessage: 'Please enter a valid ticket number',
  prefixes: ['MS-', 'AP-', 'FE-'],
  defaultPrefix: 'MS-',
  swaggerLinks: [
    {
      name: 'User Service API',
      url: 'https://api.example.com/user-service/swagger-ui.html'
    },
    {
      name: 'Order Service API',
      url: 'https://api.example.com/order-service/swagger-ui.html'
    }
  ]
};

// Create a promise to handle config loading
const configPromise = new Promise((resolve) => {
    chrome.storage.local.get(['userConfig'], function(data) {
        const config = data.userConfig || DEFAULT_CONFIG;
        config.taskIdPattern = new RegExp(config.taskIdPattern);
        resolve(config);
    });
});

// Export the promise
window.getConfig = () => configPromise; 