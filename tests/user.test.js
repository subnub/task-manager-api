const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {userOneId, userOne, setupDatabase} = require("./fixtures/db")

beforeEach( async() => {

   await setupDatabase()
    

})

afterEach(() => {

    console.log("after each");
})

test("Should signup new user", async() => {

    const response = await request(app).post("/users").send({
        name: "Kyle Hoell", 
        email: "kyle.hoell@gmail.com",
        password:"kyle1234"
    }).expect(201)

    // Makes sure the user is actually saved
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({

        user: {
            name: "Kyle Hoell",
            email: "kyle.hoell@gmail.com"
        }, 
        token: user.tokens[0].token
    });

    // Makes sure the password isnt stored in 
    // Plain text.
    expect(user.password).not.toBe("kyle1234");
})

test("Should login user",async() => {

    const response = await request(app).post("/users/login").send({
        email: userOne.email, 
        password: userOne.password,

    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        token: user.tokens[1].token
        // We use the second token in the array (index 1), 
        // Because one is already created with the before each, 
        // So we need to match up the second one created with 
        // Login
    })

})

test("Should not login notexhistent user", async() => {

    await request(app).post("/users/login").send({
        email: "idontexhist@gmail.com",
        password: "kyle1234"

    }).expect(400);
})

test("Should get profile for user", async() => {

    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test("should delete profile", async() => {

    const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    console.log(response.body)

    const user = await User.findById(response.body._id);
    expect(user).toBeNull()
    
})

test("should not delete profile", async() => {
    await request(app).delete("/users/me")
    .set("Authorization", `Bearer 13424fsdfsfsd`)
    .send()
    .expect(401);
})

test("Should upload avatar image", async() => {

    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))

})

test("Should update valid user fields", async() => {

    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name:"Ben Franklin"
        }).expect(200)

    const user = await User.findById(userOneId);
    expect(user.name).toEqual("Ben Franklin")
})

test("Should not update user", async() => {

    await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        dog: "shibe"
    }).expect(400)
})