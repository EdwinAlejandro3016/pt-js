//variables
const tasks = [];
let selector;

//selecionando etiquetas
const tasksContainer = document.querySelector(".all-tasks-container");
const formDataTask = document.querySelector(".form-data-task");

const formEdit = document.querySelector(".form-edit");
const containerFormEdit = document.querySelector(".container-form-edit");

formEdit.addEventListener('submit',(e)=>{
    editTask(e);
})

formDataTask.addEventListener('submit',(e)=>{addNewTask(e)});

//generate time

//crear template
const generateTemplate = (title,description,id)=>{
    const task = {
        id,
        title,
        description
    }

    //crear boton de editar
    const btnEdit = document.createElement('a');
    btnEdit.classList.add('btn');
    btnEdit.classList.add('btn-secondary');
    btnEdit.classList.add("btn-edit");

    const iconEdit = document.createElement('i');
    iconEdit.classList.add("fas");
    iconEdit.classList.add("fa-marker");
    btnEdit.appendChild(iconEdit);

    //crear boton de eliminar
    const btnDelete = document.createElement('a');
    btnDelete.classList.add('btn');
    btnDelete.classList.add('btn-danger');
    btnDelete.classList.add("btn-delete");

    const iconDelete = document.createElement('i');
    iconDelete.classList.add("far");
    iconDelete.classList.add("fa-trash-alt");

    btnDelete.appendChild(iconDelete);

    //armar html text
    const data = document.createElement('tr');
    data.setAttribute('id',id);
    const tdTitle = document.createElement('td');
    tdTitle.innerText = title;
    const tdDescription = document.createElement('td');
    tdDescription.innerText = description;

    data.appendChild(tdTitle);
    data.appendChild(tdDescription);

    const actions = document.createElement('td');
    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    data.appendChild(actions);

    tasksContainer.appendChild(data)

    const allBtnEdit = document.querySelectorAll('.btn-edit');
    const allBtnDelete = document.querySelectorAll('.btn-delete');
    
    allBtnDelete.forEach(i=>{
        const parent = i.parentNode.parentNode
        const id = parent.id;
        i.addEventListener('click',()=>deleteTask(id,parent));
    })

    allBtnEdit.forEach(i=>{
        const parent = i.parentNode.parentNode
        const id = parent.id;
        i.addEventListener('click',()=>showModalEdit(id,parent))
    })

    return task;
}
//CRUB JAVASCRIPT

//agregar nueva tarea
const addNewTask = (e)=>{
    const id = crypto.randomUUID();
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const task = generateTemplate(title,description,id);

    
    //agregar al local
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(tasks));

    e.target.title.value = "";
    e.target.description.value = "";
}

//leer tareas
const getTasks = ()=>{
    const query = localStorage.getItem('tasks');
    if(!query){
        localStorage.setItem('tasks',JSON.stringify([]));
        return;
    }
    const result = JSON.parse(localStorage.getItem('tasks'));


    result.forEach(({title,description,id})=>{
        generateTemplate(title,description,id);
    })
}

//editar tarea
const showModalEdit = (id,selector)=>{
    containerFormEdit.style.display = "block";
    formEdit.setAttribute('id',id);
    const children = selector.childNodes;

    formEdit.title.value = children[0].textContent;
    formEdit.description.value = children[1].textContent;
}

const editTask = (e)=>{
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const result = JSON.parse(localStorage.getItem('tasks'));
    const id = e.target.id;

    const task = result.find(i=> i.id === id);
    const newTask = {...task};

    newTask.title = title;
    newTask.description = description;

    const taskIndex = result.findIndex(i=> i.id === id);

    result[taskIndex] = newTask;

    localStorage.setItem('tasks',JSON.stringify(result));

    tasksContainer.innerHTML = '';
    containerFormEdit.style.display = "none";
    getTasks();
}

//eliminar tarea
const deleteTask = (id,target)=>{
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const updatedTasks = tasks.filter(i=> i.id !== id);

    const parent = target.parentNode;
    try {
        parent.removeChild(target);    
    } catch (error) {
        console.log(error)
    }

    localStorage.setItem('tasks',JSON.stringify(updatedTasks));
}

getTasks();