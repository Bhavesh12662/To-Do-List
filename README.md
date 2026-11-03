# TaskFlow To-Do List App

A responsive task manager built with **HTML, CSS and vanilla JavaScript**.

## Features

- Add tasks with low, medium or high priority
- Mark tasks as completed or active
- Edit task names and priorities
- Delete individual tasks
- Filter all, active and completed tasks
- Search tasks by title
- Clear all completed tasks
- Dashboard counts for total, active and completed tasks
- Save tasks in browser `localStorage`
- Responsive layout for mobile, tablet and desktop

## Project structure

```text
todo-list-app/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Run the project

1. Extract `todo-list-app.zip`.
2. Open the extracted folder in VS Code.
3. Open `index.html` in your browser.

Recommended: install the **Live Server** extension in VS Code, right-click `index.html`, and choose **Open with Live Server**.

No npm install, build step, backend or database is required.

## How data is saved

Tasks are stored in your browser using `localStorage` under the key `taskflow.tasks.v1`. They remain after refreshing or closing the browser, but they are local to that browser and device. Clearing browser site data will remove them.

## Before submitting

- [ ] Add a task
- [ ] Refresh the page and confirm the task is still there
- [ ] Edit a task
- [ ] Mark a task complete and active
- [ ] Test all three filters
- [ ] Search for a task
- [ ] Delete a task
- [ ] Clear completed tasks
- [ ] Test the layout at mobile width
- [ ] Upload the project folder to GitHub

## Concepts to understand

- DOM selection and element creation
- `addEventListener()` and form submission
- Arrays: `map()`, `filter()`, `find()`
- Objects and unique IDs
- Template literals and conditional classes
- `JSON.stringify()` and `JSON.parse()`
- `localStorage`
- Rendering UI from application state
