const input = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');

// load tasks from localStorage when page is loaded
document.addEventListener('DOMContentLoaded', loadTasks);

// add a task when btn is clicked
addBtn.addEventListener('click', addTask);

// add task a task when key 'Enter' is pressed
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = input.value.trim(); // remove extra space

    if (taskText === '') {
        alert('You must add a task!');
        return; // stop if input is empty
    }

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = taskText; // put the task text in span

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.classList.add('delete-btn');

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li); // add task to the list

    input.value = '';        // clear input

    saveTasks(); // save to localStorage
}


list.addEventListener('click', function(e) {
    const target = e.target;

    // click text -> finished task
    if (target.tagName === 'SPAN') {
        target.parentElement.classList.toggle('completed');
        saveTasks();
    }

    // click ❌               btn -> delete task
    if (target.classList.contains('delete-btn')) {
        target.parentElement.remove();
        saveTasks();
    }
});

// fn to save tasks in localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// fn to load tasks in localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = task.text;

        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
        delBtn.classList.add('delete-btn');

        li.appendChild(span);
        li.appendChild(delBtn);

        if (task.completed) {
            li.classList.add('completed');
        }

        list.appendChild(li);
    });
}
