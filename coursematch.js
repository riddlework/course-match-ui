// CourseMatch — combinatorial-auction course registration prototype
// Architecture:
//   COURSES[]         static master data (edit to change course offerings)
//   state             { constraintBoxes, activeBoxId, searchQuery, nextBoxId }
//   render*()         rebuilds DOM from state, re-initializes sortables after each change
//   DOM event handlers update state then call render functions

const COURSES = [
  { id: 'cs101',    code: 'CS 101',    title: 'Introduction to Programming',  credits: 3, timeSlot: 'MWF 9:00–9:50am',    room: 'Gould-Simpson 701' },
  { id: 'cs201',    code: 'CS 201',    title: 'Data Structures',              credits: 3, timeSlot: 'MWF 10:00–10:50am',  room: 'Gould-Simpson 906' },
  { id: 'cs345',    code: 'CS 345',    title: 'Algorithms',                   credits: 3, timeSlot: 'TTh 9:30–10:45am',   room: 'Gould-Simpson 701' },
  { id: 'cs460',    code: 'CS 460',    title: 'Database Systems',             credits: 3, timeSlot: 'MWF 11:00–11:50am',  room: 'Gould-Simpson 906' },
  { id: 'cs461',    code: 'CS 461',    title: 'Machine Learning',             credits: 4, timeSlot: 'TTh 11:00–12:15pm',  room: 'Gould-Simpson 701' },
  { id: 'cs480',    code: 'CS 480',    title: 'Operating Systems',            credits: 3, timeSlot: 'MWF 1:00–1:50pm',    room: 'Gould-Simpson 906' },
  { id: 'math122a', code: 'MATH 122A', title: 'Calculus I',                   credits: 4, timeSlot: 'MWF 8:00–8:50am',    room: 'Math 501' },
  { id: 'math129',  code: 'MATH 129',  title: 'Calculus II',                  credits: 4, timeSlot: 'MWF 9:00–9:50am',    room: 'Math 501' },
  { id: 'math254',  code: 'MATH 254',  title: 'Linear Algebra',               credits: 3, timeSlot: 'TTh 9:30–10:45am',   room: 'Math 501' },
  { id: 'math323',  code: 'MATH 323',  title: 'Formal Mathematical Reasoning', credits: 3, timeSlot: 'MWF 10:00–10:50am', room: 'Math 501' },
  { id: 'math413',  code: 'MATH 413',  title: 'Probability',                  credits: 3, timeSlot: 'TTh 2:00–3:15pm',    room: 'Math 501' },
  { id: 'phys141',  code: 'PHYS 141',  title: 'Mechanics',                    credits: 4, timeSlot: 'MWF 9:00–9:50am',    room: 'Physics 201' },
  { id: 'phys241',  code: 'PHYS 241',  title: 'Electricity & Magnetism',      credits: 4, timeSlot: 'TTh 11:00–12:15pm',  room: 'Physics 201' },
  { id: 'econ200',  code: 'ECON 200',  title: 'Microeconomics',               credits: 3, timeSlot: 'MWF 1:00–1:50pm',    room: 'McClelland 101' },
  { id: 'econ201',  code: 'ECON 201',  title: 'Macroeconomics',               credits: 3, timeSlot: 'TTh 2:00–3:15pm',    room: 'McClelland 101' },
  { id: 'phil101',  code: 'PHIL 101',  title: 'Introduction to Philosophy',   credits: 3, timeSlot: 'MWF 11:00–11:50am',  room: 'Harvill 316' },
  { id: 'phil305',  code: 'PHIL 305',  title: 'Ethics',                       credits: 3, timeSlot: 'TTh 9:30–10:45am',   room: 'Harvill 316' },
  { id: 'engl101',  code: 'ENGL 101',  title: 'Composition',                  credits: 3, timeSlot: 'MWF 10:00–10:50am',  room: 'Modern Languages 201' },
  { id: 'engl259',  code: 'ENGL 259',  title: 'World Literature',             credits: 3, timeSlot: 'TTh 11:00–12:15pm',  room: 'Modern Languages 201' },
  { id: 'psyc101',  code: 'PSYC 101',  title: 'Introduction to Psychology',   credits: 3, timeSlot: 'MWF 2:00–2:50pm',    room: 'Psychology 205' },
  { id: 'psyc310',  code: 'PSYC 310',  title: 'Cognitive Psychology',         credits: 3, timeSlot: 'TTh 3:30–4:45pm',    room: 'Psychology 205' },
  { id: 'soc200',   code: 'SOC 200',   title: 'Introduction to Sociology',    credits: 3, timeSlot: 'MWF 12:00–12:50pm',  room: 'Social Sciences 100' },
  { id: 'soc325',   code: 'SOC 325',   title: 'Research Methods',             credits: 3, timeSlot: 'TTh 9:30–10:45am',   room: 'Social Sciences 100' },
  { id: 'biol181',  code: 'BIOL 181',  title: 'Biology I',                    credits: 4, timeSlot: 'MWF 9:00–9:50am',    room: 'Biological Sciences 100' },
  { id: 'biol182',  code: 'BIOL 182',  title: 'Biology II',                   credits: 4, timeSlot: 'MWF 10:00–10:50am',  room: 'Biological Sciences 100' },
  { id: 'chem151a', code: 'CHEM 151A', title: 'General Chemistry I',          credits: 4, timeSlot: 'MWF 8:00–8:50am',    room: 'Harvill 150' },
  { id: 'chem152a', code: 'CHEM 152A', title: 'General Chemistry II',         credits: 4, timeSlot: 'MWF 9:00–9:50am',    room: 'Harvill 150' },
  { id: 'hist101',  code: 'HIST 101',  title: 'World History',                credits: 3, timeSlot: 'TTh 2:00–3:15pm',    room: 'Douglass 203' },
  { id: 'ling301',  code: 'LING 301',  title: 'Introduction to Linguistics',  credits: 3, timeSlot: 'TTh 11:00–12:15pm',  room: 'Modern Languages 201' },
  { id: 'art101',   code: 'ART 101',   title: 'Drawing',                      credits: 2, timeSlot: 'MWF 3:00–3:50pm',    room: 'Fine Arts 310' },
];

