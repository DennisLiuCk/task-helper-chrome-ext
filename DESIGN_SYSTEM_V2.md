# Task Helper v2.0 - 設計系統文件

## 🎨 色彩系統

### 主色調 (Primary)
基於 Jira 品牌色，提供完整的色階

```css
:root {
  /* Primary - Jira Blue */
  --primary-50: #E3F2FD;
  --primary-100: #BBDEFB;
  --primary-200: #90CAF9;
  --primary-300: #64B5F6;
  --primary-400: #42A5F5;
  --primary-500: #0052CC;  /* 主色 */
  --primary-600: #1E88E5;
  --primary-700: #1976D2;
  --primary-800: #1565C0;
  --primary-900: #0D47A1;

  /* Primary with opacity */
  --primary-alpha-10: rgba(0, 82, 204, 0.1);
  --primary-alpha-20: rgba(0, 82, 204, 0.2);
  --primary-alpha-50: rgba(0, 82, 204, 0.5);
}
```

### 狀態色彩
為任務狀態設計的語義化色彩

```css
:root {
  /* Status Colors */
  --status-na: #9E9E9E;       /* 灰色 - 未開始 */
  --status-na-bg: #F5F5F5;
  --status-na-hover: #757575;

  --status-dev: #FF9800;      /* 橙色 - 開發中 */
  --status-dev-bg: #FFF3E0;
  --status-dev-hover: #F57C00;

  --status-qa: #4CAF50;       /* 綠色 - 測試中 */
  --status-qa-bg: #E8F5E9;
  --status-qa-hover: #388E3C;

  --status-uat: #2196F3;      /* 藍色 - UAT */
  --status-uat-bg: #E3F2FD;
  --status-uat-hover: #1976D2;

  --status-done: #8BC34A;     /* 淺綠 - 完成 */
  --status-done-bg: #F1F8E9;
  --status-done-hover: #689F38;

  --status-blocked: #F44336;  /* 紅色 - 阻塞 */
  --status-blocked-bg: #FFEBEE;
  --status-blocked-hover: #D32F2F;
}
```

### 服務色彩
為不同服務設計的識別色

```css
:root {
  /* Service Colors */
  --service-product: #673AB7;   /* 深紫 */
  --service-product-bg: #EDE7F6;

  --service-store: #E91E63;     /* 粉紅 */
  --service-store-bg: #FCE4EC;

  --service-gateway: #00BCD4;   /* 青色 */
  --service-gateway-bg: #E0F7FA;

  --service-backend: #FF5722;   /* 深橙 */
  --service-backend-bg: #FBE9E7;

  --service-frontend: #3F51B5;  /* 靛藍 */
  --service-frontend-bg: #E8EAF6;

  --service-others: #607D8B;    /* 藍灰 */
  --service-others-bg: #ECEFF1;
}
```

### 語義化色彩

```css
:root {
  /* Semantic Colors */
  --success: #4CAF50;
  --success-bg: #E8F5E9;
  --success-hover: #388E3C;

  --warning: #FF9800;
  --warning-bg: #FFF3E0;
  --warning-hover: #F57C00;

  --error: #F44336;
  --error-bg: #FFEBEE;
  --error-hover: #D32F2F;

  --info: #2196F3;
  --info-bg: #E3F2FD;
  --info-hover: #1976D2;
}
```

### 中性色彩

```css
:root {
  /* Light Mode - Neutral Colors */
  --gray-50: #FAFAFA;
  --gray-100: #F5F5F5;
  --gray-200: #EEEEEE;
  --gray-300: #E0E0E0;
  --gray-400: #BDBDBD;
  --gray-500: #9E9E9E;
  --gray-600: #757575;
  --gray-700: #616161;
  --gray-800: #424242;
  --gray-900: #212121;

  /* Semantic Grays */
  --background: #FFFFFF;
  --surface: #FFFFFF;
  --surface-variant: #F5F5F5;
  --surface-hover: #FAFAFA;
  --border: #E0E0E0;
  --border-strong: #BDBDBD;
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-disabled: #BDBDBD;
}
```

### 深色模式

```css
:root[data-theme="dark"] {
  /* Dark Mode - Background Colors */
  --background: #121212;
  --surface: #1E1E1E;
  --surface-variant: #2C2C2C;
  --surface-hover: #383838;
  --border: #404040;
  --border-strong: #525252;

  /* Dark Mode - Text Colors */
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-disabled: #6C6C6C;

  /* Dark Mode - Adjusted Status Colors */
  --status-na: #B0B0B0;
  --status-dev: #FFB74D;
  --status-qa: #66BB6A;
  --status-uat: #42A5F5;
  --status-done: #9CCC65;
  --status-blocked: #EF5350;
}
```

---

## 📏 間距系統

使用 4px 基礎單位，提供一致的間距

```css
:root {
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
}
```

---

## 🔤 字體系統

### 字體家族

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
               'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
               'Helvetica Neue', sans-serif;

  --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono',
               'Courier New', monospace;
}
```

### 字體大小

```css
:root {
  --text-xs: 11px;      /* 小標籤 */
  --text-sm: 12px;      /* 次要文字 */
  --text-base: 14px;    /* 正文 */
  --text-lg: 16px;      /* 強調文字 */
  --text-xl: 18px;      /* 小標題 */
  --text-2xl: 20px;     /* 標題 */
  --text-3xl: 24px;     /* 大標題 */
  --text-4xl: 30px;     /* 特大標題 */
}
```

### 字重

```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 行高

