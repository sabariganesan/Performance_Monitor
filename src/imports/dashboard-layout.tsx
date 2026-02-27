Refactor the dashboard layout.

Remove the current layout where Cluster Overview and Application Overview are stacked on the same page.

Instead, implement a tab-based structure.

🧱 Layout Structure

Below the top filter/search bar, create a primary tab navigation:

Tabs:

Cluster Overview

Application Overview

Style:

Modern segmented control style

Rounded background container

Active tab with solid background

Inactive tab muted

Smooth sliding indicator animation (300ms ease)

Do NOT use heavy borders.

Keep clean and minimal.

🟢 Tab 1: Cluster Overview (Default Active)

When selected, display:

1️⃣ Cluster Stats Summary Cards
2️⃣ Node Cards Grid

Hide all Application-related UI.

Maintain proper vertical spacing (32px between sections).

🔵 Tab 2: Application Overview

When selected, display:

1️⃣ Application Stats Summary Cards
2️⃣ Application Cards Grid

Hide all Cluster-related UI.

🎨 Interaction Behavior

When switching tabs:

Use smooth fade + slide transition (200–300ms)

Content should not jump abruptly

Preserve scroll position reset to top

Optional:
Animate active tab underline sliding smoothly.

📐 Layout Rules

Stats cards always appear at top of each tab

Grid layout consistent between tabs

Maintain same padding and container width

Avoid layout shift

✨ Visual Refinement

Active tab:

Bold text

Slight background tint

Primary accent color

Inactive tab:

Muted gray text

No background

Hover:

Soft background tint