Refine the existing ServiceNow Performance Monitor dashboard layout with the following improvements.

Do not redesign the whole page.
Only adjust spacing, alignment, and consistency.

1️⃣ Reduce Space Between Tabs and Stats Cards

Reduce vertical spacing between tab navigation and stats summary cards.

Use 16px spacing between tabs and stats cards.

Maintain 32px spacing between major sections.

Ensure layout looks compact but not crowded.

2️⃣ Reorganize Filter Bar Layout (Alignment Fix)

Refactor the filter section into a single horizontal control bar.

Left Side:

“View Critical Only” toggle

Status legend (Healthy, Warning, Critical with color dots)

Right Side:

Time range dropdown

Status dropdown

Auto-refresh button

Updated timestamp

Layout rules:

Use space-between alignment

Vertically center align all items

Keep 24px spacing between right-side controls

Maintain clean enterprise alignment

3️⃣ Fix Stats Cards Accent Border Consistency

Ensure all stats summary cards use consistent top accent styling.

Currently:
The first card (Total Nodes) has no top border.

Update design so that:

Total Nodes → Neutral gray top border (#CBD5E1)

Healthy Nodes → Green top border (#22C55E)

Warning Nodes → Amber top border (#F59E0B)

Critical Nodes → Red top border (#EF4444)

All cards must follow the same visual system.

Do not leave the first card without accent styling.

Keep background white.
Keep soft shadow: 0px 2px 8px rgba(0,0,0,0.05)

4️⃣ Make Cluster Cards and Application Cards Equal Height

Ensure cluster node cards and application cards have equal height for proper grid alignment.

Use consistent min-height

Padding: 24px

Internal spacing: 16px

Align bottom metric sections

Prevent uneven card bottoms

Cards must align cleanly in grid layout.

Do not allow height differences caused by varying content length.