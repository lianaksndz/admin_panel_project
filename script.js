document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registration-form");
    const adminPanel = document.getElementById("admin-panel");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Запобігаємо перезавантаженню сторінки

        // Отримуємо значення полів
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;
        const dob = document.getElementById("dob").value;
        const gender = document.querySelector("input[name='gender']:checked")?.value || "";
        const country = document.getElementById("country").value;
        const agreement = document.getElementById("agreement").checked;

        // Формуємо об'єкт клієнта
        const client = { name, email, password, phone, dob, gender, country, agreement };

        // Отримуємо вже збережених клієнтів або створюємо порожній масив
        let clients = JSON.parse(localStorage.getItem("clients")) || [];

        // Додаємо нового клієнта
        clients.push(client);

        // Зберігаємо дані в localStorage
        localStorage.setItem("clients", JSON.stringify(clients));

        // Очищаємо форму
        form.reset();

        // Оновлюємо панель адміністратора
        displayClients();
    });

    // Функція для відображення клієнтів
    function displayClients() {
        const clients = JSON.parse(localStorage.getItem("clients")) || [];
        adminPanel.innerHTML = "<h3>Список клієнтів</h3>";

        clients.forEach((client, index) => {
            const clientDiv = document.createElement("div");
            clientDiv.innerHTML = `
                <p><strong>${client.name}</strong> (${client.email})</p>
                <button onclick="deleteClient(${index})">Видалити</button>
            `;
            adminPanel.appendChild(clientDiv);
        });
    }

    // Функція для видалення клієнта
    window.deleteClient = function (index) {
        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        clients.splice(index, 1);
        localStorage.setItem("clients", JSON.stringify(clients));
        displayClients();
    };

    // Відображаємо клієнтів при завантаженні сторінки
    displayClients();
});