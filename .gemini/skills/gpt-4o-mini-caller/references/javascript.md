# Calling gpt-4o-mini in JavaScript

## Using Fetch API

```javascript
async function callGpt4oMini(systemPrompt, userPrompt, apiKey) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
```

## Using jQuery AJAX

```javascript
function callGpt4oMiniAjax(systemPrompt, userPrompt, apiKey) {
  return $.ajax({
    url: "https://api.openai.com/v1/chat/completions",
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    contentType: "application/json",
    data: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    })
  });
}
```
