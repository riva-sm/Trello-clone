const Application = {
    // функция для сохранения данных
    save() {
        const object = {
            columns: {
                idCounter: Column.idCounter,
                items: []
            },
            notes: {
                idCounter: Note.idCounter,
                items: []
            },

        }
        document.querySelectorAll('.column').forEach(columnElement => {
            const column = {
                // title: '',
                id: parseInt(columnElement.getAttribute('data-column-id')),
                noteIds: []
            }
            // проходимся циклом по всем колонкам и добавляем их ID в массив
            columnElement.querySelectorAll('.note').forEach(noteElement => {
                column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')));
            })
            object.columns.items.push(column);
        });
        // проходимся циклом по всем заметкам и добавляем их ID и содержимое в массив
        document.querySelectorAll('.note').forEach(noteElement => {
            const note = {
                id: parseInt(noteElement.getAttribute('data-note-id')),
                content: noteElement.textContent
            }
            object.notes.items.push(note);
        });

        const json = JSON.stringify(object) // преобразуем полученные данные в JSON

        localStorage.setItem('trello', json); // сохраняем данные в локальное хранилище
    },
    // функция загрузки данных из LocalStorage
    load() {
        if (!localStorage.getItem('trello')) {
            return;
        }

        // очищаем все колонки
        const mountePoint = document.querySelector('.columns');
        mountePoint.innerHTML = '';

        const object = JSON.parse(localStorage.getItem('trello'));
        // получаем заметку по ID
        const getNoteById = id => object.notes.items.find(note => note.id === id);

        // вставляем колонки
        for (const {
                id,
                noteIds
            } of object.columns.items) {
            const column = new Column(id);
            mountePoint.append(column.element);

            for (const noteId of noteIds) {
                const {
                    id,
                    content
                } = getNoteById(noteId);
                const note = new Note(id, content); // создаем новую заметку
                column.add(note); // добавляем созданную заметку в колонку
            }

        }
    }
}