const token = window.localStorage.accessToken;


const logout = async() => {

    const createTask = await fetch("/users/logout", {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
        }
    })

    if (createTask.status === 200) {

        window.localStorage.removeItem("accessToken")
        window.location.replace("/");
    }
}

logout();