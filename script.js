const sheets = {
  "Анализ 1 клас": "https://docs.google.com/spreadsheets/d/1tvvb8eCofvNbWz8oLik31AFC6N3Ihn9KbUbeu6Fe4bw/gviz/tq?tqx=out:json",
  "Анализ 2 клас": "https://docs.google.com/spreadsheets/d/14MRDL-yFVZThFQmsGjV15_4c6ttifYdS8RmpSbxFu4c/gviz/tq?tqx=out:json",
  "Анализ 3 клас": "https://docs.google.com/spreadsheets/d/1BByEwgYj8_0nwfierHpGl0ltshUj25IYE_X7gA_CLsc/gviz/tq?tqx=out:json",
  "Анализ 4 клас": "https://docs.google.com/spreadsheets/d/1pu8EUrP7fRR7l8WST2XsvD6UyPqFwnSptXM9Yh_RV68/gviz/tq?tqx=out:json",
  "Анализ 5 клас": "https://docs.google.com/spreadsheets/d/1b8fe13gdMrPTD6MdWBUra0xZpSVEE9PEMtr53MPZLFI/gviz/tq?tqx=out:json",
  "Анализ 6 клас": "https://docs.google.com/spreadsheets/d/1KXL3qRBIWDwPDkuPW2_GmJjoBsTR2XAxuUdQxjpmJGc/gviz/tq?tqx=out:json",
  "Анализ 7 клас": "https://docs.google.com/spreadsheets/d/1dvD8S3p4Fvfb3oqQ-JXnHDrO0eto6dLBGi6yaxFLmd4/gviz/tq?tqx=out:json",
  "Анализ 8 клас": "https://docs.google.com/spreadsheets/d/1yx4g0xqiFJfRK7AhumKH8GMNXLr_WSjjoWR-fdjOXcw/gviz/tq?tqx=out:json",
  "Анализ 9 клас": "https://docs.google.com/spreadsheets/d/1pSpH6iB4yGj95OTh1FUcDk34Na15_YY9UHOsRyFtmvc/gviz/tq?tqx=out:json",
  "Анализ 10 клас": "https://docs.google.com/spreadsheets/d/11MVzt6lhQe2CKiIxfomXMkzX-Oh1iLhctlVjMCfbEJA/gviz/tq?tqx=out:json"
};

const buttons = document.getElementById("class-buttons");
const container = document.getElementById("table-container");

// Създаване на бутони за класовете
for (let name in sheets) {
  const btn = document.createElement("button");
  btn.textContent = name;
  btn.onclick = () => loadSheet(name, sheets[name], btn);
  buttons.appendChild(btn);
}

// Зареждане на таблицата
async function loadSheet(name, url, button) {
  document.querySelectorAll("#class-buttons button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  container.innerHTML = "<p>Зареждане...</p>";

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    const table = document.createElement("table");
    rows.forEach((row, i) => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement(i === 0 ? "th" : "td");
        td.textContent = cell;

        const v = cell.toLowerCase();
        if (v.includes("надолу")) td.style.background = "#f8d7da";
        else if (v.includes("средно")) td.style.background = "#fff3cd";
        else if (v.includes("нагоре")) td.style.background = "#d4edda";

        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    container.innerHTML = "";
    container.appendChild(table);

  } catch (e) {
    container.innerHTML = `<p style="color:red;">Грешка при зареждането на ${name}</p>`;
  }
}

// Автоматично зареждане на първия клас
loadSheet("Анализ 1 клас", sheets["Анализ 1 клас"], document.createElement("button"));
