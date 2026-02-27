Refine the existing dashboard layout with the following corrections.

Do NOT redesign the visual style.
Only fix structure, duplication, and consistency.

1️⃣ Remove Duplicate Filters

Currently filters are duplicated in two rows.

Fix this by restructuring into a clean two-row control layout.

Remove any repeated time, status, auto-refresh, or updated components.

There must be NO duplicated filter controls anywhere.

2️⃣ Proper Two-Row Header Structure
🔹 First Row (Primary Controls)

Left:

Application Name / Dashboard Title

Global Search bar

Right:

Auto-refresh

Updated timestamp

Keep spacing balanced.
Use space-between alignment.
Vertically center align elements.

🔹 Second Row (Filtering & Status Controls)

Left:

Health legend (Green = Healthy, Amber = Warning, Red = Critical)

Right:

View Critical Only toggle

Time range dropdown

Status dropdown

Rules:

Align left and right blocks using space-between

Keep 24px spacing between right-side controls

Maintain single horizontal line

Clean enterprise layout

3️⃣ Critical Cards Missing Alert Message

Rule:

If a card status = Critical,
It MUST always show alert message block.

Do not allow critical status without alert explanation.

Ensure logic consistency:

Critical → Alert message visible

Warning → Optional soft alert

Healthy → No alert message

4️⃣ Fix Uneven Card Height Due to Alert Block

Problem:
Cards with alert message are taller → breaks grid alignment.

Solution:

All node and application cards must have consistent fixed height.

Use one of these approaches:

Option A (Recommended):
Reserve fixed alert area space in ALL cards.
If no alert exists → keep empty placeholder space (invisible but reserved).

Option B:
Set consistent min-height and allow alert section to overlay inside without expanding card.

Rules:

Cards must align perfectly in grid

Bottom edge must be aligned

No card should expand independently

Padding: 24px
Internal spacing: 16px
Consistent min-height applied to all cards