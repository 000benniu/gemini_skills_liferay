---
name: liferay-fragment-packager
description: Expert guidance and tools for packaging Liferay Fragment Collections into ZIP files for manual import. Ensures the correct root directory structure required by Liferay's Site Builder.
---

# Liferay Fragment Packager Skill

This skill defines the procedures and tools to correctly generate a ZIP file that can be imported into Liferay DXP's "Site Builder > Page Fragments".

## 1. Critical Structure Rule [Strict Compliance]

The Liferay importer is extremely strict about the structure inside the ZIP file. It is necessary to reproduce the following structure "exactly word for word".

### 1.1 Fragment Collection ZIP (Recommended)
When importing an entire collection, you must **always include the root directory (a folder with the same name as the collection name)**.

```
collection-name.zip
└── collection-name/           <-- Root directory is required
    ├── collection.json       <-- Collection metadata
    └── fragments/            <-- Parent folder for each fragment
        ├── fragment-1/
        │   ├── fragment.json
        │   ├── index.html
        │   ├── index.css
        │   ├── index.js
        │   ├── configuration.json
        │   └── thumbnail.png
        └── fragment-2/
            └── ...
```

### 1.2 Individual Fragment ZIP
When importing only a single fragment:
```
fragment-name.zip
└── fragment-name/            <-- Folder with the same name as the fragment name is required
    ├── fragment.json
    ├── index.html
    ├── index.css
    ├── index.js
    ├── configuration.json
    └── thumbnail.png
```

### 1.3 Naming Convention [Strict Compliance]
To prevent errors due to fragment name duplication, **always follow "8. Naming Convention" in `liferay-modern-fragment-guide` for naming.**

## 2. Packaging Workflow

### Step 1: Prepare Metadata & Visuals [Strict Compliance]
Before importing, metadata, icons, and thumbnail images must be properly prepared.
- **Naming Convention**: Adhere to **"8. Naming Convention" in `liferay-modern-fragment-guide`**.
- **Metadata (`fragment.json`)**: Set `"icon": "third-party"`, etc., according to **"7. Metadata & Visuals" in `liferay-modern-fragment-guide`**.
- **Thumbnail Image (`thumbnail.png`)**: Following **"7.2 Thumbnail Image" in `liferay-modern-fragment-guide`**, use the dedicated Python script to generate and place the image.

### Step 2: Content Filtering [Important]
Do not include unnecessary files in the ZIP other than `collection.json`, `fragments/`, and `resources/`.

### Step 3: ZIP Creation [Strict Compliance]
Standard OS right-click "ZIP creation" or the shell command `Compress-Archive` may generate an archive that Liferay cannot interpret, so **use the provided Python script.**

## 3. Tool Usage

### Scripts
- `scripts/create_zip.py`: Packages the specified directory into a Liferay-compatible ZIP with a root folder. This script automatically filters out unnecessary files.

```bash
python .gemini/skills/liferay-fragment-packager/scripts/create_zip.py <source_dir> <output_zip_name>
```

## 4. References
For detailed deployment guides, please refer to `references/LIFERAY_DEPLOYMENT_GUIDE.md`.