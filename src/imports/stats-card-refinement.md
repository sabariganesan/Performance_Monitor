Refine only the three top Stats Summary Cards:
Healthy Nodes, Warning Nodes, Critical Nodes.

Do NOT modify:

Cluster overview section

Node cards

Application cards

Any other progress bars in the system

1️⃣ Remove Gradient Background (Stats Cards Only)

Replace gradient background with:

Solid white background

Soft shadow: 0px 2px 8px rgba(0,0,0,0.05)

4px colored top border:

Healthy → #22C55E

Warning → #F59E0B

Critical → #EF4444

Keep the rest minimal and clean.

2️⃣ Redesign ONLY the Progress Bar in Stats Cards

Change the stats card progress bar to:

Height: 8px
Shape: Fully rounded (pill style)
Track color: #E5E7EB (very light gray)

Fill colors:

Healthy → #22C55E

Warning → #F59E0B

Critical → #EF4444

Add:
✔ Smooth left-to-right fill animation on load (0 → value, 600ms ease-out)
✔ Slight inner depth (very subtle shadow)
✔ Critical only: soft glow pulse (very subtle, 3s ease-in-out)

No flashing.
No heavy animation.
Keep enterprise clean.

3️⃣ Improve Layout of Status Row

Inside stats card:

Healthy Nodes
3 / 6

Status ................. 50%

Make:

Percentage right-aligned

Percentage bold

Percentage same color as progress fill

Label small and muted gray

Add small spacing between label and progress bar (8px).

4️⃣ Improve Visual Hierarchy (Stats Cards Only)

Structure:

Title (small)
Large Count (32px+ bold)
Sub count (/6 smaller muted)
Divider (very subtle)
Status Row
Progress Bar

Keep card height consistent across all three.