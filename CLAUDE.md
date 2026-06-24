# Global Journey

環球旅程：世界地標 3D 浮雕 MidJourney Prompt 生成器。

## Tech Stack

- **Runtime**: Vite 6 + vanilla TypeScript（無框架）
- **Map**: Leaflet + leaflet.markercluster（OpenStreetMap 免費圖層）
- **Storage**: IndexedDB via `idb-keyval`（書籤、生成歷史、路線）
- **AI**: Gemini 2.0 Flash（BYOK，localStorage 存 API key）
- **Deploy**: Vercel（靜態站，`vercel.json` 零設定）

## Project Structure

```
src/
├── main.ts                    # Entry: init all components
├── types/index.ts             # Landmark, StyleTemplate, RouteItem, etc.
├── data/
│   ├── landmarks.ts           # 97 landmarks (id 1-97) with lat/lng/features
│   ├── continents.ts          # 7 continent definitions
│   └── styles.ts              # 5 style templates
├── components/
│   ├── CardGrid.ts            # Landmark cards, bookmark, style-aware prompts
│   ├── ContinentBar.ts        # Continent filter pills
│   ├── MapView.ts             # Leaflet map (lazy init on toggle)
│   ├── StylePicker.ts         # 5-style selector, linked to CardGrid
│   ├── RoutePlanner.ts        # Drag-drop route builder + .txt export
│   ├── AiGenerator.ts         # Gemini custom prompt generation
│   ├── VideoTransition.ts     # Two-landmark transition prompt
│   ├── KeyPanel.ts            # API key BYOK panel
│   └── Toast.ts               # Notification singleton
├── services/
│   ├── api-key.ts             # BYOK localStorage management
│   ├── gemini.ts              # Gemini API caller
│   └── db.ts                  # IndexedDB stores (bookmarks, history, route)
├── utils/
│   ├── html.ts                # escapeHtml, copyToClipboard, $()
│   ├── transition-directions.ts  # 15 continent-pair Chinese direction strings
│   └── style-composer.ts      # landmark + style → composed prompt
└── styles/                    # 11 CSS modules (tokens → base → components)
```

## Landmark Data

97 個地標，分佈：Asia 25 / Europe 20 / Africa 15 / S.America 12 / N.America 15 / Oceania 10。

每筆包含：`id, continent, city, country, nameEn, nameZh, lat, lng, features, promptEn, promptZh, animationPrompt`

新增地標時接續 id 98+，遵循既有 prompt 格式。

## Key Patterns

- **BYOK**: API key 存 localStorage key `gemini_api_key_gj`，不經後端
- **Style linking**: StylePicker 切換 → `onStyleChange` callback → CardGrid re-render
- **Leaflet lazy init**: 地圖面板點擊才建立，避免容器尺寸問題
- **Event delegation**: CardGrid 用單一 click handler 處理 copy/bookmark/toggle

## Commands

```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # Production build → dist/
npx tsc --noEmit # Type check only
```

## Repo

- GitHub: https://github.com/Ttingyu1123/global-journey
- Branch: master
