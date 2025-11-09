# Task Helper v2 - Chrome Extension

> 現代化的 Jira 任務管理 Chrome 擴展

一個優雅、高效、易用的任務管理工具，專為軟體開發團隊打造。

---

## ✨ 主要特色

- ✅ **完整任務管理** - 創建、編輯、刪除任務，支持 6 種狀態追蹤
- 🔍 **快速搜尋** - Command Palette (Cmd+K) 快速查找和操作
- 📊 **統計儀表板** - 實時查看任務狀態、進度統計
- 🎯 **批量操作** - 一次性管理多個任務
- 🔗 **連結管理** - Jira、Confluence 快速訪問和自訂連結
- ⚙️ **完整設定** - 主題、UI 偏好、服務管理、快捷鍵配置
- 🎨 **優雅設計** - 淺色/深色主題，流暢動畫，現代化 UI
- 🚀 **高性能** - 基於 Vue 3、TypeScript、Vite 構建

---

## 🚀 快速開始

### 安裝依賴

```bash
cd v2
npm install
```

### 開發模式

```bash
npm run dev
```

瀏覽器訪問 http://localhost:5173

### 構建擴展

```bash
npm run build
```

構建產物在 `v2/dist/` 目錄

### 載入到 Chrome

1. 打開 Chrome 擴展頁面: `chrome://extensions/`
2. 啟用「開發人員模式」
3. 點擊「載入未封裝項目」
4. 選擇 `v2/dist/` 目錄

詳細說明請參考: [v2/TESTING_GUIDE.md](v2/TESTING_GUIDE.md)

---

## 📁 專案結構

```
task-helper-chrome-ext/
├── v2/                     # Vue 3 應用 (主要開發目錄)
│   ├── src/
│   │   ├── components/     # Vue 組件
│   │   │   ├── common/     # 基礎組件 (Button, Modal, Toast...)
│   │   │   ├── task/       # 任務組件 (TaskCard, TaskList, TaskForm...)
│   │   │   └── search/     # 搜尋組件 (CommandPalette)
│   │   ├── views/          # 頁面組件
│   │   │   ├── Dashboard.vue
│   │   │   ├── Tasks.vue
│   │   │   ├── Releases.vue
│   │   │   ├── Links.vue
│   │   │   └── Settings.vue
│   │   ├── stores/         # Pinia 狀態管理
│   │   ├── router/         # Vue Router
│   │   ├── types/          # TypeScript 型別定義
│   │   └── styles/         # 全局樣式和設計系統
│   ├── public/
│   │   └── manifest.json   # Chrome Extension 配置
│   ├── dist/               # 構建輸出 (載入到 Chrome)
│   └── package.json
├── LICENSE
└── README.md               # 本文件
```

---

## 🛠️ 技術棧

- **前端框架**: Vue 3 (Composition API)
- **類型安全**: TypeScript (嚴格模式)
- **狀態管理**: Pinia
- **路由**: Vue Router (Memory History)
- **構建工具**: Vite
- **測試**: Vitest + Playwright
- **代碼質量**: ESLint + Prettier

---

## 📊 功能模塊

### 儀表板 (Dashboard)
- 任務統計卡片 (總數、開發中、測試中、已完成)
- 最近任務列表
- 快速操作按鈕
- 置頂/星標任務統計

### 任務管理 (Tasks)
- 完整 CRUD 操作
- 狀態追蹤: NA → DEV → QA → UAT → DONE / BLOCKED
- 優先度管理: LOW → MEDIUM → HIGH → CRITICAL
- 標籤系統
- 時間追蹤 (預估/實際工時)
- 批量操作 (狀態變更、優先度、Pin/Star、刪除、匯出)
- Command Palette (Cmd+K) 快速搜尋
- 過濾和排序

### 連結管理 (Links)
- Jira/Confluence 快速連結
- 自訂連結 CRUD
- 支持 Emoji 圖標
- 在新標籤頁打開

### 設定 (Settings)
- **Jira 設定**: Base URL、Confluence URL、任務前綴
- **UI 設定**: 主題 (淺色/深色/自動)、動畫速度、顯示密度、主色調
- **功能設定**: 通知、自動同步、快捷鍵、歷史記錄
- **服務管理**: 動態新增/刪除服務
- **快捷鍵**: 查看所有鍵盤快捷鍵
- **通知設定**: 每日摘要、狀態變更通知

### 首次使用引導
- 歡迎 Modal
- 範例數據載入選項
- 功能介紹

---

## ⌨️ 鍵盤快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Cmd+K` / `Ctrl+K` | 打開 Command Palette |
| `ESC` | 關閉 Modal / Command Palette |
| `↑` / `↓` | Command Palette 中選擇 |
| `Enter` | 執行選中項目 |

---

## 📦 NPM Scripts

```bash
# 開發
npm run dev              # 開發服務器 (http://localhost:5173)

# 構建
npm run build            # 快速構建
npm run build:check      # 類型檢查 + 構建

# 代碼質量
npm run type-check       # TypeScript 類型檢查
npm run lint             # ESLint 檢查和修復
npm run format           # Prettier 格式化

# 測試
npm test                 # Vitest 單元測試
npm run test:e2e         # Playwright E2E 測試
```

---

## 🎨 設計系統

完整的設計系統實現在 `v2/src/styles/variables.css`：

- **顏色**: 60+ CSS 變量 (主色、狀態色、服務色)
- **間距**: 10 級間距系統 (xs → 3xl)
- **字體**: 12px → 32px
- **陰影**: sm, md, lg
- **動畫**: 20+ 預定義動畫
- **主題**: 淺色/深色模式支持

---

## 🚧 開發狀態

- ✅ Phase 1: 基礎架構 (100%)
- ✅ Phase 2: 核心功能 (100%)
- ✅ Phase 2.5: 導航系統、Settings、Links、Dashboard 改善 (100%)
- ⏳ Phase 3: 發布看板 (計劃中)
- ⏳ Phase 4: 測試和優化 (計劃中)

**當前版本**: v2.0.0
**可用性**: ✅ 完全可用

---

## 📄 授權

Apache License 2.0 - 詳見 [LICENSE](LICENSE) 文件

---

## 👨‍💻 作者

**Dennis Liu**

---

## 🙏 致謝

- Vue.js 團隊
- Vite 團隊
- TypeScript 團隊

---

**如有問題或建議，請提交 Issue 或 Pull Request！** 🎉
