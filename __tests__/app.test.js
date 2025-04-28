const db = require("../db/connection"); //THIS IS THE DATABASE CONNECTION 
const seed = require("../db/seed");  //THIS IS OUR DATABASE SEED FUNCTION 
const data = require("../db/data/test-data/"); // THIS IS OUR TEST DATA 
const request = require("supertest"); //THIS IS SUPERTEST WHICH WILL SEND A REQUEST TO THE APP
const app = require("../app.js"); //THIS IS THE APP - IT IS AN EXPRESS SERVER 
const jestSorted = require("jest-sorted"); //THIS IS AN EXTENSION OF JEST FOR FURTHER TEST FUNCTIONS

beforeEach(() => {    //BEFORE EACH TEST IS RUN RE-SEED THE DATA 
  return seed(data);   //
});

afterAll(() => {  //AFTER ALL TESTS IN THIS SUITE HAVE FINISHED
  return db.end(); //CLOSE THE DATABASE CONNECTION SO NO HANGING TESTS
});

describe(" Testing GET request on /api/treaures endpoint ", () => {
    test("Server returns all treaures when passed GET request at /api/treaures endpoint ", () => {
        return request(app) //invoke supertest passing express server as the argument
        .get("/api/treasures") //this is the end point we send from supertest
        .expect(200) // this is the server status we expect to receive 
        .then(({body}) => {
            //console.log(body, "<<<<<< RESPONSE IN THE TEST")
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(26)
            expect(body).toContainEqual({
                treasure_id: 1, 
                treasure_name: "treasure-a", 
                colour: "turquoise", 
                age: 200, 
                cost_at_auction: 20, 
                shop_name: 1
            })
            expect(body[0].treasure_id).toBe(19) //check they are ordered correctly by default 
            expect(body[0].age).toBe(1)
            expect(body[25].treasure_id).toBe(7)
            expect(body[25].age).toBe(10865)
        })
    }) //test end
}); //block end

describe("Testing GET request on parametarized endpoint /api/treasures/:treasure_id", () => {
    test("Testing the app returns ONLY data from table where endpoint matches the param ID of 13 ", () => {
        return request(app)
        .get("/api/treasures/13")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(1)
            expect(body[0]).toHaveProperty("treasure_id")
            expect(body[0].treasure_id).toBe(13)
            expect(body[0]).toHaveProperty("treasure_name")
            expect(body[0]).toHaveProperty("colour")
            expect(body[0]).toHaveProperty("age")
            expect(body[0]).toHaveProperty("cost_at_auction")
            expect(body[0]).toHaveProperty("shop_name")
        })
    }) //test end 
    test("Testing the app returns ONLY data from table where endpoint matches the param ID of 25 ", () => {
        return request(app)
        .get("/api/treasures/25")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(1)
            expect(body[0]).toHaveProperty("treasure_id")
            expect(body[0].treasure_id).toBe(25)
            expect(body[0]).toHaveProperty("treasure_name")
            expect(body[0]).toHaveProperty("colour")
            expect(body[0]).toHaveProperty("age")
            expect(body[0]).toHaveProperty("cost_at_auction")
            expect(body[0]).toHaveProperty("shop_name")
        })
    }) //test end 
}); //block end

describe(" Testing GET request on /api/treasures? with a query string ", () => {
    test(" Server returns all treasures sorted by the given query string - COST_AT_AUCTION ", () => {
        return request(app)
        .get("/api/treasures?sortby=cost_at_auction") //passed the cost at auction sort query 
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(26)
            expect(body[0].treasure_id).toBe(4) //check the lowest is first in array 
            expect(body[25].treasure_id).toBe(7) //check the highest is last in array 
            expect(body[0].cost_at_auction).toBe(0.01) //check they are ordered correctly by default 
            expect(body[25].cost_at_auction).toBe(99999.99)
            expect(body).toBeSortedBy("cost_at_auction") //use a JEST SORTED check 
        })
    }) // TEST END

    test(" Server returns all treasures sorted by the given query string - TREASURE_NAME ", () => {
        return request(app)
        .get("/api/treasures?sortby=treasure_name") //passed the treasure name sort query 
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(26)
            expect(body[0].treasure_name).toBe("treasure-a") //check 'a' comes first alphabetically 
            expect(body[25].treasure_name).toBe("treasure-z") //check 'z' comes last alphabetically 
            expect(body).toBeSortedBy("treasure_name") //use a JEST SORTED check 
        })
    }) // TEST END

    test(" Server returns all treasures sorted by the given query string - AGE ", () => {
        return request(app)
        .get("/api/treasures?sortby=age")  //passed the age sort query
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(26)
            expect(body[0].treasure_id).toBe(19)
            expect(body[0].age).toBe(1)
            expect(body[25].treasure_id).toBe(7)
            expect(body[25].age).toBe(10865)
            expect(body).toBeSortedBy("age") //use a JEST SORTED check 
        })
    }) // TEST END
}) // BLOCK END 

describe(" Testing the /api/treasures endpoint accepts an order query ", () => {
    test(" App should return treasures sorted by default AGE but ordered DESC when client sends new order query ", () => {
        return request(app)
        .get("/api/treasures?order=desc")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(26)
            expect(body).toBeSortedBy("age", {descending: true}) //JEST Sorted check 
            expect(body[0].age).toBe(10865) //oldest will be first as order is now DESC 
            expect(body[25].age).toBe(1) //youngest will be last as order is now DESC
        })
    }) //test end
}) //block end 

describe(" Testing the /api/treasures endpoint accepts a colour query ", () => {
    test(" App should return ONLY treasures matching the queried colour ", () => {
        return request(app)
        .get("/api/treasures?colour=gold")
        .expect(200)
        .then(({body}) => {
            body.forEach((treasure) => {
                expect(treasure.colour).toBe("gold")
            })
            expect(Array.isArray(body)).toBe(true)
            expect(body).toBeSortedBy("age") //default sort should still be working
        })
    }) //test end
}) //block end 

