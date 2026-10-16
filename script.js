const form = document.getElementById("expenseForm");
const rows = document.getElementById("expenseRows");
const totalElement = document.getElementById("total");
const message = document.getElementById("message");

document.getElementById("date").value = new Date().toLocaleDateString("en-CA");

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

async function loadExpenses() {
  try {
    message.textContent = "";
    const expenses = await apiRequest("/api/expenses");
    rows.replaceChildren();
    let total = 0;

    if (expenses.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.className = "empty";
      td.textContent = "No expenses yet. Add your first expense above!";
      tr.appendChild(td);
      rows.appendChild(tr);
    }

    expenses.forEach(expense => {
      total += Number(expense.amount);
      const tr = document.createElement("tr");
      [expense.name, formatMoney(expense.amount), expense.category, expense.date].forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });

      const actionCell = document.createElement("td");
      const button = document.createElement("button");
      button.textContent = "Delete";
      button.className = "delete-button";
      button.addEventListener("click", async () => {
        if (!confirm("Delete this expense?")) return;
        try {
          await apiRequest("/api/expenses/" + encodeURIComponent(expense._id), { method: "DELETE" });
          await loadExpenses();
        } catch (error) {
          message.textContent = error.message;
        }
      });
      actionCell.appendChild(button);
      tr.appendChild(actionCell);
      rows.appendChild(tr);
    });

    totalElement.textContent = formatMoney(total);
  } catch (error) {
    message.textContent = error.message + " Check your server and MongoDB settings.";
    rows.replaceChildren();
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.className = "empty";
    td.textContent = "Could not load expenses.";
    tr.appendChild(td);
    rows.appendChild(tr);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "";
  const expense = {
    name: form.name.value.trim(),
    amount: Number(form.amount.value),
    category: form.category.value,
    date: form.date.value
  };

  try {
    await apiRequest("/api/expenses", { method: "POST", body: JSON.stringify(expense) });
    form.reset();
    document.getElementById("date").value = new Date().toLocaleDateString("en-CA");
    await loadExpenses();
  } catch (error) {
    message.textContent = error.message;
  }
});

loadExpenses();