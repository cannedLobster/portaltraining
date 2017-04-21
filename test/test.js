var assert = require('chai').assert;
var request = require('superagent');

var UserModel = require('../models/user');
var MenuModel = require('../models/menu');

var port = 3001;
//var port = process.env.PORT;
before(function() {
  console.log(`Attempting on start server on port ${port}`);
  require('../bin/www');
});

describe("Menu API", function() {
  var testObj = {
    name: "TEST",
    desc: "TEST DESC",
    price: 999,
    img: "TEST.JPG",
    menu_id: 999
  };
  it('should post and delete menu', function(done) {
    request
    .post(`http://localhost:${port}/menu`)
    .send(testObj)
    .end(function(err, res) {
      assert.equal(res.statusCode, 200, 'Status code 200');
      assert.equal(res.type, 'application/json', 'Content type JSON');
      //Check data
      assert.equal(res.body.name, testObj.name, 'Check-content: name');
      assert.equal(res.body.desc, testObj.desc, 'Check-content: description');
      assert.equal(res.body.price, testObj.price, 'Check-content: price');
      assert.equal(res.body.img, testObj.img, 'Check-content: image');
      assert.equal(res.body.menu_id, testObj.menu_id, 'Check-content: menu ID');
      var testObjID = res.body._id;
      request
      .delete(`http://localhost:${port}/menu/` + testObjID)
      .end(function(err, res) {
        assert.equal(res.statusCode, 200, 'Status code 200');
        done();
      });
    });
  });
  it('should get menu', function(done){
    request
    .get(`http://localhost:${port}/menu`)
    .end(function(err, res) {
      //Check status
      assert.equal(res.statusCode, 200, 'Status code 200');
      //Content type
      assert.equal(res.type, 'application/json', 'Content type JSON');
      //check data
      assert.isOk(Array.isArray(res.body), 'Expected response to be an array');
      assert.isOk(res.body.length > 0, 'Response not empty');
      done();
    });
  });
});

describe("User API", function() {
  let agent = null;
  let testUser = {
    name: "TESTUSER",
    user: "testusername1",
    email: "test1@email.com",
    pass: "testpass"
  };
  let testLogin = {
    user: testUser.user,
    pass: testUser.pass
  };
  let testId;
  before('should register test user', function(done) {
    agent = request.agent();
    agent
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .then(function(res){
      assert.isOk(res.body.success);
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
  it('should logout and login registered test user', function(done) {
    agent
    .get(`http://localhost:${port}/logout`);
    agent
    .post(`http://localhost:${port}/user/login`)
    .send(testLogin)
    .end(function(err, res) {
      assert.isNotOk(err, "Error check");
      assert.equal(res.statusCode, 200, 'Status code 200');
      assert.equal(res.type, 'application/json', 'Content type JSON');
      //Check data
      assert.isOk(res.body.success);
      done();
    });
  });
  it('should logout and register with bad form', function(done) {
    agent
    .get(`http://localhost:${port}/logout`);
    testUser.pass = "somethingelse";
    agent
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .then(function(res){
      assert.isNotOk(res.body.success);
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
  after('should delete all users', function(done) {
    agent
    .delete(`http://localhost:${port}/user`)
    .end(function(err, res) {
      assert.isNotOk(err, "Error check");
      assert.equal(res.statusCode, 200, "Status code 200");
      assert.equal(res.type, 'application/json', 'Content type JSON');
      assert.isOk(res.body.success);
      done();
    });
  });
});


describe("Cart API", function() {
  var testGuestUserId;
  var testUserID
  let agent2 = null;
  let testUser = {
    name: "TESTUSER",
    user: "testusername2",
    email: "test2@email.com",
    pass: "testpass"
  };
  let testLogin = {
    user: testUser.user,
    pass: testUser.pass
  };
  let testId;
  before('should register test user', function(done) {
    agent2 = request.agent();
    agent2
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .then(function(res){
      assert.isOk(res.body.success);
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
  it('should post cart w/ testuser', function(done) {
    agent2
    .get(`http://localhost:${port}/menu`)
    .end(function(err, res) {
      let body = {
        items: []
      };
      let menu_arr = res.body;
      for (var i in menu_arr) {
        body.items.push({
          item: menu_arr[i],
          qty: 1
        });
      }
      agent2
      .post(`http://localhost:${port}/cart`)
      .send(body)
      .end(function(err, res) {
        assert.equal(res.statusCode, 200, 'Status code 200');
        assert.equal(res.type, 'application/json', 'Content type JSON');
        //Check data
        assert.isOk(res.body.userId, 'Check-content: userId');
        assert.isOk(res.body.totalCost, 'Check-content: total cost');
        assert.isOk(res.body.totalQty, 'Check-content: total quantity');
        for (var i in res.body.items) {
          assert.equal(res.body.items[i].qty, 1);
        }
        testUserID = res.body.userId;
        done();
      });
    });
  });
  it('should get cart', function(done) {
    agent2
    .get(`http://localhost:${port}/cart`)
    .end(function(err, res) {
      assert.equal(res.statusCode, 200, 'Status code 200');
      assert.equal(res.type, 'application/json', 'Content type JSON');
      assert.isOk(res.body.items.length > 0, 'Response cart not empty');
      done();
    });
  });
  it('should logout and open up guest cart', function(done) {
    agent2
    .get(`http://localhost:${port}/logout`);
    agent2
    .get(`http://localhost:${port}/menu`)
    .end(function(err, res) {
      var body = {
        items: []
      };
      var menu_arr = res.body;
      for (var i in menu_arr) {
        body.items.push({
          item: menu_arr[i],
          qty: 1
        });
      }
      agent2
      .post(`http://localhost:${port}/cart`)
      .send(body)
      .end(function(err, res) {
        assert.equal(res.statusCode, 200, 'Status code 200');
        assert.equal(res.type, 'application/json', 'Content type JSON');
        //Check data
        assert.isOk(res.body.userId, 'Check-content: userId');
        assert.isOk(res.body.totalCost, 'Check-content: total cost');
        assert.isOk(res.body.totalQty, 'Check-content: total quantity');
        for (var i in res.body.items) {
          assert.equal(res.body.items[i].qty, 1);
        }
        testGuestUserId = res.body.userId;
        done();
      });
    });
  it('UserID for both carts should be different', function(done){
      console.log(testUserId, testGuestUserId);
      console.log("!!!!!");
      assert.notEqual(testUserId, testGuestUserId, "IDs for cart for guest/user");
      done();
    });
  });
  after('should delete all carts and users', function(done) {
    agent2
    .delete(`http://localhost:${port}/cart`)
    .end(function(err, res) {
      assert.isNotOk(err, "Error check");
      assert.equal(res.statusCode, 200, "Status code 200");
      assert.equal(res.type, 'application/json', 'Content type JSON');
      assert.isOk(res.body.success);
      agent2
      .delete(`http://localhost:${port}/user`)
      .end(function(err, res) {
        assert.isNotOk(err, "Error check");
        assert.equal(res.statusCode, 200, "Status code 200");
        assert.equal(res.type, 'application/json', 'Content type JSON');
        assert.isOk(res.body.success);
        done();
      });
    });
  });
});
