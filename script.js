// Зареждане на списъка с класове
fetch('classes.json')
  .then(response => response.json())
  .then(classes => {
    const list = document.getElementById('classList');
    for (const [className, sheetUrl] of Object.entries(classes)) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = `Анализ ${className} клас`;
      btn.onclick = () => loadClassData(className, sheetUrl, btn);
      li.appendChild(btn);
      list.appendChild(li);
    }
  });

function loadClassData(className, sheetUrl, button) {
  document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
  button.classList.add('active');

  const analysis = document.getElementById('analysisArea');
  analysis.innerHTML = `<em>Зареждане на данните за ${className} клас...</em>`;

  // Вземане на CSV линка от Google Sheets
  const csvUrl = sheetUrl.replace('/edit?usp=drive_link', '/gviz/tq?tqx=out:csv');

  fetch(csvUrl)
    .then(response => response.text())
    .then(csv => {
      analysis.innerHTML = parseCSVtoHTML(csv);
    })
    .catch(() => {
      analysis.innerHTML = `<span style="color:red;">Грешка при зареждането на данните за ${className} клас.</span>`;
    });
}

function parseCSVtoHTML(csv) {
  const rows = csv.split('\n').map(r => r.split(','));
  let html = '<table border="1" cellspacing="0" cellpadding="6"><tr>';
  html += rows[0].map(cell => `<th>${cell}</th>`).join('') + '</tr>';
  for (let i = 1; i < rows.length; i++) {
    html += '<tr>' + rows[i].map(cell => `<td>${cell}</td>`).join('') + '</tr>';
  }
  html += '</table>';
  return html;
}
