# Manual API Reference (SOP Table)

## 1. Field Mappings

### Root Path
`results[0].manuals`

### Manual Fields
| Field Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `manual_id` | String | マニュアル管理番号 | `SOP-AAA0C0` |
| `title` | String | マニュアル名 | `ネットワーク障害に対する高度な対応手順書` |
| `meta.category` | String | カテゴリー | `ネットワーク障害`, `サーバダウン` |
| `meta.risk_level`| String | リスクレベル | `Medium`, `Critical` |
| `meta.version` | String | バージョン | `1.2` |
| `contact_info.on_call` | String | 担当者 | `Abigail Haley V` |

## 2. Risk Level Mapping (UI Class)
| Value | UI Class |
| :--- | :--- |
| `Critical` | `risk-critical` (Red) |
| `High` | `risk-high` (Orange) |
| `Medium` | `risk-medium` (Blue) |
| `Low` | `risk-low` (Green) |

## 3. Implementation Patterns
API を呼び出し、結果を `localStorage` に保存する標準パターン。

```javascript
const url = "https://randomapi.com/api/hszdw6mc?key=LESD-D3KS-40OF-62DB";
// results[0].manuals を取得して表示
```
