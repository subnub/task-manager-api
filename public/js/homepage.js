const allTaskList = document.querySelector("#all-task-list")
const token = window.localStorage.accessToken;
const pageList = document.querySelector("#page_list");
const previousPage = document.querySelector("#previousPage");
const currentPage = document.querySelector("#currentPage");
const nextPage = document.querySelector("#nextPage");

console.log("completed");


const checkNumOfTasks = async() => {

    const taskNumberObject = await fetch("/tasks/number", {

        method: "GET",
        headers: {

            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
        }

    });

    const toJSON = await taskNumberObject.json();

    console.log(toJSON.task_length)


    const listLength = toJSON.task_length;

    // GET /tasks?limit=10&skip=0
    // GET /tasks?sortBy=createdAt_asc

    let listElementBy10 = Math.ceil(listLength / 10);

    let pageNumber = 1;

    nextPage.addEventListener("click", async function() {

        console.log("clicked");
        

        if (pageNumber < listElementBy10) {

            pageNumber++;
        }

        currentPage.innerHTML = `${pageNumber}/${listElementBy10}`;

        if (pageNumber != 1) {

            console.log("pagenum", pageNumber);
            console.log("10", listElementBy10)

            return await getTasks(`/tasks?limit=10&skip=${(pageNumber -1) * 10}`)
        } else {
            return await getTasks(`/tasks?limit=10`);
        }
    
    })

    previousPage.addEventListener("click", async function() {

        console.log("clicked");
        

        if (pageNumber > 1) {

            pageNumber--;
        }

        currentPage.innerHTML = `${pageNumber}/${listElementBy10}`;

        if (pageNumber != 1) {

            console.log("pagenum", pageNumber);
            console.log("10", listElementBy10)

            return await getTasks(`/tasks?limit=10&skip=${(pageNumber -1) * 10}`)
        } else {
            return await getTasks(`/tasks?limit=10`);
        }
    
    })

    return {url:`/tasks?limit=10`,task_length: listLength}


    

}

const getTasks = async(url) => {

    const taskList = await fetch(url, {
        method: "GET", 
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
        }
    })

    const taskListJSON = await taskList.json();

    console.log("items", Object.keys(taskListJSON));

    const taskKeys = Object.keys(taskListJSON);

    while (allTaskList.listLength) {allTaskList.pop()}

    allTaskList.innerHTML = "";

    taskKeys.forEach((key) => {

        const desc = taskListJSON[key].desc;
        const createdDate = taskListJSON[key].createdAt;
        const id = taskListJSON[key]._id;
        const completed = taskListJSON[key].completed;
        
        const li6 = document.createElement("li")
        li6.innerHTML = `<div style="margin-top:40px"><p>Description: ${desc}</p><p>Created: ${createdDate}</p><input id = 'checkBox'name='isCompleted' type='checkbox'>Completed</div>`;
        
        const checkBox = li6.querySelector("#checkBox");
        checkBox.checked = completed;

        checkBox.addEventListener("change", async function() {

            const obj = {completed:checkBox.checked};

            const updateTask = await fetch(`/tasks/${id}`, {
                method: "PATCH", 
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token,
                }
            })

            console.log(updateTask);
            console.log("updated task", updateTask.status === 200);
            
        })


        allTaskList.append(li6)

        return


    })
}

const startMain = async() => {


    const {url, task_length} = await checkNumOfTasks();

    await getTasks(url);
}

startMain()