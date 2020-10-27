const app = require("../app");

const request = require("supertest");


let token, refreshToken;

beforeAll((done) => {
    request(app)
      .post('/user/login')
      .send({
        email: "user1@gmail.com",
        password: "1234",
      })
      .end((err, response) => {
        token = response.body.info.accessToken; // save the token!
        refreshToken = response.body.info.refreshToken
        done();
      });
  });
describe("POST /user/register" , () => {
    test("test register", async () => {
        const newUser = await request(app).post("/user/register").send({
            "password": "1234",
            "email": "email3@email.com",
        });
        expect(newUser.status).toBe(400);
    });

    test("test validate password register", async () => {
        const newUser = await request(app).post("/user/register").send({
            "password": "123@4",
            "email": "email5@email.com",
        });
        expect(newUser.status).toBe(400);
    });

    test("test validate email register", async () => {
        const newUser = await request(app).post("/user/register").send({
            "password": "1234",
            "email": "email5email.com",
        });
        expect(newUser.status).toBe(400);
    });

    test("test validate email register 2", async () => {
        const newUser = await request(app).post("/user/register").send({
            "password": "1234@cDsadw",
            "email": "email332@email.com",
        });
        expect(newUser.status).toBe(415);
    });

    test("test validate email register 2", async () => {
        const newUser = await request(app).post("/user/register").send({
            "password": "1234@cDsadw",
            "email": "email7@ggmail.com",
            "base64Image": ""
        });
        expect(newUser.status).toBe(415);
    })
});

describe("POST /user/login", () => {
    test("test login", async () => {
        const loginUser = await request(app).post("/user/login").send({
            "password": "1234",
            "email": "user1@gmail.com",
        });
        expect(loginUser.status).toBe(200);
    });

    test("test login no email", async () => {
        const loginUser = await request(app).post("/user/login").send({
            "password": "1234",
            "email": "",
        });
        expect(loginUser.status).toBe(404);
    });

    test("test login no password", async () => {
        const loginUser = await request(app).post("/user/login").send({
            "password": "",
            "email": "user1@gmail.com",
        });
        expect(loginUser.status).toBe(404);
    });

    test("test login wrong password", async () => {
        const loginUser = await request(app).post("/user/login").send({
            "password": "1234@",
            "email": "user1@gmail.com",
        });
        expect(loginUser.body.error).toMatch("WRONG_PASSWORD");
        expect(loginUser.status).toBe(404);
        
    });

    test("test login wrong password 2", async () => {
        const loginUser = await request(app).post("/user/login").send({
            "password": "1234123",
            "email": "user1@gmail.com",
        });
        expect(loginUser.body.error).toMatch("WRONG_PASSWORD");
        expect(loginUser.status).toBe(404);
        
    });

    test("test login wrong email", async () => {
        const loginUser = await request(app).post("/user/login").send({
            "password": "1234123",
            "email": "user1@gmail",
        });
        expect(loginUser.body.error).toMatch("EMAIL_NOT_FOUND");
        expect(loginUser.status).toBe(404);
        
    });
});

describe("GET /user/profile", () => {
    test("Get user profile" , async () => {
        const userInfo = await request(app).get("/user/profile").set('Authorization', `Bearer ${token}`).expect(200);
    })
});

describe("GET /user/profile", () => {
    test("Get user profile" , async () => {
        const userInfo = await request(app).get("/user/profile").expect(401);
    })
})

// describe("POST /token/AccessToken", () => {
//     test("refresh token legit", async () => {
//         const token = await request(app).post("token/AccessToken").set("refreshtoken", refreshToken)
//     .send({
//         "userSortKey": "userSKcdd5f2e1-4baa-4ad4-8526-9056eee1a28c"
//     });
//     console.log(token);
//     expect(token.body.Message).toMatch("New Token Was Generated");
//     })
    
// })

describe("POST /product", () => {

    test("get product without authen", async () => {
        const item = await request(app).post("/product").send({
            "limit": 5
        });
        expect(item.status).toBe(401);
    })

    test("get product with authen no last key", async () => {
        const item = await request(app).post("/product").set('Authorization', `Bearer ${token}`).send({
            "limit": 5
        });
        expect(item.status).toBe(200);
    });

    test("get product with no limit and last key", async () => {
        const item = await request(app).post("/product").set('Authorization', `Bearer ${token}`)
        expect(item.status).toBe(200);
    });

    test("get product with limit and last key", async () => {
        const item = await request(app).post("/product").set('Authorization', `Bearer ${token}`).send({
            "limit": 5,
            "ExclusiveStartKey": {
                "partitionKey": "itemPK",
                "sortKey": "itemSK2fac5113-3c23-46dc-8e9c-b88e28e0865b"
            }
        });
        expect(item.status).toBe(200);
    })

    test("get product with limit and last key empty", async () => {
        const item = await request(app).post("/product").set('Authorization', `Bearer ${token}`).send({
            "limit": "",
            "ExclusiveStartKey": ""
        });
        expect(item.status).toBe(200);
    });

    test("get product with limit empty", async () => {
        const item = await request(app).post("/product").set('Authorization', `Bearer ${token}`).send({
            "limit": ""
        });
        expect(item.status).toBe(200);
    });

    test("get product with last key empty", async () => {
        const item = await request(app).post("/product").set('Authorization', `Bearer ${token}`).send({
            "ExclusiveStartKey": ""
        });
        expect(item.status).toBe(200);
    })
});

