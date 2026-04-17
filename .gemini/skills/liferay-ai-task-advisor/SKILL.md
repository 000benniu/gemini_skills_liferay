---
name: liferay-ai-task-advisor
description: AI-driven task recommendation pattern for Liferay DXP.
---

# Liferay AI Task Advisor

## 1. Overview
This skill defines the implementation guidelines for extracting and proposing "tasks the user should prioritize today" from multiple business data sources, utilizing AI (`gpt-4o-mini`) on Liferay DXP.

### 0. Environment Setting Definition [Strict Compliance]
At the beginning of all scripts (JS/Python, etc.), define variables in the following order of priority:
1. **`.env.config` file**: If it exists, read its value with the highest priority.
2. If the key exists in `.env.config`, please hardcode it directly into the JS file temporarily (as a tmp value) to set it.
3. **Hard-coded default values**: Use as a fallback if the file does not exist.

**Target**: `OPENAI_API_KEY`

If `.env.config` does not exist in the root directory, automatically generate it with the following sample content:
```text
OPENAI_API_KEY=your-openai-api-key-here
```

## 2. Core Logic Pattern

### 2.1 Data Extraction
Extract multiple JSON data saved in `localStorage`, etc., and format them into a text format (Prompt) that AI can easily understand.
- **ServiceNow**: Extract `number`, `short_description`, `urgency`.
- **Manuals**: Extract `title`, `workflow` (step details), and use them as the basis for actionable advice.

### 2.2 Prompt Engineering (JSON Control) **[Strict Compliance]**
When calling `gpt-4o-mini`, you must use the following system prompt structure to obtain a structured JSON response.

#### System Prompt Template
```text
You are an excellent business assistant AI. Analyze the provided [data source] and propose the TOP 3 tasks that should be prioritized.

[Response Rules]
1. title: Format as "[Management Number] Overview".
2. reason: The logical basis for why it is ranked in that position.
3. next_action: Specifically quote the steps from the related manual and give clear instructions on "what to do next."

Responses must be output in the following JSON format:
{
  "recommendations": [
    { "rank": "TOP 1", "title": "...", "reason": "...", "next_action": "..." }
  ]
}
```

## 3. UI/UX Standards (modern-ux-core-protocol)
When displaying the AI's proposals on the dashboard, incorporate the following visual elements.

> [!IMPORTANT]
> **[Strict Compliance] Enforcement of Inline Display**
> The results recommended by the AI must **always be dynamically displayed in a designated container area on the screen (e.g., an inline `div`)**, rather than in a popup (modal). Take measures such as hiding the button after displaying the proposal so as not to hinder the user's operation.

### Visual Components
- **Inline Container**: Prepare a dedicated container (initially hidden using `display: none`, etc.) to display the results, and expand the AI results within it.
- **AI Card**: A design that evokes a sense of "intelligence" using a gradient background (`#ffffff` to `#f0f7ff`) and `box-shadow`.
- **Highlight Box**: Highlight "the next specific action" using a blue (`#0b63ce`) background color and an icon (`.fa-directions`).
- **Loading State**: Display a spinner icon and the status "AI is analyzing..." in the inline container during analysis to eliminate user anxiety.

## 4. Implementation Example (JavaScript)
Refer to [references/ai-integration-js.md](references/ai-integration-js.md) to implement asynchronous communication in coordination with the `gpt-4o-mini-caller` skill.

> [!CAUTION]
> **[Strict Compliance] Prohibition of Fallback (Mock) Implementation**
> Do not implement a "fallback display (Simulation)" using dummy data or mocks when the AI API call fails (e.g., in a `catch` block). In the event of an error, output an error log and simply display an error message to the user, such as "Failed to retrieve the AI task proposal."

## 5. Post-Implementation Validation (JS Check) **[Strict Compliance]**
After creating or modifying an existing or new JS file (e.g., `index.js`) using this skill, **you must execute the following workflow to check the syntactic correctness.**

1. **Syntax Check**:
   Re-check the entire code to ensure there are no unescaped backtick breakdowns or curly brace/parenthesis inconsistencies (Unexpected token) within the JS file.
2. **Use of Tools**:
   If necessary, use the `run_shell_command` tool to execute `node -c <file path>` (Node.js syntax check), and **be sure to verify within the prompt** that there are no syntax errors before marking the task as complete.
