document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ Скриптът е стартирал");
const menu = document.querySelector(".menu");
console.log("🔍 Елемент .menu:", menu);

  const menu = document.querySelector(".menu");
  const content = document.querySelector(".content");

  try {
    const res = await fetch("classes.json");
    if (!res.ok) throw new Error("classes.json not found");
    const classes = await res.json();

    // Проверка дали е масив (в твоя случай трябва да е)
    if (!Array.isArray(classes)) {
      throw new Error("classes.json трябва да съдържа масив, а не обект.");
    }

    // Създаваме бутоните за всеки клас
    classes.forEach((cls, i) => {
      const btn = document.createElement("button");
      btn.textContent = cls.label || `Клас ${i + 1}`;
      btn.classList.add("menu-btn");
      btn.addEventListener("click", () => loadClass(cls.url, btn));
      menu.appendChild(btn);
    });
  } catch (err) {
    console.error("❌ Грешка при зареждане на класовете:", err);
    content.innerHTML = `<p style="color:red;">Грешка при зареждане на classes.json</p>`;
  }

  async function loadClass(url, btn) {
    document.querySelectorAll(".menu-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    content.innerHTML = `<p>Зареждане на данни...</p>`;

    try {
      const sheetId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)[1];
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Таблица`;

      const res = await fetch(sheetUrl);
      const text = await res.text();
      const json = JSON.parse(text.substr(47).slice(0, -2));

      let html = "<table><thead><tr>";
      json.table.cols.forEach((col) => {
        if (col.label) html += `<th>${col.label}</th>`;
      });
      html += "</tr></thead><tbody>";

      json.table.rows.forEach((row) => {
        html += "<tr>";
        row.c.forEach((cell) => {
          const value = cell && cell.v ? cell.v : "";
          html += `<td>${value}</td>`;
        });
        html += "</tr>";
      });
      html += "</tbody></table>";

      content.innerHTML = html;
    } catch (err) {
      console.error("⚠️ Грешка при зареждане на таблица:", err);
      content.innerHTML = `<p style="color:red;">Неуспешно зареждане на таблицата.</p>`;
    }
  }
});
