# CourseMatch UI

A prototype frontend for CourseMatch, a preference-based course 
registration system. CourseMatch treats registration as a 
combinatorial auction—students express ranked preferences and 
constraints rather than competing on a first-come-first-served basis.

This frontend is a self-contained demo with no backend dependency.

## Features

- Scrollable, searchable course catalog with ~30 sample courses
- Drag-and-drop constraint boxes for expressing course preferences
- Courses can appear in multiple constraint lists
- Add, label, reorder, and delete constraint boxes
- "Show My Ranking" outputs all constraints and ranked preferences
- Checkbox-based course adding as an alternative to drag-and-drop

## Usage

Open `coursematch.html` directly in a browser. No build step or 
server required.

## Files

- `coursematch.html`: page structure and layout
- `coursematch.css`: all styling and color tokens
- `coursematch.js`: course data, drag-and-drop logic, UI behavior

## Tech

- [html5sortable](https://lukasoppermann.github.io/html5sortable/) 
  for drag-and-drop (loaded via CDN)
- Vanilla JS, no frameworks

## Course Data

All sample courses are defined as a JavaScript array at the top of 
`coursematch.js` and can be freely edited.
