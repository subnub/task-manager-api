
const loginButton = document.querySelector("#login-button");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const loadingBar = document.querySelector("#loader-div");

const startLogin = () => {

    loginButton.addEventListener("click", () => {

        const email = emailInput.value;
        const password = passwordInput.value;
       
        console.log("email and password", email + " " + password);
        
    
        loadingBar.style.visibility = "visible"
        startLogin(email, password)
        
    })
    
    const startLogin = async(email, password) => {
    
        const obj = {email, password}
    
        const user = await fetch("/users/login", {
            method: "POST",
            body: JSON.stringify(obj),
            headers:{
                'Content-Type': 'application/json'
              }
        })
    
        loadingBar.style.visibility = "hidden";
    
        if (user.status === 400) {
    
            return console.log("Login Error");
    
        }
    
        const JSONData = await user.json();
        const token = JSONData.token;
    
        console.log("user-token", token);
    
        console.log("logged-in", user.status === 200)
    
        window.localStorage.accessToken = token;
    
        console.log("saved token", window.localStorage.accessToken);
    
        window.location.replace("/home");
        
    
    
    }

}

if (window.sessionStorage.accessToken) {

    const testLogin = async() => {

        try {

            console.log("token");

            const token = window.localStorage.accessToken;


            const user = await fetch("/users/login-checker", {
                method: "GET", 
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token,
                }
            })
    
            if (user.status === 200) {
    
                console.log("already signed in", user.status === 200);
                window.location.replace("/home");
            }

        } catch (e) {

            startLogin();
        }


    }

    testLogin()

    
} else {

    startLogin();
}



