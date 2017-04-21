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
  it('should post menu', function(done) {
    var testObj = {
      name: "TEST",
      desc: "TEST DESC",
      price: 999,
      img: "TEST.JPG",
      menu_id: 999
    };
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
      done();
    });
  });

  let agent = null;
  let testUser = {
    name: "TESTUSER",
    user: "testusername1",
    email: "test1@email.com",
    pass: "testpass"
  };
  before(function(done) {
    agent = request.agent();
    agent
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .then(function(err, res){
      done();
    })
    .catch(err => {
      console.log(err);
    });
  }); //REMEMBER TO DELETE USER AFTER

  it('should get menu', function(done){
    agent
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
  it('should register new user', function(done) {
    let testUser = {
      name: "TESTUSER",
      user: "testusername2",
      email: "test2@email.com",
      pass: "testpass"
    };
    request
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .end(function(err, res){
      assert.isNotOk(err, "Error check");
      assert.equal(res.statusCode, 200, 'Status code 200');
      assert.equal(res.type, 'application/json', 'Content type JSON');
      // Check Data
      assert.equal(res.body.user, testUser.user, "Registration username");
      assert.equal(res.body.email, testUser.email, "Registration email");
      assert.equal(res.body.name, testUser.name, "Registration name");
      assert.isNotOk(res.body.pass, "Registration pass not returned");
      done();
    });
  });
  it('should not register same username', function(done) {
    let testUser = {
      name: "TESTUSERsomethingdifferent",
      user: "testusername2",
      email: "test2somethingdifferent@email.com",
      pass: "testpasssomethingdifferent"
    };
    request
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .end(function(err, res) {
      assert.isNotOk(err, "Error Check");
      assert.equal(res.statusCode, 200, 'Status code 200');
      console.log("!!!!!!!!!!!!!!!!!!");
      console.log(typeof(res.body), typeof([]));
      assert.equal(res.body, [], "Registration resturns empty");
      console.log(res.body);
      done();
    });
  });
  it('should not register same email', function(done) {
    let testUser = {
      name: "TESTUSERsomethingreallydifferent",
      user: "testusername2somethingdifferent",
      email: "test2@email.com",
      pass: "testpasssomethingreallydifferent"
    };
    request
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .end(function(err, res) {
      assert.isNotOk(err, "Error Check");
      assert.equal(res.statusCode, 200, "Status code 200");
      assert.equal(res.body, [], "Registration resturns empty");
      console.log("!@!", res.body);
      done();
    });
  })
  it('should login existing user', function(done) {
    let testUser = {
      user: "testusername2",
      pass: "testpass"
    };
    request
    .post(`http://localhost:${port}/user/login`)
    .send(testUser)
    .end(function(err, res) {
      assert.isNotOk(err, "Error check");
      assert.equal(res.statusCode, 200, 'Status code 200');
      assert.equal(res.type, 'application/json', 'Content type JSON');
      //Check data
      assert.equal(res.body.user, testUser.user);
      done();
    });
  });
});

describe("Cart API", function() {
  let agent = null;
  let testUser = {
    name: "TESTUSER",
    user: "testusername1",
    email: "test1@email.com",
    pass: "testpass"
  };
  before(function(done) {
    agent = request.agent();
    agent
    .post(`http://localhost:${port}/user`)
    .send(testUser)
    .then(function(err, res){
      done();
    })
    .catch(err => {
      console.log(err);
    });
  }); //REMEMBER TO DELETE USER AFTER
  it('should post menu', function(done) {
    done();
  });
});
