# 🚀 Chrome Extension 本機測試指南

## 📋 前置準備

1. **建置專案**（已完成）
   ```bash
   cd v2
   npm run build
   ```

2. **確認建置產物**
   - 所有檔案都在 `v2/dist/` 目錄中
   - 包含 `manifest.json`, `index.html`, 和所有 JS/CSS 檔案

## 🔧 載入到 Chrome 瀏覽器

### 步驟 1：開啟擴充功能管理頁面

在 Chrome 瀏覽器中，使用以下任一方式：

**方式 A：** 直接輸入網址
```
chrome://extensions/
```

**方式 B：** 使用選單
1. 點擊右上角的「⋮」（三個點）
2. 選擇「擴充功能」→「管理擴充功能」

### 步驟 2：啟用開發人員模式

在擴充功能頁面右上角，找到並開啟「開發人員模式」的開關

### 步驟 3：載入擴充功能

1. 點擊「載入未封裝項目」按鈕
2. 選擇你的專案目錄：`/home/user/task-helper-chrome-ext/v2/dist/`
3. 點擊「選擇資料夾」

### 步驟 4：確認載入成功

- 你應該會看到「Task Helper v2」出現在擴充功能列表中
- 如果有錯誤訊息，請查看下方的「常見問題」

⚠️ **重要提醒：圖示警告**

目前 `public/icons/` 目錄是空的，Chrome 會顯示警告但不影響功能。如果需要圖示：
- 可以先忽略警告，擴充功能仍可正常運作
- 或添加 16x16, 32x32, 48x48, 128x128 的 PNG 圖示到 `v2/public/icons/` 並重新建置

## 🎯 測試擴充功能

### 啟動 Popup

**方式 A：** 點擊擴充功能圖示
1. 在瀏覽器工具列找到擴充功能圖示區（拼圖形狀）
2. 點擊「Task Helper v2」圖示

**方式 B：** 固定到工具列
1. 點擊擴充功能圖示（拼圖形狀）
2. 找到「Task Helper v2」
3. 點擊「📌」釘選圖示
4. 現在可以直接從工具列點擊

### 測試核心功能

1. **首次使用體驗**
   - 首次打開會顯示歡迎 Modal
   - 可選擇「載入範例數據」或「開始使用」
   - 載入範例數據會創建 5 個示範任務

2. **導航系統**
   - 頂部導航欄應該顯示
   - 可點擊切換到不同頁面
   - 當前頁面應該高亮顯示

3. **Dashboard**
   - 應該顯示任務統計卡片（總數、開發中、測試中、已完成）
   - 顯示最近 5 個任務
   - 快速操作按鈕可用
   - 點擊統計卡片可跳轉到任務頁面

4. **任務管理（Tasks 頁面）**
   - 點擊「➕ 新增任務」測試表單
   - 測試 Cmd+K 或 Ctrl+K 開啟 Command Palette
   - 測試批量選擇模式
   - 測試篩選與排序
   - 測試 Pin/Star 功能

5. **設定頁面（Settings）**
   - Jira 設定（Base URL、Confluence URL、前綴）
   - UI 設定（主題切換、動畫速度、顯示密度）
   - 功能設定（通知、自動同步等）
   - 服務管理（新增/刪除服務）
   - 點擊「保存設定」應顯示成功提示

6. **連結管理（Links）**
   - Jira/Confluence 快速連結可點擊
   - 可新增自訂連結
   - 可編輯/刪除自訂連結
   - 連結在新標籤頁打開

7. **Component Showcase**
   - 查看所有基礎組件
   - 測試 Modal、Toast、Dropdown 等互動
   - 測試主題切換

8. **鍵盤快速鍵**
   - `Cmd+K` / `Ctrl+K`：開啟 Command Palette
   - `ESC`：關閉 Modal 或 Command Palette
   - `↑` `↓`：在 Command Palette 中選擇
   - `Enter`：執行選中項目

## 🔄 開發模式（即時預覽）

如果你需要修改程式碼並即時預覽：

### 方式 A：使用 Dev Server（推薦）

```bash
cd v2
npm run dev
```

- 自動開啟 http://localhost:5173
- 修改程式碼會自動重新載入
- 適合開發 UI 和測試功能
- ⚠️ 注意：Chrome Storage API 在此模式下可能無法正常運作

### 方式 B：監聽建置（Chrome Extension 模式）

```bash
cd v2
npm run build -- --watch
```

