const createButton = document.querySelector("#createTaskButton");
const inputBox = document.querySelector("#createTextArea");
const checkBox = document.querySelector("#createCheckBox");
const token = window.localStorage.accessToken;


createButton.addEventListener("click", async function() {

    const descValue = inputBox.value;
    const completedValue = checkBox.checked;

    const obj = {desc: descValue, completed:completedValue}

    // console.log("sending", descValue + " " + completedValue)

    const createTask = await fetch("/tasks", {
        method: "POST", 
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
        }
    })

    if (createTask.status === 201) {

        console.log("task created");
        window.location.replace("/home");
    }
})