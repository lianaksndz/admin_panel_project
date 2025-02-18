document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registration-form");
    const adminPanel = document.getElementById("admin-panel");
    const message = document.getElementById("message");

    // 🟢 Обробник події для реєстрації
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;
        const dob = document.getElementById("dob").value;
        const gender = document.querySelector("input[name='gender']:checked")?.value || "";
        const country = document.getElementById("country").value;
        const agreement = document.getElementById("agreement").checked;

        if (password.length < 6) {
            message.innerText = "Пароль має містити щонайменше 6 символів.";
            return;
        }

        const client = { name, email, password, phone, dob, gender, country, agreement };

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(client)
            });
            const result = await response.json();
            message.innerText = result.message || result.error;
            form.reset();
            displayClients();
        } catch (error) {
            console.error("Помилка:", error);
        }
    });

    // 🟢 Функція для виведення списку клієнтів
    async function displayClients() {
        try {
            const response = await fetch("http://127.0.0.1:5000/clients");
            const clients = await response.json();
            adminPanel.innerHTML = "<h3>Список клієнтів</h3>";

            clients.forEach((client, index) => {
                const clientDiv = document.createElement("div");
                clientDiv.innerHTML = `
                    <p><strong>${client.name}</strong> (${client.email})</p>
                    <input type="text" id="edit-${client.id}" value="${client.name}">
                    <button onclick="updateClient(${client.id})">Редагувати</button>
                    <button onclick="deleteClient(${client.id})">Видалити</button>
                `;
                adminPanel.appendChild(clientDiv);
            });
        } catch (error) {
            console.error("Помилка завантаження клієнтів:", error);
        }
    }

    // 🟢 Функція для видалення клієнта
    window.deleteClient = async function (clientId) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/delete_client/${clientId}`, { method: "DELETE" });
            const result = await response.json();
            message.innerText = result.message || result.error;
            displayClients();
        } catch (error) {
            console.error("Помилка видалення:", error);
        }
    };

    // 🟢 Функція для редагування клієнта
    window.updateClient = async function (clientId) {
        const newName = document.getElementById(`edit-${clientId}`).value;
        try {
            const response = await fetch(`http://127.0.0.1:5000/update_client/${clientId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName })
            });
            const result = await response.json();
            message.innerText = result.message || result.error;
            displayClients();
        } catch (error) {
            console.error("Помилка редагування:", error);
        }
    };

    displayClients();
});
