class Column {
    constructor(id = null) {
        const instance = this;

        this.notes = []; // массив всех дочерних заметок
        const element = (this.element = document.createElement("div")); // создаем новый <div>
        element.classList.add("column"); // добавляем к нему класс
        element.setAttribute("draggable", "true"); // добавляем аттрибут

        if (id) {
            element.setAttribute("data-column-id", id);
        } else {
            element.setAttribute("data-column-id", Column.idCounter); // добавляем идентификатор
            Column.idCounter++;
        }

        element.innerHTML = `
    <p class="column-header">В плане</p>
    <div data-notes></div>
    <p class="column-footer">
        <span data-action-addNote class="action">+ Добавить карточку</span>
    </p>
    `;
        const spanAction_AddNote = element.querySelector("[data-action-addNote]");
        // вешаем на кнопку событие клик, при добавлении создается новая карточка
        spanAction_AddNote.addEventListener("click", function (event) {

            const note = new Note; // создаем новую заметку
            instance.add(note); // добавляем созданный элемент в   конец списка

            note.element.setAttribute("contenteditable", "true"); // редактируем карточку при создании
            note.element.focus();
        });

        const headerElement = element.querySelector(".column-header");
        headerElement.addEventListener("dblclick", function (event) {
            headerElement.setAttribute("contenteditable", "true"); // при двойном клике добавляем атрибут редактирования поля
            headerElement.focus();
        });
        headerElement.addEventListener("blur", function (event) {
            headerElement.removeAttribute("contenteditable"); // если убираем фокус, атрибут удаляется
        });

        element.addEventListener("dragstart", this.dragstart.bind(this));
        element.addEventListener("dragend", this.dragend.bind(this));
        element.addEventListener("dragover", this.dragover.bind(this));
        element.addEventListener("drop", this.drop.bind(this));
    }

    // проходимся по всем заметкам в массиве
    add(...notes) {
        for (const note of notes) {
            if (!this.notes.includes(note)) {
                this.notes.push(note); // если заметки отсутствуют в списке, добавляем их в конец списка

                this.element.querySelector('[data-notes]').append(note.element);
            }
        }
    }

    dragstart(event) {
        Column.dragged = this.element;
        Column.dragged.classList.add("dragged");
        event.stopPropagation();

        document
            .querySelectorAll("note")
            .forEach(noteElement => noteElement.removeAttribute("[draggable]"));
    }
    dragend(event) {
        Column.dragged.classList.remove("dragged");
        Column.dragged = null;
        Column.dropped = null;

        document
            .querySelectorAll("note")
            .forEach(noteElement => noteElement.setAttribute("[draggable]", "true"));

        document
            .querySelectorAll('.column')
            .forEach(columnElement => columnElement.classList.remove("under"))

        Application.save(); // сохраняем состояние
    }

    dragover(event) {
        event.preventDefault(); // отменяем стандартное поведение события
        event.stopPropagation();

        if (Column.dragged === this.element) {
            if (Column.dropped) {
                columnElement.classList.remove("under");
            }
            Column.dropped = null;
        }

        if (!Column.dragged || Column.dragged === this.element) {
            return;
        }

        Column.dropped = this.element;

        document
            .querySelectorAll("column")
            .forEach(columnElement => columnElement.classList.remove("under"));

        this.element.classList.add("under");
    }

    drop(event) {
        event.stopPropagation();
        if (Note.dragged) {
            return this.element.querySelector("[data-notes]").append(Note.dragged);
        } else if (Column.dragged) {
            const children = Array.from(document.querySelector(".columns").children);
            const indexA = children.indexOf(this.element);
            const indexB = children.indexOf(Column.dragged);

            if (indexA < indexB) {
                document
                    .querySelector(".columns")
                    .insertBefore(Column.dragged, this.element);
            } else {
                document
                    .querySelector(".columns")
                    .insertBefore(Column.dragged, this.element.nextElementSibling);
            }

            document
                .querySelectorAll(".column")
                .forEach(columnElement => columnElement.classList.remove("under"));
        }
    }
}

Column.idCounter = 4; //id следующих по счету элементов
Column.dragged = null; // ссылка на элемент, который перетаскиваем
Column.dropped = null; // ссылка на элемент, над которым водим мышью