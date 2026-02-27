Enhance the dashboard by adding a clear “Filters Applied” indicator.

Do not redesign the layout.
Only add a structured filter notification system.

1️⃣ Show Filter Indicator When Filters Are Active

When any of the following are applied:

Time range changed from default

Status dropdown selected

View Critical Only toggle enabled

Application or Node selected

Display a filter summary section below the filter controls row.

This section must only appear when filters are active.

Hide it when no filters are applied.

2️⃣ Filter Summary Layout

Create a horizontal container with:

Left side:

Filter icon

Text: “Filters Applied”

Right side:

“Clear All” action

Close (X) icon

Inside the container, display active filters as removable chips.

Example:

[ Time: Last 1h ✕ ]
[ Status: Critical ✕ ]
[ View Critical Only ✕ ]

Each chip must:

Show filter name and value

Have a small remove (✕) action

Remove only that filter when clicked