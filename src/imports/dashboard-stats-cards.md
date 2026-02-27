Design clean, enterprise summary stats cards for both:

Cluster Overview Section

Applications Overview Section

Do not use gradients.
Keep UI minimal, modern, and SaaS-style.

🟢 1️⃣ Cluster Stats Cards (Top Summary Row)

Create 4 equal-width cards in one row.

Card 1 – Total Nodes

Large number (e.g., 6)

Label: Total Nodes

Small subtext: Active in selected time range

Neutral color

Card 2 – Healthy Nodes

Large number

Label

Small percentage

Green accent

6px top border in green

Small trend indicator (↑ or ↓)

Card 3 – Warning Nodes

Same layout

Amber accent

Subtle warning icon

Card 4 – Critical Nodes

Red accent

Soft red glow border

Subtle pulse animation on status dot (not entire card)

Cluster Card Design Style

Background: white
Border radius: 12px
Shadow: 0px 2px 8px rgba(0,0,0,0.05)
Padding: 24px
Spacing inside: 12px

Typography:

Number: 32–36px bold

Label: 14px medium

Subtext: 12px muted gray

🔵 2️⃣ Application Stats Cards (Above Application List)

Create 5 summary cards:

1. Total Applications

Large number
Neutral

2. Total Hits (All Apps Combined)

Large number
Mini sparkline chart
Blue accent

3. Avg Response Time

Large number (ms)
Color based on threshold:

<200ms green

200–400ms amber

400ms red

4. Avg Error Rate

Large %
Red if >1%
Include small warning icon if high

5. Slow Transactions Count

Large number
Heat icon
Amber accent

🎨 Application Stats Card Style

Same visual system as cluster cards:

White background
Soft shadow
Top accent border (4–6px)
No gradients
Clean progress bars if used

Mini charts:

Smooth thin line

Light neutral background

No heavy fills

✨ Optional Enhancement

Add:

Hover effect:

Slight elevation increase

Border becomes slightly stronger

On click:

Filters dashboard based on that stat

Example:
Click "Critical Nodes" → shows only critical nodes

📐 Layout Structure

Cluster Stats Row
↓
Cluster Node Cards

Application Stats Row
↓
Application Cards

Keep consistent spacing between sections (32px–40px).