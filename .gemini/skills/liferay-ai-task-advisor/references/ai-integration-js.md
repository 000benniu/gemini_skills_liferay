# AI Integration Implementation (JS Pattern)

## 1. Data Fetch & Prompt Construction

```javascript
const handleAiRecommendation = async () => {
    // 1. Data Retrieval
    const manuals = JSON.parse(localStorage.getItem('task_manuals') || '[]');
    const incidents = JSON.parse(localStorage.getItem('servicenow_incidents') || '[]');

    // 2. Prompt Construction
    const systemPrompt = `...`; // SKILL.mdのテンプレートを参照
    const userPrompt = `
        【業務マニュアル（SOP）】
        ${manuals.map(m => `- ${m.title}: ${JSON.stringify(m.workflow)}`).join('\n')}
        
        【ServiceNow インシデント】
        ${incidents.map(i => `- ${i.number}: ${i.short_description}`).join('\n')}
    `;

    // 3. GPT-4o-mini Call (via gpt-4o-mini-caller)
    const result = await callGpt4oMini(systemPrompt, userPrompt);

    // 4. Structured UI Render
    renderAiResults(result.recommendations);
};
```

## 2. Rendering Structured JSON

AIから返ってきた構造化JSONをパースし、`modern-ux-core-protocol` に基づいて描画します。

```javascript
const renderAiResults = (recommendations) => {
    const html = `
        <div class="lc-ai-recommendation">
            ${recommendations.map(rec => `
                <div class="lc-ai-item">
                    <span class="lc-ai-item__rank">${rec.rank}</span>
                    <h4 class="lc-ai-item__title">${rec.title}</h4>
                    <div class="lc-ai-item__next-action">
                        <i class="fa-solid fa-directions"></i>
                        <p>${rec.next_action}</p>
                    </div>
                    <p class="lc-ai-item__reason">${rec.reason}</p>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('ai-result-container').innerHTML = html;
};
```
