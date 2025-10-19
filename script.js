document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Скриптът стартира");

  const container = document.getElementById("class-buttons");
  const tableContainer = document.getElementById("table-container");

  if (!container) {
    console.error("❌ Не е намерен елемент с id=class-buttons");
    return;
  }

  // Зареждане на JSON
  fetch("./classes.json")
    .then(r => {
      if (!r.ok) throw new Error(`Грешка при зареждане: ${r.status}`);
      return r.json();
    })
    .then(classes => {
      console.log("📂 Заредени данни:", classes);

      // Създаване на бутони
      classes.forEach(cls => {
        const btn = document.createElement("button");
        btn.textContent = cls.label;
        btn.onclick = () => {
          document.querySelectorAll("#class-buttons button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          // Зареждане на Google таблицата във вътрешен iframe
          tableContainer.innerHTML = `
            <iframe src="${cls.url.replace('/edit', '/preview')}"
                    style="width:100%;height:80vh;border:none;"></iframe>`;
        };
        container.appendChild(btn);
      });
    })
    .catch(err => {
      console.error("❌ Грешка при обработка:", err);
      tableContainer.innerHTML = `<p style="color:red">Грешка при зареждане на списъка с класове.</p>`;
    });
});
