# Task Helper Chrome Extension

A Chrome extension to help you quickly navigate to Jira tickets.

## Features

- Quickly navigate to Jira tickets by entering the ticket number.
- Maintain a history of recently accessed tickets.
- Customize the base URL for Jira.
- Add and manage ticket prefixes.
- Reset settings to default values.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/DennisLiuCk/task-helper-chrome-ext.git
    ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the cloned repository folder.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. Enter the ticket number in the input field.
3. Click the "Submit" button or press "Enter" to open the ticket in a new tab.
4. Use the "Settings" button to configure the base URL, ticket prefixes, and other settings.

## Configuration

The extension can be configured via the settings page:

- **Jira Base URL**: The base URL for your Jira instance.
- **Ticket Prefixes**: Add or remove prefixes for ticket numbers.
- **Default Prefix**: Set the default prefix for ticket numbers.
- **Max History Items**: Set the maximum number of recent tickets to display.
