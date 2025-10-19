<script>
// ====== настройки ======
const SHEET_NAME = 'Таблица';   // <-- точно от този таб ще четем

// Зареждане на класовете от JSON
async function loadClasses() {
  const res = await fetch('classes.json');
  if (!res.ok) throw new Error('Не мога да прочета classes.json');
  return res.json();
}

// Построяване на gviz CSV линк към таб „Таблица“, независимо от дадения edit URL
function buildCsvUrl(editUrl) {
  // вадим Spreadsheet ID
  const m = editUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!m) throw new Error('Невалиден Google Sheets линк: ' + editUrl);
  const id = m[1];
  // gviz CSV точно от таб „Таблица“
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
}

// малка помощ за CSV -> масиви
function parseCsv(text) {
  // Прост CSV парсър, достатъчен за нашия случай (без вложени запетаи в кавички)
  const lines = text.trim().split(/\r?\n/);
  return lines.map(l => l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c => c.replace(/^"|"$/g, '')));
}

// цвят според стойност
function pill(value) {
  const v = (value || '').toLowerCase().trim();
  let cls = 'pill-neutral';
  if (v === 'нагоре') cls = 'pill-up';
  else if (v === 'надолу') cls = 'pill-down';
  else if (v === 'средно') cls = 'pill-mid';
  return `<span class="pill ${cls}">${value || ''}</span>`;
}

// рисуване на таблица
function renderTable(container, data) {
  // очакваме заглавия: УЧЕНИК, ФУНКЦИОНАЛНА ГРАМОТНОСТ, ПРЕЗЕНТАЦИОННИ УМЕНИЯ, ПРАКТИКО-ПРИЛОЖНИ УМЕНИЯ, ДИСЦИПЛИНА И ТОЛЕРАНТНОСТ, ГРУПОВА РАБОТА
  const headers = data[0] || [];
  const idx = {
    student: headers.findIndex(h => h.toLowerCase().includes('ученик')),
    fg: headers.findIndex(h => h.toLowerCase().includes('функционална')),
    prezent: headers.findIndex(h => h.toLowerCase().includes('презентацион')),
    prak: headers.findIndex(h => h.toLowerCase().includes('практико')),
    discipl: headers.findIndex(h => h.toLowerCase().includes('дисциплина')),
    group: headers.findIndex(h => h.toLowerCase().includes('групова')),
  };

  const noData = data.length <= 1 || Object.values(idx).some(v => v === -1);
  if (noData) {
    container.innerHTML = `
      <div class="card">
        <p>Все още няма въведени данни за този клас (или листът „${SHEET_NAME}“ е празен).</p>
      </div>`;
    return;
  }

  let html = `
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Ученик</th>
            <th>Функционална грамотност</th>
            <th>Презентационни умения</th>
            <th>Практико-приложни умения</th>
            <th>Дисциплина и толерантност</th>
            <th>Групова работа</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[idx.student]) continue; // прескачаме празни
    html += `
      <tr>
        <td>${row[idx.student] || ''}</td>
        <td>${pill(row[idx.fg])}</td>
        <td>${pill(row[idx.prezent])}</td>
        <td>${pill(row[idx.prak])}</td>
        <td>${pill(row[idx.discipl])}</td>
        <td>${pill(row[idx.group])}</td>
      </tr>
    `;
  }

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// зареждане и показване на конкретен клас
async function showClass(targetEl, classItem) {
  targetEl.innerHTML = `<div class="card"><p>Зареждам данните…</p></div>`;
  try {
    const csvUrl = buildCsvUrl(classItem.url);
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error('Грешка при четене на „Таблица“');
    const text = await res.text();
    const data = parseCsv(text);
    renderTable(targetEl, data);
  } catch (e) {
    targetEl.innerHTML = `
      <div class="card error">
        <p>Грешка: ${e.message}</p>
        <p>Проверете дали листът <strong>„${SHEET_NAME}“</strong> съществува и съдържа данни.</p>
      </div>`;
  }
}

// изграждане на менюто вляво
function buildMenu(list, onPick) {
  const ul = document.getElementById('menu');
  ul.innerHTML = '';
  list.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = `<button>${c.label}</button>`;
    li.querySelector('button').addEventListener('click', () => onPick(c, li));
    ul.appendChild(li);
  });
}

// Инициализация
(async () => {
  const classes = await loadClasses();
  const content = document.getElementById('content');

  buildMenu(classes, (cls, li) => {
    document.querySelectorAll('#menu .menu-item').forEach(x => x.classList.remove('active'));
    li.classList.add('active');
    showClass(content, cls);
  });

  // по избор може да заредим първия автоматично:
  // if (classes[0]) {
  //   const firstLi = document.querySelector('#menu .menu-item');
  //   firstLi?.classList.add('active');
  //   showClass(content, classes[0]);
  // }
})();
</script>
