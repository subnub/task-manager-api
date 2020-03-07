const request = require("supertest");
const Task = require("../src/models/task");
const {userOneId, userOne, setupDatabase} = require("./fixtures/db")
const app = require("../src/app");

beforeEach(setupDatabase);

console.log("token", userOne.tokens[0].token);

test("Should create a task for user", async() => {

    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({

            desc:"From my test",

        }).expect(201)

    const task = await Task.findById(response.body._id);

    expect(task).not.toBeNull();

    expect(task.completed).toBe(false);

})