const COURSE_MAP = Object.fromEntries(COURSES.map(c => [c.id, c]));

let state = {
  constraintBoxes: [
    { id: 'box-1', label: 'Must take at least 1 of these', courseIds: ['cs101', 'cs201'] },
    { id: 'box-2', label: 'Want at most 2 of these',       courseIds: ['math122a', 'math129', 'phys141'] },
  ],
  activeBoxId: 'box-1',
  searchQuery: '',
  nextBoxId: 3,
};

// ── Rendering ──────────────────────────────────────────────────────────────────

function courseItemHTML(course, boxId) {
  return `<li class="course-item" data-course-id="${course.id}" data-box-id="${boxId}">
    <span class="drag-handle" title="Drag to reorder">⠿</span>
    <span class="course-item-info">
      <span class="course-code">${course.code}</span>
      <span class="course-title">${course.title}</span>
      <span class="course-meta">${course.timeSlot} · ${course.room}</span>
    </span>
    <span class="course-badge">${course.credits} cr</span>
    <button class="remove-course-btn" data-course-id="${course.id}" data-box-id="${boxId}" title="Remove">×</button>
  </li>`;
}

function renderMasterList() {
  const query = state.searchQuery.toLowerCase();
  const ul = document.getElementById('master-list-ul');
  ul.innerHTML = '';

  const filtered = COURSES.filter(c =>
    c.code.toLowerCase().includes(query) ||
    c.title.toLowerCase().includes(query) ||
    c.timeSlot.toLowerCase().includes(query) ||
    c.room.toLowerCase().includes(query)
  );

  filtered.forEach(course => {
    const li = document.createElement('li');
    li.className = 'master-item';
    li.dataset.courseId = course.id;
    li.innerHTML = `
      <span class="drag-handle" title="Drag to add">⠿</span>
      <label class="master-item-label">
        <input type="checkbox" class="course-checkbox" data-course-id="${course.id}">
        <span class="course-item-info">
          <span class="course-code">${course.code}</span>
          <span class="course-title">${course.title}</span>
          <span class="course-meta">${course.timeSlot} · ${course.room}</span>
        </span>
        <span class="course-badge">${course.credits} cr</span>
      </label>`;
    ul.appendChild(li);
  });

  sortable('#master-list-ul', {
    copy: true,
    handle: '.drag-handle',
    acceptFrom: false,
    items: '.master-item',
  });
}

