class Note {
    constructor(id = null, content = '') {
        const instance = this;
        const element = this.element = document.createElement("div"); // создаем новый <div>
        element.classList.add("note"); // добавляем к нему класс
        element.setAttribute("draggable", "true"); // добавляем аттрибут
        element.textContent = content;

        if (id) {
            element.setAttribute("data-note-id", id);
        } else {
            element.setAttribute("data-note-id", Note.idCounter); // добавляем идентификатор
            Note.idCounter++;
        }

        element.addEventListener("dblclick", function (event) {
            element.setAttribute("contenteditable", "true"); // при двойном клике добавляем атрибут редактирования поля
            //element.removeAttribute("draggable");
            instance.column.removeAttribute("draggable");
            element.focus();
        });
        element.addEventListener("blur", function (event) {
            element.removeAttribute("contenteditable"); // если убираем фокус, атрибут удаляется
            element.setAttribute("draggable", "true");
            instance.column.setAttribute("draggable", "true");
            if (!element.textContent.trim().length) {
                element.remove(); // если элемент пустой, он удаляется
            }

            Application.save(); // сохраняем состояние
        });

        element.addEventListener("dragstart", this.dragstart.bind(this));
        element.addEventListener("dragend", this.dragend.bind(this));
        element.addEventListener("dragenter", this.dragenter.bind(this));
        element.addEventListener("dragover", this.dragover.bind(this));
        element.addEventListener("dragleave", this.dragleave.bind(this));
        element.addEventListener("drop", this.drop.bind(this));


    }
    get column() {
        return this.element.closest(".column");
    }

    dragstart(event) {
        Note.dragged = this.element;
        this.element.classList.add("dragged");

        event.stopPropagation();
    }

    dragend(event) {
        Note.dragged = null;
        this.element.classList.remove("dragged");

        document.querySelectorAll(".note").forEach(x => x.classList.remove("under"));
        event.stopPropagation();

        Application.save(); // сохраняем состояние
    }

    dragenter(event) {
        if (!Note.dragged || this.element === Note.dragged) {
            return;
        }
        this.element.classList.add("under");
    }

    dragover(event) {
        event.preventDefault();
        if (!Note.dragged || this.element === Note.dragged) {
            return;
        }
    }

    dragleave(event) {
        if (!Note.dragged || this.element === Note.dragged) {
            return;
        }
        this.element.classList.remove("under");
    }

    drop(event) {
        event.stopPropagation();
        if (!Note.dragged || this.element === Note.dragged) {
            return;
        }

        if (this.element.parentElement === Note.dragged.parentElement) {
            const note = Array.from(this.element.elementparentElement.querySelectorAll(".note"));
            const indexA = note.indexOf(this.element);
            const indexB = note.indexOf(Note.dragged);

            if (indexA < indexB) {
                this.element.parentElement.insertBefore(Note.dragged, this.element);
            } else {
                this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling);
            }
        } // если элементы принадлежат одному и тому же родителю, мы меняем их порядок в колонке
        else {
            this.element.parentElement.insertBefore(Note.dragged, this.element); // иначе меняем карточки местами
        }
    }
}


Note.idCounter = 8; //id следующих по счету элементов
Note.dragged = null; // ссылка на элемент, который перетаскиваем