```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

---

## 🎭 陰影系統

提供深度層級感

```css
:root {
  /* Elevation Shadows */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1),
               0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07),
               0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1),
               0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15),
               0 10px 10px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

  /* Inner Shadow */
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);

  /* Focus Shadow */
  --shadow-focus: 0 0 0 3px var(--primary-alpha-20);

  /* Colored Shadows */
  --shadow-primary: 0 4px 14px rgba(0, 82, 204, 0.25);
  --shadow-success: 0 4px 14px rgba(76, 175, 80, 0.25);
  --shadow-error: 0 4px 14px rgba(244, 67, 54, 0.25);
}
```

### 深色模式陰影

```css
:root[data-theme="dark"] {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3),
               0 1px 2px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3),
               0 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4),
               0 4px 6px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.5),
               0 10px 10px rgba(0, 0, 0, 0.2);
}
```

---

## 🔲 圓角系統

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```

---

## ⚡ 動畫系統

### 過渡時間

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  --duration-slowest: 700ms;
}
```

### 緩動曲線

```css
:root {
  /* Standard Easing */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Advanced Easing */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Material Design Easing */
  --ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
}
```

### 常用過渡

```css
:root {
  --transition-colors: color var(--duration-base) var(--ease-in-out),
                       background-color var(--duration-base) var(--ease-in-out),
                       border-color var(--duration-base) var(--ease-in-out);

  --transition-transform: transform var(--duration-base) var(--ease-out);

  --transition-opacity: opacity var(--duration-base) var(--ease-in-out);

  --transition-all: all var(--duration-base) var(--ease-in-out);

  --transition-shadow: box-shadow var(--duration-base) var(--ease-in-out);
}
```

### 關鍵幀動畫

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide Up */
@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Slide Down */
@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

---

## 📐 佈局系統

### Z-Index 層級

```css
:root {
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-notification: 1080;
}
```

### 斷點系統 (為未來響應式設計預留)

```css
:root {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 480px;
  --breakpoint-md: 640px;
  --breakpoint-lg: 768px;
  --breakpoint-xl: 1024px;
}
```

---

## 🎯 組件規範

### 按鈕

**尺寸**
```css
.button-xs {
  height: 24px;
  padding: 0 var(--spacing-2);
  font-size: var(--text-xs);
}

.button-sm {
  height: 32px;
  padding: 0 var(--spacing-3);
  font-size: var(--text-sm);
}

.button-md {
  height: 40px;
  padding: 0 var(--spacing-4);
  font-size: var(--text-base);
}

.button-lg {
  height: 48px;
  padding: 0 var(--spacing-6);
  font-size: var(--text-lg);
}
```

**變體**
- Primary: 主要動作
- Secondary: 次要動作
- Tertiary: 第三級動作
- Ghost: 透明背景
- Danger: 危險操作

### 輸入框

```css
.input {
  height: 40px;
  padding: 0 var(--spacing-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: var(--transition-colors);
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-focus);
}

.input:disabled {
  background-color: var(--gray-100);
  color: var(--text-disabled);
  cursor: not-allowed;
}
```

### 卡片

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-shadow);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-elevated {
  box-shadow: var(--shadow-lg);
}
```

### 標籤 (Badge)

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: 1;
}

/* Status Badges */
.badge-dev {
  background: var(--status-dev-bg);
  color: var(--status-dev);
}

.badge-qa {
  background: var(--status-qa-bg);
  color: var(--status-qa);
}
```

---

## ♿ 無障礙設計

### Focus 樣式

```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.focus-ring {
  box-shadow: 0 0 0 3px var(--primary-alpha-20);
}
```

### 顏色對比度

所有文字與背景的對比度必須符合 WCAG 2.1 AA 標準：
- 正常文字：至少 4.5:1
- 大文字（18px+ 或 14px+ 粗體）：至少 3:1

### ARIA 屬性

必須為所有互動元素添加適當的 ARIA 屬性：
- `aria-label`
- `aria-labelledby`
- `aria-describedby`
- `role`
- `aria-expanded`
- `aria-selected`

---

## 📱 響應式設計

雖然 Chrome 擴充功能寬度固定，但仍需考慮內容的適應性：

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}
```

---

## 🎪 使用範例

### 任務卡片完整樣式

```css
.task-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.task-card-selected {
  border-color: var(--primary-500);
  box-shadow: var(--shadow-primary);
}

.task-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.task-card-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin: 0;
}

.task-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--border);
}
```

---

## 🔧 工具函式

### 顏色轉換

```javascript
// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Generate alpha variant
function generateAlpha(hex, alpha) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
```

### 深色模式切換

```javascript
function toggleDarkMode(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// 自動檢測系統主題
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
toggleDarkMode(prefersDark.matches);
prefersDark.addEventListener('change', (e) => toggleDarkMode(e.matches));
```

---

## 📚 參考資源

- [Material Design 3](https://m3.material.io/)
- [Fluent UI](https://fluent2.microsoft.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

