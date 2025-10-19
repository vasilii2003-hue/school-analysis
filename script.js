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

for (let name in sheets) {
  const btn = document.createElement("button");
  btn.textContent = name;
  btn.onclick = () => loadSheet(name, sheets[name], btn);
  buttons.appendChild(btn);
}

async function loadSheet(name, url, button) {
  document.querySelectorAll("#class-buttons button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  container.innerHTML = "<p>Зареждане на данни...</p>";

  try {
    const res = await fetch(url);
    const text = await res.text();
    if (!text.includes("google.visualization.Query.setResponse")) throw new Error("Невалидни данни.");
    const json = JSON.parse(text.substr(47).slice(0, -2));
    if (!json.table || !json.table.rows) throw new Error("Празна таблица.");

    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));
    const hasHeader = rows.length > 0 && rows[0].some(cell => cell !== "");
    const headers = hasHeader ? rows[0] : ["Ученик", "Функционална грамотност", "Презентационни умения", "Практико-приложни умения", "Дисциплина и толерантност", "Групова работа"];
    const dataRows = hasHeader ? rows.slice(1) : rows;

    const title = document.createElement("h2");
    title.textContent = name;
    container.innerHTML = "";
    container.appendChild(title);

    const table = document.createElement("table");
    const trHead = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h || "Критерий";
      trHead.appendChild(th);
    });
    table.appendChild(trHead);

    dataRows.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement("td");
        let val = cell ? cell.toString().trim() : "";

        // Преобразуване на формат Date(...)
        if (val.startsWith("Date(")) {
          try {
            const parts = val.match(/\d+/g);
            if (parts && parts.length >= 3) {
              const d = new Date(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0);
              val = d.toLocaleString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
            }
          } catch {}
        }

        // Превръщане на числа в текстови оценки
        if (val === "1") val = "надолу";
        else if (val === "2") val = "средно";
        else if (val === "3") val = "нагоре";

        td.textContent = val;
        const lower = val.toLowerCase();
        if (lower.includes("надолу")) td.style.background = "#f8d7da";
        else if (lower.includes("средно")) td.style.background = "#fff3cd";
        else if (lower.includes("нагоре")) td.style.background = "#d4edda";

        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    container.appendChild(table);

  } catch (err) {
    container.innerHTML = `<p style="color:red;">⚠️ Грешка при зареждането на ${name}: ${err.message}</p>`;
  }
}
