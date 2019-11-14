const Column = {
    idCounter: 4, //id следующих по счету элементов

    process(columnElement) {
        const spanAction_AddNote = columnElement.querySelector(
            "[data-action-addNote]"
        );
        // вешаем на кнопку событие клик, при добавлении создается новая карточка
        spanAction_AddNote.addEventListener("click", function (event) {
            const noteElement = document.createElement("div"); // создаем новый <div>
            noteElement.classList.add("note"); // добавляем к нему класс
            noteElement.setAttribute("draggable", "true"); // добавляем аттрибут
            noteElement.setAttribute("data-note-id", Note.idCounter); // добавляем идентификатор

            Note.idCounter++;

            columnElement.querySelector("[data-notes]").append(noteElement); // добавляем созданный элемент в конец списка
            Note.process(noteElement); // обработчик для каждой созданной карточки

            noteElement.setAttribute("contenteditable", "true"); // редактируем карточку при создании
            noteElement.focus();
        });
        const headerElement = columnElement.querySelector(".column-header");
        headerElement.addEventListener("dblclick", function (event) {
            headerElement.setAttribute("contenteditable", "true"); // при двойном клике добавляем атрибут редактирования поля
            headerElement.focus();
        });
        headerElement.addEventListener("blur", function (event) {
            headerElement.removeAttribute("contenteditable"); // если убираем фокус, атрибут удаляется
        });

        columnElement.addEventListener("dragover", function (event) {
            event.preventDefault(); // отменяем стандартное поведение события
        });

        columnElement.addEventListener("drop", function (event) {
            if (Note.dragged) {
                return columnElement.querySelector("[data-notes]").append(Note.dragged);
            }
        });
    }
}