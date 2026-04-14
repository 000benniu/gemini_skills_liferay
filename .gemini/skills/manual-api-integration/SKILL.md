---
name: manual-api-integration
description: 外部システムから業務マニュアル一覧を取得・表示するためのスキル。API エンドポイントや、Liferay 上でのモダンな表示ロジックを定義します。
---

# Manual API Integration Guide

## 1. Overview
このスキルは、外部マニュアル管理システムから業務マニュアル（SOP）の一覧を取得し、Liferay DXP 上で美しく表示するための手順を定義します。

### 0. 環境設定の定義【絶対遵守】
すべてのスクリプト（JS/Python等）の先頭で、以下の優先順位で変数を定義すること。
1. **`.env.config` ファイル**: 存在すれば、その値を最優先で読み込む。
2. **ハードコードされたデフォルト値**: ファイルがない場合のフォールバックとして使用。

**対象**: `MANUAL_API_ENDPOINT`

ルートディレクトリに `.env.config` が存在しない場合、以下のサンプル内容で自動生成すること。
```text
MANUAL_API_ENDPOINT=https://randomapi.com/api/hszdw6mc?key=LESD-D3KS-40OF-62DB
```

## 2. API Configuration
以下のエンドポイントを使用し、`.env.config` の値を優先します。

| Parameter | Env Variable | Default Fallback |
| :--- | :--- | :--- |
| `Endpoint` | `MANUAL_API_ENDPOINT` | `https://randomapi.com/api/hszdw6mc?key=LESD-D3KS-40OF-62DB` |

### Auth
この API は URL パラメータに `key` が含まれているため、追加の認証ヘッダーは不要です。

## 3. Data Structure
レスポンスは以下の階層構造を持ちます：
- `results[0].manuals`: マニュアルの配列。
- **Manual Data Fields**:
  - `manual_id`: SOP識別子 (例: SOP-100)
  - `title`: マニュアル名
  - `meta`: カテゴリー、優先度(priority)、著者、バージョン、最終確認日(last_review)を含む。
  - `workflow`: 手順の配列（`step`, `task`, `assigned_role`, `is_critical` を含む）。
  - `contact`: 担当チーム(`team`)と内線番号(`internal_line`)。

## 4. UI/UX Standards (modern-ux-core-protocol)
マニュアル情報を画面に表示する際は、`modern-ux-core-protocol` を厳守し、**デフォルトは日本語**で表示します。

## 5. Persistence (LocalStorage)
取得したマニュアルデータは、`localStorage` に保存します。
```javascript
localStorage.setItem('task_manuals', JSON.stringify(results[0].manuals));
```

### Interaction Rules **【絶対遵守】**
1. **List View**: カテゴリー（`meta.category`）や優先度（`meta.priority`）に応じたバッジ表示を行います。
2. **Detail Action (Modal)**: クリック時に以下の要素を含む詳細モーダルを表示します。
   - **Constraint**: モーダルの最大高さは **700px** とし、内容が超過する場合は内部スクロールを有効にすること。
   - **Meta Grid**: カテゴリー、バージョン、著者、優先度を4カラム程度のグリッドで整理。
   - **Workflow Visualization**: `workflow` 配列をループし、ステップ番号とタスク、役割を表示。`is_critical: true` のステップは赤色のアクセントや警告アイコンで強調する。
   - **Emergency Contact**: 下部に担当チームと内線番号を配置する。

### Visual Specs 【絶対遵守】
- **Grid Layout**: 非対称グリッドや、モーダル内でのカード形式のレイアウト。
- **Scrolling & Overflow**: モーダル本体（`.lux-modal__content`）に `display: flex; flex-direction: column; max-height: 100%; overflow: hidden;` を適用し、ボディ部分（`.lux-modal__body`）に `flex: 1 1 auto; overflow-y: auto;` を設定することで、コンテンツが超過した場合に適切に内部スクロールさせること。
- **Workflow Styling**: ステップごとに背景色やボーダー（例: `border-left`）を変え、手順の連続性を視覚化する。
- **Critical Indicators**: `is_critical` フラグに基づき、視覚的に警告（例: `#ff4757` の色利用）を付与する。
- **Animation**: モーダル表示時のズームインや、リスト表示時のフェードインを実装する。

## 5. References
フィールドマッピングや詳細なクエリ例については、`references/api-docs.md` を参照してください。
