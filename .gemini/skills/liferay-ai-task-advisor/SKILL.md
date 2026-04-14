---
name: liferay-ai-task-advisor
description: AI-driven task recommendation pattern for Liferay DXP.
---

# Liferay AI Task Advisor

## 1. Overview
このスキルは、Liferay DXP 上で AI（`gpt-4o-mini`）を活用し、複数の業務データソースから「ユーザーが今日優先すべきタスク」を抽出・提案するための実装指針を定義します。

### 0. 環境設定の定義【絶対遵守】
すべてのスクリプト（JS/Python等）の先頭で、以下の優先順位で変数を定義すること。
1. **`.env.config` ファイル**: 存在すれば、その値を最優先で読み込む。
2. `.env.config` にキーが存在する場合は、一時的（tmp値）にJSファイル内に直接ハードコーディングして設定してください。
3. **ハードコードされたデフォルト値**: ファイルがない場合のフォールバックとして使用。

**対象**: `OPENAI_API_KEY`

ルートディレクトリに `.env.config` が存在しない場合、以下のサンプル内容で自動生成すること。
```text
OPENAI_API_KEY=your-openai-api-key-here
```

## 2. Core Logic Pattern

### 2.1 Data Extraction
`localStorage` 等に保存された複数の JSON データを抽出し、AI が理解しやすいテキスト形式（Prompt）に整形します。
- **ServiceNow**: `number`, `short_description`, `urgency` を抽出。
- **Manuals**: `title`, `workflow` (ステップ詳細) を抽出し、実行可能なアドバイスの根拠とします。

### 2.2 Prompt Engineering (JSON Control) **【絶対遵守】**
`gpt-4o-mini` を呼び出す際は、必ず以下のシステムプロンプト構成を使用し、構造化された JSON レスポンスを取得してください。

#### System Prompt Template
```text
あなたは優秀な業務アシスタントAIです。提供された[データソース]を分析し、優先すべきタスクTOP 3を提案してください。

【回答ルール】
1. title: 「[管理番号] 概要」の形式。
2. reason: なぜその順位なのかの論理的な根拠。
3. next_action: 関連するマニュアルの手順を具体的に引用し、「次は何をすべきか」の具体的な指示。

回答は必ず以下のJSON形式で出力してください：
{
  "recommendations": [
    { "rank": "TOP 1", "title": "...", "reason": "...", "next_action": "..." }
  ]
}
```

## 3. UI/UX Standards (modern-ux-core-protocol)
AI の提案をダッシュボードに表示する際は、以下の視覚要素を組み込んでください。

> [!IMPORTANT]
> **【絶対遵守】インライン表示の徹底**
> AIが推奨した結果は、ポップアップ（モーダル）ではなく、**必ず画面上の指定のコンテナ領域（例：インラインの `div`）に動的に表示**させてください。提案表示後はボタンを非表示にするなどの工夫を行い、ユーザーの操作を妨げないようにします。

### Visual Components
- **Inline Container**: 結果を表示するための専用コンテナ（`display: none` 等で初期非表示）を用意し、AI結果をその中に展開します。
- **AI Card**: グラデーション背景（`#ffffff` to `#f0f7ff`）と `box-shadow` を用いた「インテリジェンス」を感じさせるデザイン。
- **Highlight Box**: 「次の具体的アクション」は、青色（`#0b63ce`）の背景色とアイコン（`.fa-directions`）を用いて強調表示。
- **Loading State**: 解析中はスピンアイコンと「AIが分析中...」のステータスをインラインのコンテナに表示し、ユーザーの不安を解消。

## 4. Implementation Example (JavaScript)
[references/ai-integration-js.md](references/ai-integration-js.md) を参照して、`gpt-4o-mini-caller` スキルと連携した非同期通信の実装を行ってください。

> [!CAUTION]
> **【絶対遵守】フォールバック（モック）実装の禁止**
> AI API呼び出しが失敗した際（`catch` ブロック等）に、ダミーデータやモックを利用した「フォールバック表示（Simulation）」を実装してはいけません。エラー発生時は、エラーログを出力し、ユーザーにはシンプルに「AIによるタスク提案の取得に失敗しました」等のエラーメッセージのみを表示してください。

## 5. Post-Implementation Validation (JS Check) **【絶対遵守】**
本スキルを利用して既存または新規の JS ファイル（例: `index.js`）を生成・修正した後は、**必ず以下のワークフローを実行して構文の正規性をチェック**してください。

1. **構文（Syntax）チェック**:
   JS ファイル内に、未エスケープによるバッククォートの破綻や、波括弧・丸括弧の不整合（Unexpected token）がないか、コード全体を再確認すること。
2. **ツールの活用**:
   必要に応じて `run_shell_command` ツールで `node -c <ファイルパス>` （Node.js 構文チェック）を実行し、文法エラーがないことを**必ずプロンプト内で検証**してからタスクを完了とすること。
