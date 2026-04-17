# Liferay Demo Construction Project (Skill-Driven Architecture)

## Overview

This project is a workspace for rapidly and autonomously constructing a high-end Liferay DXP demo environment using AI (Gemini CLI).
While building the demo environment is the goal of this project, its most significant technical feature is the adoption of a **"Skill-Driven Architecture"**.

By referring to the structure and execution examples in this repository, you can learn "how to define Gemini CLI's skill features and how to combine them to have AI execute complex business requirements (product-specific specifications, external system integration, unique deployment flows, etc.)."

## What is a "Skill"?

In Gemini CLI, a "Skill" encapsulates "expertise, rules, and procedures" for accomplishing a specific task.
Although AI possesses general coding knowledge, to accurately enforce compliance with a specific product (Liferay's unique specifications) or a specific company's rules (external API specifications, etc.), detailed prerequisites must be instructed each time.

By defining skills individually (under `.gemini/skills/`) and having the AI explicitly call them in the prompt, there are the following advantages:
1. **Best Practices**: It instructs the AI to comply with Liferay's best practices and the API specifications of specific systems.
2. **Prompt Simplification**: Users only need to instruct, "Use the 〇〇 skill to create 〇〇," eliminating the need to input lengthy and complex prerequisites for each chat.
3. **Reusability and Modularization**: Once specialized knowledge (a skill) is defined, it can be reused like a component in other tasks or different projects.

## Examples of Skill Utilization in This Project

In this project, the elements necessary for building an internal portal are broken down and defined into multiple skills.

- `modern-ux-core-protocol`: Core UI/UX and Design Standards (CSS, JS, HTML, Mobile-First).
- `liferay-modern-fragment-guide`: Unique design and implementation rules for creating modern Liferay fragments (HTML/CSS/JS).
- `liferay-nav-template-generator`: Liferay Navigation Template Generator based on FreeMarker and NavItem API.
- `liferay-api-best-practices`: Best practices for utilizing Liferay DXP Headless APIs (Delivery, Objects, Commerce, User).
- `liferay-object-management`: Dynamic generation, publication, and management workflow for Object Definitions in Liferay DXP.
- `liferay-ai-task-advisor`: AI-driven task recommendation pattern for Liferay DXP.
- `gpt-4o-mini-caller`: Guide and code examples for calling the OpenAI gpt-4o-mini model.
- `servicenow-integration`: Procedures and authentication specifications for retrieving and displaying ServiceNow incident information via API.
- `manual-api-integration`: Specifications for retrieving and displaying data from an external business manual system via API.
- `liferay-fragment-automation-core`: Scripts and procedures for automatically deploying the created artifacts to the Liferay environment.
- `liferay-nav-template-deployer`: Automatic deployment guide for navigation menu display templates (ADT) in Liferay DXP.
- `liferay-fragment-packager`: Expert guidance and tools for packaging Liferay Fragment Collections into ZIP files for manual import.

## Execution Example (Practical Usage of Skills)

Users input "scenarios (prompts)" like the following to the Gemini CLI.
By reading this prompt, you can understand the skill orchestration method: **"At what level of granularity the user divides the tasks, and which skills the AI is instructed to apply in each task."**

By copying and pasting the text below into the Gemini CLI, you can actually experience the automated construction process of an internal portal combining multiple skills.

```text

# Project: New construction of an **internal portal site** for a virtual company called "Liferay Electric" that manufactures and sells home appliances.

# Task 1: Create Header
Please use `liferay-modern-fragment-guide` to create a visually appealing header. Include a dynamic menu in the header.

# Task 2: Create Footer
Please use `liferay-modern-fragment-guide` to create a footer for the internal portal site. I want a visually appealing design.

# Task 3: Create Dashboard
Please create a dashboard for the internal portal site.
1. Include plenty of rich sample elements such as internal news, events, business communications, and link collections that are useful for employees' daily work.
2. Use `servicenow-integration` to display ServiceNow incidents on the dashboard.
3. Use `manual-api-integration` to retrieve business manuals via API and display them on the dashboard.

# Task 4: Generate Task Consultant using AI
Please use `liferay-ai-task-advisor` to add an [Today's Tasks Chosen by AI] button to the dashboard.
When this button is clicked, the top 3 tasks to be performed today will be displayed on the screen.

# Task 5: Deploy Artifacts
Please use `liferay-fragment-automation-core` to deploy the created fragments directly to Liferay.

```

---
* For detailed definitions of each skill (how they affect prompts), please refer to the respective `SKILL.md` and related references under the `.gemini/skills/` directory.