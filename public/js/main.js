/* Majd Saad 315685586, Razan Abo alhija 322509118 */
/* Main windows tasks script */
document.addEventListener('DOMContentLoaded', loadTasks);
// get tasks for user
function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            let openTasksList = document.getElementById('openTasks');
            let completedTasksList = document.getElementById('completedTasks');
            openTasksList.innerHTML = '';
            completedTasksList.innerHTML = '';
            data.openTasks.forEach(task => {
                let li = createTaskElement(task, 'openTasks');
                openTasksList.appendChild(li);
            });

            data.completedTasks.forEach(task => {
                let li = createTaskElement(task, 'completedTasks');
                completedTasksList.appendChild(li);
            });

        })
        .catch(() => {
            window.location.href = '/';
        });
}
//create new task element 
function createTaskElement(task, listId) {
    let li = document.createElement('li');
    li.textContent = task;
    li.setAttribute('draggable', true);
    li.setAttribute('ondragstart', 'drag(event)');
    li.setAttribute('data-list-id', listId);
    li.id = `${listId}-${task}`;
    return li;
}
// add tasks - first create task element and then add it to the list
function addTask() {
    let newTask = document.getElementById('newTask').value;
    if (newTask) {
        let openTasksList = document.getElementById('openTasks');
        let li = createTaskElement(newTask, 'openTasks');
        openTasksList.appendChild(li);

        saveTasks();
        document.getElementById('newTask').value = '';
    }
}

function saveTasks() {
    let openTasks = [];
    document.querySelectorAll('#openTasks li').forEach(li => openTasks.push(li.textContent));

    let completedTasks = [];
    document.querySelectorAll('#completedTasks li').forEach(li => completedTasks.push(li.textContent));

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ openTasks, completedTasks })
    });
}
// remove completed tasks when click on button
function removeCompletedTasks() {
    const completedTasksList = document.getElementById('completedTasks');
    completedTasksList.innerHTML = ''; 

    saveTasks(); 
}
//drag and drop got help of ChatGPT
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData('text');
    let draggedElement = document.getElementById(data);
    let targetList = event.target.closest('ul');
    if (targetList && draggedElement) {
        targetList.appendChild(draggedElement);
        draggedElement.setAttribute('data-list-id', targetList.id);

        saveTasks();
    }
}

function logout() {
    //Kill the cookie by assign the Max-Age = 0
    document.cookie = 'userToken=; Max-Age=0';
    window.location.href = '/';
}
