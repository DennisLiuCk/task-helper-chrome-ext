export interface Service {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Settings {
  jira: {
    baseUrl: string;
    confluenceUrl: string;
    prefixes: string[];
    defaultPrefix: string;
  };

  ui: {
    theme: 'light' | 'dark' | 'auto';
    accentColor: string;
    animationSpeed: 'fast' | 'normal' | 'slow';
    density: 'comfortable' | 'compact' | 'spacious';
    defaultView: 'dashboard' | 'tasks' | 'releases' | 'links';
  };

  features: {
    enableNotifications: boolean;
    enableAutoSync: boolean;
    enableKeyboardShortcuts: boolean;
    maxHistoryItems: number;
    autoArchiveDays: number;
  };

  services: Service[];

  keyboardShortcuts: {
    globalSearch: string;
    newTask: string;
    newRelease: string;
    quickFilter: string;
    toggleDarkMode: string;
  };

  notifications: {
    dailySummary: boolean;
    dailySummaryTime: string;
    statusChanges: boolean;
    mentions: boolean;
  };
}

export const defaultSettings: Settings = {
  jira: {
    baseUrl: 'https://jira.example.com/browse/',
    confluenceUrl: 'https://jira.example.com/wiki/',
    prefixes: ['MS-', 'BUILD-'],
    defaultPrefix: 'MS-',
  },

  ui: {
    theme: 'auto',
    accentColor: '#0052CC',
    animationSpeed: 'normal',
    density: 'comfortable',
    defaultView: 'dashboard',
  },

  features: {
    enableNotifications: true,
    enableAutoSync: true,
    enableKeyboardShortcuts: true,
    maxHistoryItems: 10,
    autoArchiveDays: 30,
  },

  services: [
    { id: 'product', name: 'Product', color: '#673AB7' },
    { id: 'store', name: 'Store', color: '#E91E63' },
    { id: 'gateway', name: 'Gateway', color: '#00BCD4' },
    { id: 'others', name: 'Others', color: '#607D8B' },
  ],

  keyboardShortcuts: {
    globalSearch: 'cmd+k',
    newTask: 'cmd+n',
    newRelease: 'cmd+g',
    quickFilter: '/',
    toggleDarkMode: 'cmd+d',
  },

  notifications: {
    dailySummary: false,
    dailySummaryTime: '09:00',
    statusChanges: true,
    mentions: true,
  },
};
