// находим все колонки

document.querySelectorAll(".column").forEach(Column.process); // обрабатываем все колонки

// находим кнопку добавить колонку

document
    .querySelector("[data-action-addColumn]")
    .addEventListener("click", function (event) {
        const columnElement = document.createElement("div"); // создаем новый <div>
        columnElement.classList.add("column"); // добавляем к нему класс
        columnElement.setAttribute("draggable", "true"); // добавляем аттрибут
        columnElement.setAttribute("data-column-id", Column.idCounter); // добавляем идентификатор

        columnElement.innerHTML = `
    <p class="column-header">В плане</p>
    <div data-notes></div>
    <p class="column-footer">
        <span data-action-addNote class="action">+ Добавить карточку</span>
    </p>
    `;

        Column.idCounter++;

        document.querySelector(".columns").append(columnElement); // добавляем созданный элемент в конец списка

        Column.process(columnElement); // обрабатываем каждую созданную колонку
    });

document.querySelectorAll(".note").forEach(Note.process); // обработчик событий для каждой найденной карточки