function renderConstraintBoxes() {
  const container = document.getElementById('constraints-container');
  container.innerHTML = '';

  state.constraintBoxes.forEach(box => {
    const div = document.createElement('div');
    div.className = 'constraint-box' + (box.id === state.activeBoxId ? ' active' : '');
    div.dataset.boxId = box.id;

    const courseItems = box.courseIds
      .map(id => COURSE_MAP[id])
      .filter(Boolean)
      .map(c => courseItemHTML(c, box.id))
      .join('');

    div.innerHTML = `
      <div class="box-header">
        <span class="active-indicator" title="Click to make active for checkbox adds"></span>
        <span class="box-label" contenteditable="true" spellcheck="false" data-box-id="${box.id}">${box.label}</span>
        <button class="delete-box-btn" data-box-id="${box.id}" title="Delete this constraint box">✕ Delete</button>
      </div>
      <ul class="constraint-list" id="list-${box.id}" data-box-id="${box.id}">
        ${courseItems}
        <li class="drop-placeholder-hint">Drop courses here</li>
      </ul>`;
    container.appendChild(div);
  });

  // Attach sortable to all constraint lists
  const lists = document.querySelectorAll('.constraint-list');
  lists.forEach(list => {
    sortable(list, {
      handle: '.drag-handle',
      acceptFrom: '#master-list-ul, .constraint-list',
      copy: false,
      items: '.course-item',
    });
    list.addEventListener('sortupdate', onConstraintSortUpdate);
  });

  updateDropHints();
}

function updateDropHints() {
  document.querySelectorAll('.constraint-list').forEach(list => {
    const hint = list.querySelector('.drop-placeholder-hint');
    if (!hint) return;
    const items = list.querySelectorAll('.course-item');
    hint.style.display = items.length === 0 ? 'block' : 'none';
  });
}

// ── Sortable event handlers ────────────────────────────────────────────────────

function onConstraintSortUpdate(e) {
  const list = e.target;
  const boxId = list.dataset.boxId;

  // Deduplicate: if the dropped item already exists, remove the duplicate
  const seen = new Set();
  const items = list.querySelectorAll('.course-item');
  items.forEach(item => {
    const cid = item.dataset.courseId;
    if (seen.has(cid)) {
      item.remove();
    } else {
      seen.add(cid);
      // Ensure box-id is current (item may have been dragged from another box)
      item.dataset.boxId = boxId;
      const btn = item.querySelector('.remove-course-btn');
      if (btn) btn.dataset.boxId = boxId;
    }
  });

  syncStateFromDOM();
  updateDropHints();
}

function syncStateFromDOM() {
  state.constraintBoxes.forEach(box => {
    const list = document.getElementById('list-' + box.id);
    if (!list) return;
    box.courseIds = Array.from(list.querySelectorAll('.course-item')).map(li => li.dataset.courseId);
  });
}

// ── Actions ───────────────────────────────────────────────────────────────────

function addConstraintBox() {
  const id = 'box-' + state.nextBoxId++;
  state.constraintBoxes.push({ id, label: 'New constraint', courseIds: [] });
  state.activeBoxId = id;
  renderConstraintBoxes();
  const newBox = document.querySelector(`[data-box-id="${id}"].constraint-box`);
  if (newBox) {
    newBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    newBox.querySelector('.box-label').focus();
  }
}

function deleteConstraintBox(boxId) {
  state.constraintBoxes = state.constraintBoxes.filter(b => b.id !== boxId);
  if (state.activeBoxId === boxId) {
    state.activeBoxId = state.constraintBoxes[0]?.id ?? null;
  }
  renderConstraintBoxes();
}

function removeCourseFromBox(boxId, courseId) {
  const box = state.constraintBoxes.find(b => b.id === boxId);
  if (!box) return;
  box.courseIds = box.courseIds.filter(id => id !== courseId);
  // Rebuild just this box's list instead of full re-render to avoid re-init cost
  const list = document.getElementById('list-' + boxId);
  if (!list) return;
  const item = list.querySelector(`[data-course-id="${courseId}"]`);
  if (item) item.remove();
  updateDropHints();
  syncStateFromDOM();
}

