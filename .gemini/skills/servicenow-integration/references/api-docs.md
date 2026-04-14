# ServiceNow API Reference (Incident Table)

## 1. Field Mappings

### State (`incident_state` / `state`)
| Value | Label | UI Class |
| :--- | :--- | :--- |
| `1` | 新規 (New) | `status-new` |
| `2` | 対応中 (In Progress) | `status-in-progress` |
| `3` | 保留 (On Hold) | `status-on-hold` |
| `6` | 解決済 (Resolved) | `status-resolved` |
| `7` | 完了 (Closed) | `status-closed` |
| `8` | キャンセル (Canceled) | `status-canceled` |

### Urgency (`urgency`)
| Value | Label | UI Class |
| :--- | :--- | :--- |
| `1` | 高 (High) | `urgency-high` |
| `2` | 中 (Medium) | `urgency-medium` |
| `3` | 低 (Low) | `urgency-low` |

### Category (`category`)
- `hardware`: ハードウェア
- `software`: ソフトウェア
- `network`: ネットワーク
- `inquiry`: 問い合わせ

## 2. Response Structure (Nested Objects)
以下のフィールドはオブジェクト形式で返されます。
- `caller_id`, `opened_by`, `resolved_by`, `closed_by`, `sys_domain`, `company`
- **アクセス例**: `incident.caller_id.value` (Sys ID を取得する場合)

## 3. Querying Examples (`sysparm_query`)
- `incident_state!=7^ORDERBYDESCopened_at` (完了以外を最新順に)
- `short_descriptionCONTAINSkeyword^ORdescriptionCONTAINSkeyword` (検索)