- 每次儲存檔案自動重新建置
- 建置完成後，在 Chrome 擴充功能頁面點擊「🔄 重新載入」
- Chrome Storage API 正常運作

## 🐛 除錯工具

### 檢視 Popup 的 DevTools

1. 開啟 Popup（點擊擴充功能圖示）
2. 在 Popup 視窗上按右鍵
3. 選擇「檢查」（Inspect）
4. 會開啟 DevTools，可以查看 Console、Network 等

### 檢視背景頁面（如果有）

1. 前往 `chrome://extensions/`
2. 找到「Task Helper v2」
3. 點擊「檢查檢視畫面」下的連結

### 查看 Storage

在 DevTools 的 Console 中執行：

```javascript
// 查看所有儲存的資料
chrome.storage.local.get(null, (data) => console.log(data));

// 查看特定 key
chrome.storage.local.get(['tasks'], (data) => console.log(data));

// 清空所有資料
chrome.storage.local.clear(() => console.log('Storage cleared'));
```

## ⚡ 快速測試檢查清單

### 基本功能
- [ ] Popup 可以正常開啟
- [ ] 導航欄顯示且可切換頁面
- [ ] 首次使用顯示歡迎 Modal

### Dashboard
- [ ] 統計卡片顯示正確數字
- [ ] 最近任務列表正常
- [ ] 快速操作按鈕可用

### 任務管理
- [ ] 可以新增任務
- [ ] 可以編輯任務
- [ ] 可以刪除任務
- [ ] Cmd+K 開啟 Command Palette
- [ ] 可以搜尋任務
- [ ] 批量選擇模式正常
- [ ] 篩選與排序功能正常
- [ ] Pin/Star 功能正常

### 設定頁面
- [ ] 可以修改 Jira 設定
- [ ] 主題切換正常
- [ ] 可以管理服務
- [ ] 保存設定成功

### 連結管理
- [ ] Jira/Confluence 連結可點擊
- [ ] 可以新增自訂連結
- [ ] 可以編輯/刪除連結

### 通用
- [ ] Toast 通知正常顯示
- [ ] 資料持久化（重新開啟 Popup 後資料仍存在）
- [ ] 無 Console 錯誤

## 🔧 常見問題

### Q: 載入時顯示「manifest version 2 is deprecated」
**A:** 我們使用的是 Manifest V3，這是最新版本，不會有此問題。

### Q: 圖示顯示為空白
**A:** 目前沒有提供圖示檔案，但不影響功能。可添加圖示到 `v2/public/icons/`。

### Q: 修改程式碼後沒有更新
**A:**
1. 重新執行 `npm run build`
2. 在 `chrome://extensions/` 頁面點擊「🔄」重新載入擴充功能

### Q: Chrome Storage 沒有資料
**A:**
1. 檢查 DevTools Console 是否有錯誤
2. 確認 manifest.json 中有 `"storage"` 權限
3. 嘗試清空並重新建立資料

### Q: Popup 視窗太小或太大
**A:** 在 `v2/src/App.vue` 中調整 `.app-container` 的 `min-height` 和 `width`。

## 📊 效能檢查

### 檢查打包大小

```bash
cd v2
npm run build
```

查看建置輸出，主要檔案大小：
- `popup.js`: ~109KB (gzip: ~43KB) ✅
- `Tasks.js`: ~31KB (gzip: ~10KB) ✅

### 記憶體使用

在 Chrome Task Manager 中查看：
1. Chrome 選單 → 更多工具 → 工作管理員
2. 找到「擴充功能: Task Helper v2」
3. 查看記憶體使用量

## 🚀 準備發布

當你準備發布到 Chrome Web Store：

1. 確保所有功能都已測試
2. 添加適當的圖示（16, 32, 48, 128 px）
3. 更新 `manifest.json` 中的描述和版本號
4. 建立發布版本：`npm run build`
5. 將 `dist/` 目錄打包成 ZIP
6. 上傳到 Chrome Web Store

## 📝 開發筆記

- **開發環境**: `npm run dev` - 在瀏覽器中預覽（http://localhost:5173）
- **建置測試**: `npm run build` - 建置並載入到 Chrome
- **型別檢查**: `npm run type-check` - 檢查 TypeScript 錯誤
- **完整建置**: `npm run build:check` - 型別檢查 + 建置

---

**祝測試順利！** 🎉

如有問題，請查看 Console 錯誤訊息或聯繫開發團隊。
