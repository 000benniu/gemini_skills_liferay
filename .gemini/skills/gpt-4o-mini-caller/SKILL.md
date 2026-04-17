---
name: gpt-4o-mini-caller
description: Guide and code examples for calling OpenAI's gpt-4o-mini model. Please use this when you need to integrate gpt-4o-mini into applications with Gemini CLI, especially in C# (ASP.NET/Unity) or JavaScript/AJAX environments.
---

# GPT-4o-mini Caller

## Overview

This skill provides the necessary parameters, configurations, and implementation patterns to interact with OpenAI's `gpt-4o-mini` model. It is optimized for JSON output and efficient token usage.

### 0. Environment Setting Definition [Strict Compliance]
At the beginning of all scripts (JS/Python, etc.), define variables in the following order of priority:
1. **`.env.config` file**: If it exists, read its value with the highest priority.
2. **Hard-coded default values**: Use as a fallback if the file does not exist.

**Target**: `OPENAI_API_KEY`

If `.env.config` does not exist in the root directory, automatically generate it with the following sample content:
```text
OPENAI_API_KEY=your-openai-api-key-here
```

## Core Parameters

- **Model**: `gpt-4o-mini` (Required)
- **API Key**: Passed in the `Authorization` header as `Bearer {API_KEY}`. If `OPENAI_API_KEY` exists in `.env.config`, please hardcode it directly into the JS file temporarily (as a tmp value) to set it.
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