function handleCheckbox(courseId, checked) {
  if (!state.activeBoxId) return;
  const box = state.constraintBoxes.find(b => b.id === state.activeBoxId);
  if (!box) return;

  if (checked) {
    if (!box.courseIds.includes(courseId)) {
      box.courseIds.push(courseId);
      // Append item directly to the DOM list
      const list = document.getElementById('list-' + state.activeBoxId);
      const course = COURSE_MAP[courseId];
      if (list && course) {
        const hint = list.querySelector('.drop-placeholder-hint');
        const temp = document.createElement('ul');
        temp.innerHTML = courseItemHTML(course, state.activeBoxId);
        const newItem = temp.firstElementChild;
        list.insertBefore(newItem, hint || null);
        updateDropHints();
      }
    }
  } else {
    box.courseIds = box.courseIds.filter(id => id !== courseId);
    const list = document.getElementById('list-' + state.activeBoxId);
    if (list) {
      const item = list.querySelector(`[data-course-id="${courseId}"]`);
      if (item) item.remove();
      updateDropHints();
    }
  }
}

function setActiveBox(boxId) {
  state.activeBoxId = boxId;
  document.querySelectorAll('.constraint-box').forEach(box => {
    box.classList.toggle('active', box.dataset.boxId === boxId);
  });
}

function showRanking() {
  const panel = document.getElementById('output-panel');
  const area = document.getElementById('output-area');

  syncStateFromDOM();

  if (state.constraintBoxes.length === 0) {
    area.textContent = 'No constraint boxes defined.';
    panel.classList.add('visible');
    panel.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  let lines = ['CourseMatch — Preference Ranking\n' + '='.repeat(40)];
  state.constraintBoxes.forEach((box, i) => {
    lines.push(`\nBox ${i + 1}: ${box.label}`);
    lines.push('-'.repeat(30));
    if (box.courseIds.length === 0) {
      lines.push('  (no courses)');
    } else {
      box.courseIds.forEach((cid, rank) => {
        const c = COURSE_MAP[cid];
        if (!c) return;
        lines.push(`  ${rank + 1}. ${c.code} — ${c.title}`);
        lines.push(`     ${c.credits} credits · ${c.timeSlot} · ${c.room}`);
      });
    }
  });

  area.textContent = lines.join('\n');
  panel.classList.add('visible');
  panel.scrollIntoView({ behavior: 'smooth' });
}

// ── Event delegation ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderMasterList();
  renderConstraintBoxes();

  // Search
  document.getElementById('course-search').addEventListener('input', e => {
    state.searchQuery = e.target.value;
    renderMasterList();
  });

  // Checkbox adds to active box
  document.getElementById('master-list-ul').addEventListener('change', e => {
    if (e.target.classList.contains('course-checkbox')) {
      handleCheckbox(e.target.dataset.courseId, e.target.checked);
    }
  });

  // Add constraint box
  document.getElementById('add-constraint-btn').addEventListener('click', addConstraintBox);

  // Show ranking
  document.getElementById('show-ranking-btn').addEventListener('click', showRanking);

  // Constraint box actions (delete box, remove course, set active, label edit)
  document.getElementById('constraints-container').addEventListener('click', e => {
    const deleteBoxBtn = e.target.closest('.delete-box-btn');
    if (deleteBoxBtn) {
      deleteConstraintBox(deleteBoxBtn.dataset.boxId);
      return;
    }
    const removeCourseBtn = e.target.closest('.remove-course-btn');
    if (removeCourseBtn) {
      removeCourseFromBox(removeCourseBtn.dataset.boxId, removeCourseBtn.dataset.courseId);
      return;
    }
    // Click on box header or indicator = set active
    const box = e.target.closest('.constraint-box');
    if (box && !e.target.closest('[contenteditable]')) {
      setActiveBox(box.dataset.boxId);
    }
  });

  // Sync label edits back to state
  document.getElementById('constraints-container').addEventListener('blur', e => {
    if (e.target.classList.contains('box-label')) {
      const boxId = e.target.dataset.boxId;
      const box = state.constraintBoxes.find(b => b.id === boxId);
      if (box) box.label = e.target.textContent.trim() || 'Untitled';
    }
  }, true);

  // Re-init master list sortable after constraint box renders (so copy drops work)
  // html5sortable needs both source and target initialized
  renderMasterList();
});
