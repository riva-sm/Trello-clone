Application.load(); // загружаем ранее сохраненные данные

document
    .querySelector("[data-action-addColumn]")
    .addEventListener("click", function (event) {
        const column = new Column; // создаем новую колонку
        document.querySelector(".columns").append(column.element); // добавляем созданный элемент в конец списка

        Application.save(); // сохраняем состояние
    });