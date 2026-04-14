---
name: gpt-4o-mini-caller
description: OpenAIのgpt-4o-miniモデルを呼び出すためのガイドとコード例です。Gemini CLIでgpt-4o-miniをアプリケーションに組み込む必要がある場合、特にC#（ASP.NET/Unity）またはJavaScript/AJAX環境においてご利用ください。
---

# GPT-4o-mini Caller

## Overview

This skill provides the necessary parameters, configurations, and implementation patterns to interact with OpenAI's `gpt-4o-mini` model. It is optimized for JSON output and efficient token usage.

### 0. 環境設定の定義【絶対遵守】
すべてのスクリプト（JS/Python等）の先頭で、以下の優先順位で変数を定義すること。
1. **`.env.config` ファイル**: 存在すれば、その値を最優先で読み込む。
2. **ハードコードされたデフォルト値**: ファイルがない場合のフォールバックとして使用。

**対象**: `OPENAI_API_KEY`

ルートディレクトリに `.env.config` が存在しない場合、以下のサンプル内容で自動生成すること。
```text
OPENAI_API_KEY=your-openai-api-key-here
```

## Core Parameters

- **Model**: `gpt-4o-mini` (Required)
- **API Key**: Passed in the `Authorization` header as `Bearer {API_KEY}`. `.env.config` に `OPENAI_API_KEY` が存在する場合は、一時的（tmp値）にJSファイル内に直接ハードコーディングして設定してください。
- **Messages**: An array of message objects (role: "system", "user", "assistant").
- **Temperature**: Default 0.8 (Creative) or 0.5 (Predictable/JSON).
- **Response Format**: Use `{"type": "json_object"}` for structured data.
- **Max Tokens**: Optional, depends on the use case.

## Implementation Examples
- **JavaScript (Fetch/AJAX)**: See [references/javascript.md](references/javascript.md)

## Usage Scenarios

1. **JSON Generation**: Best for extracting structured data from text.
2. **Fast Completions**: Low latency for real-time interactions.
3. **Batch Processing**: Cost-effective for large-scale text analysis.