describe("GET /product/single/{id}", () => {
    test("get 1 item details", async () => {
        const id = "itemSKe16a58cf-dd9d-4fea-9410-6d8b4f308c4f";
        const item = await request(app).get(`/product/single/${id}`).set('Authorization', `Bearer ${token}`).expect('Content-Type', /json/)
        expect(item.body.product.Item.sortKey).toMatch("itemSKe16a58cf-dd9d-4fea-9410-6d8b4f308c4f")
        expect(item.status).toBe(200);
    });

    test("get 1 item details w/o token", async () => {
        const id = "itemSKe16a58cf-dd9d-4fea-9410-6d8b4f308c4f";
        const item = await request(app).get(`/product/single/${id}`);
        expect(item.status).toBe(401);
    });

    test("get 1 item details wrong id", async () => {
        const id = "wrongid";
        const item = await request(app).get(`/product/single/${id}`).set('Authorization', `Bearer ${token}`)
        expect(item.status).toBe(400);
    })
});

describe("POST /product/favorite", () => {
    test("add item to favorite list", async () => {
        const item = await request(app).post("/product/favorite").set('Authorization', `Bearer ${token}`).send({
            "itemId": "itemSK6f121bbd-8b47-48a6-8b10-c92fa5f9fec1"
        }).expect(400)
    });

    test("add item to favorite list no token", async () => {
        const item = await request(app).post("/product/favorite").send({
            "itemId": "itemSK6f121bbd-8b47-48a6-8b10-c92fa5f9fec1"
        }).expect(401)
    });

});

describe("GET /product/favoriteList", () => {
    test("show favorite list", async () => {
        const item = await request(app).get("/product/favoriteList").set('Authorization', `Bearer ${token}`).expect(200)
    });

    test("show favorite list no token", async () => {
        const item = await request(app).get("/product/favoriteList").expect(401)
    });

    test("show favorite list", async () => {
        const item = await request(app).get("/product/favoriteList").set('Authorization', `Bearer asd`)
        expect(item.status).toBe(401);
        expect(item.body.error).toMatch("jwt malformed");
    });

    test("show favorite list expired token", async () => {
        const item = await request(app).get("/product/favoriteList").set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0aXRpb25JZCI6InVzZXJQSyIsInNvcnRJZCI6InVzZXJTS2NkZDVmMmUxLTRiYWEtNGFkNC04NTI2LTkwNTZlZWUxYTI4YyIsImlhdCI6MTYwMzY4NjMwNSwiZXhwIjoxNjAzNjg5OTA1fQ.Zu3FHfh-cWlhy6KHPCXnLNFVY8L52K5JlxWOcloaEO4`)
        expect(item.status).toBe(401);
        expect(item.body.error).toMatch("jwt expired");
    });

    test("show favorite list no token", async () => {
        const item = await request(app).get("/product/favoriteList")
        expect(item.status).toBe(401);
        expect(item.body.error).toMatch("No auth token");
    });

    test("show favorite list wrong token", async () => {
        const item = await request(app).get("/product/favoriteList").set('Authorization', `Bearer eyJhbGciOiJIUzI1IsInR5cCI6IkpXVCJ9.eyJwYXJ0aXRpb25JZCI6InVzZXJQSyIsInNvcnRJZCI6InVzZXJTS2NkZDVmMmUxLTRiYWEtNGFkNC04NTI2LTkwNTZlZWUxYTI4YyIsImlhdCI6MTYwMzY4NjMwNSwiZXhwIjoxNjAzNjg5OTA1fQ.Zu3FHfh-cWlhy6KHPCXnLNFVY8L52K5JlxWOcloaEO4`)
        expect(item.status).toBe(401);
        expect(item.body.error).toMatch("invalid token");
    });
    
});

describe("POST /product/disliked", () => {
    test("disliked a item", async () => {
        const item = await request(app).post("/product/disliked").set('Authorization', `Bearer ${token}`).send({
            "itemId":"itemSK239dbfd2-9ca2-4c13-8205-b80a77151d28"
        });
        expect(item.status).toBe(400);
       
    });

    test("disliked a item", async () => {
        const item = await request(app).post("/product/disliked").send({
            "itemId":"itemSK239dbfd2-9ca2-4c13-8205-b80a77151d28"
        });
        expect(item.status).toBe(401);
        expect(item.body.error).toMatch("No auth token")
    });

    test("disliked a item", async () => {
        const item = await request(app).post("/product/disliked").set('Authorization', `Bearer asdadeearasfa541526533#@fas`).send({
            "itemId":"itemSK239dbfd2-9ca2-4c13-8205-b80a77151d28"
        });
        expect(item.status).toBe(401);
        expect(item.body.error).toMatch("jwt malformed")
    });

})


    

