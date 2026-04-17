---
name: liferay-object-management
description: Dynamic generation, publication, and management workflow for Object Definitions in Liferay DXP.
---

# Liferay Object Management Skill (JS/Ajax Version)

This skill is for dynamically generating, publishing, and managing Object Definitions on Liferay DXP. It uses pure JavaScript (Fetch API) running on the browser or fragments without depending on Node.js or Python.

## Technical Constraints
- **Language**: JavaScript (ES6+)
- **Communication**: Fetch API / XMLHttpRequest (Ajax)
- **Prohibitions**: Dependencies on Node.js modules, TypeScript, Python, and external libraries (jQuery, etc.).

## Execution Protocol (Workflow)

When performing object operations, always adhere to the following steps and **output the progress to the console.**

### 0. Environment Setting Definition [Strict Compliance]
Define variables at the beginning of the code in the following order of priority.
1. **`.env.config` file**: If it exists, read its value with the highest priority.
2. **Hard-coded default values**: Set as a fallback if the file does not exist or the value is not defined.

**Implementation Protocol**:
If `.env.config` does not exist in the root directory, automatically generate the file with the following sample content.
```text
LIFERAY_BASE_URL=http://localhost:8080
# Add other necessary authentication information
```

### 1. Check Object Existence (GET)
Use `/o/object-admin/v1.0/object-definitions?filter=name eq '${definition.name}'` to check if an object with the same name already exists.

### 2. Create Object Definition (POST)
If it does not exist, send a detailed payload to `/o/object-admin/v1.0/object-definitions`.
- **Important**: Always generate (or specify) and include a unique value for `externalReferenceCode` (ERC).

### 3. Publish Object (POST)
Since it is in the `draft` state immediately after creation, publishing is required before adding entries.
- **Endpoint**: `/o/object-admin/v1.0/object-definitions/{objectDefinitionId}/publish`

### 4. Add Entry (POST)
After publishing, send data to `/o/c/{pluralName}` or the `restContextPath` specified in the object definition.

---

## Detailed References and Samples

### Object Definition Payload Configuration Example (More Detailed Example)
This is an example of a JSON structure combining various business types (Text, LongText, Date, Keyword, etc.) when creating an object.

```json
{
  "active": true,
  "name": "Email",
  "label": { "en_US": "Email", "ja_JP": "Email" },
  "pluralLabel": { "en_US": "Emails", "ja_JP": "Emails" },
  "externalReferenceCode": "EMAIL_OBJECT_ERC",
  "scope": "company",
  "titleObjectFieldName": "subject",
  "objectFields": [
    {
      "name": "sender",
      "label": { "en_US": "Sender" },
      "DBType": "String",
      "businessType": "Text",
      "required": true,
      "indexed": true,
      "type": "String"
    },
    {
      "name": "subject",
      "label": { "en_US": "Subject" },
      "DBType": "String",
      "businessType": "Text",
      "required": true,
      "indexed": true,
      "type": "String"
    },
    {
      "name": "body",
      "label": { "en_US": "Body" },
      "DBType": "String",
      "businessType": "LongText",
      "required": true,
      "type": "String"
    },
    {
      "name": "timestamp",
      "label": { "en_US": "Timestamp" },
      "DBType": "Date",
      "businessType": "Date",
      "required": true,
      "indexed": true,
      "type": "Date"
    },
    {
      "name": "emailActionType",
      "label": { "en_US": "Email Action Type" },
      "DBType": "String",
      "businessType": "Text",
      "required": true,
      "indexed": true,
      "indexedAsKeyword": true,
      "type": "String"
    }
  ]
}
```
- **`indexedAsKeyword: true`**: Important when you want to filter or search by specific keywords, such as `emailActionType`.
- **`businessType: "LongText"`**: Used for fields storing long texts, such as the body of an email.

### Bulk Add Entries (Bulk/Populate)
Here is a JavaScript example for inserting dummy data or external data in bulk after the object definition is published.

```javascript
const populateObjectEntries = async (pluralName, records) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'x-csrf-token': Liferay.authToken
  };

  const endpoint = `/o/c/${pluralName}`;
  console.info(`Adding ${records.length} records to ${endpoint}...`);

  for (const [index, record] of records.entries()) {
    try {
      // It is recommended to include a unique ERC in each entry
      if (!record.externalReferenceCode) {
        record.externalReferenceCode = `entry-${Date.now()}-${index}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(record)
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      console.info(`[${index + 1}/${records.length}] Added: ${record.subject || 'Record'}`);
    } catch (error) {
      console.error(`Failed to add record ${index + 1}:`, error);
    }
  }
  console.info("Population complete.");
};
```

### Handling Relationship Fields
When relating to other objects or accounts, the field name takes the format `r_{relationshipName}_{relatedObject}Id`.
- **Example**: `r_accountToEmail_accountEntryId`: `12345` (Integer ID)
- **Note**: Pass the ID directly as a number; it does not need to be enclosed in an object.

### Implementation Sample (Pure JS - Liferay Fragment Context)

```javascript
const createObjectFullFlow = async (definition) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'x-csrf-token': Liferay.authToken
  };

  // 1. Create
  console.info(`Creating object definition: ${definition.name}...`);
  const createRes = await fetch('/o/object-admin/v1.0/object-definitions', {
    method: 'POST',
    headers,
    body: JSON.stringify(definition)
  });
  const newObj = await createRes.json();
  const objId = newObj.id;

  // 2. Publish
  console.info(`Publishing object (ID: ${objId})...`);
  await fetch(`/o/object-admin/v1.0/object-definitions/${objId}/publish`, {
    method: 'POST',
    headers
  });

  // 3. Wait for publication to complete (Simple polling)
  let status = 'draft';
  while (status !== 'approved') {
    const checkStatus = await fetch(`/o/object-admin/v1.0/object-definitions/${objId}`, { headers });
    const data = await checkStatus.json();
    status = data.status.code === 0 ? 'approved' : 'draft';
    if (status !== 'approved') await new Promise(r => setTimeout(r, 2000));
  }
  console.info("Object is now published and ready.");
};
```