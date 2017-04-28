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
    it('should get menu', function(done) {
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
    let badTestUser1 = {
      name: "TESTUSER",
      user: "somethingdifferent",
      email: "test1@email.com",
      pass: "testpass"
    };
    let badTestUser2 = {
      name: "TESTUSER",
      user: "testusername1",
      email: "test1@somethingdifferent.com",
      pass: "testpass"
    };
    let testLogin = {
        user: testUser.user,
        pass: testUser.pass
    };
    let badPassTestLogin = {
        user: testUser.user,
        pass: 'badpassword'
    };
    let badUserTestLogin = {
      user: 'badusername',
      pass: testUser.pass
    };
    before('should initialize guest user by entering website', function(done) {
        agent = request.agent();
        agent
          .get(`http://localhost:${port}/`)
          .end((err, res) => {done();});
    });
    it('should register test user', function(done) {
      agent
          .post(`http://localhost:${port}/user`)
          .send(testUser)
          .then(function(res) {
              //Check status
              assert.equal(res.statusCode, 200, 'Status code 200');
              //Content type
              assert.equal(res.type, 'application/json', 'Content type JSON');
              assert.isOk(res.body.success);
              done();
          })
          .catch(err => {
              console.log(err);
          });
    });
    it('should create new agent', function(done) {
      agent = request.agent();
      agent
        .get(`http://localhost:${port}/`)
        .end((err, res) => {done();});
    });
    it('should attempt bad register with user', function(done) {
      agent
        .post(`http://localhost:${port}/user`)
        .send(badTestUser1)
        .then(function(res) {
            //Check status
            assert.equal(res.statusCode, 200, 'Status code 200');
            //Content type
            assert.equal(res.type, 'application/json', 'Content type JSON');
            assert.isNotOk(res.body.success, 'Check unsuccessful register');
            done();
        })
        .catch(err => {
            console.log(err);
        });
    });
    it('should create new agent', function(done) {
      agent = request.agent();
      agent
        .get(`http://localhost:${port}/`)
        .end((err, res) => {done();});
    });
    it('should attempt bad register with email', function(done) {
      agent
        .post(`http://localhost:${port}/user`)
        .send(badTestUser2)
        .then(function(res) {
          assert.equal(res.statusCode, 200, 'Status code 200');
          assert.equal(res.type, 'application/json', 'Content type JSON');
          assert.isNotOk(res.body.success, 'Check unsuccessful register');
          done();
        })
        .catch(err => {console.log(err);});
    });
    it('should create new agent', function(done) {
      agent = request.agent();
      agent
        .get(`http://localhost:${port}/`)
        .end((err, res) => {done();});
    });
    it('should successfully login to test user', function(done) {
      agent
        .post(`http://localhost:${port}/user/login`)
        .send(testLogin)
        .then(res => {
          assert.equal(res.statusCode, 200, 'Status code 200');
          assert.equal(res.type, 'application/json', 'Content type JSON');
          assert.isOk(res.body.success, 'Check successful login');
          done();
        })
        .catch(err => {console.log(err);});
    });
    it('should create new agent', function(done) {
      agent = request.agent();
      agent
        .get(`http://localhost:${port}/`)
        .end((err, res) => {done();});
    });
    it('should unsuccessfully login to testuser with bad pass', function(done) {
      agent
        .post(`http://localhost:${port}/user/login`)
        .send(badPassTestLogin)
        .then(res => {
          assert.isOk(false, 'No error returned for bad login');
          done();
        })
        .catch(err => {
          assert.equal(err.status, 401, 'Status code 401');
          assert.equal(err.response.type, 'application/json', 'Content type JSON');
          assert.equal(err.response.body.error, 'Invalid credentials', 'Appropriate error report');
          done();
        });
    });
    it('should create new agent', function(done) {
      agent = request.agent();
      agent
        .get(`http://localhost:${port}/`)
        .end((err, res) => {done();});
    });
    it('should unsuccessfully login to testuser with bad user', function(done) {
      agent
        .post(`http://localhost:${port}/user/login`)
        .send(badUserTestLogin)
        .then(res => {
          assert.isOk(false, 'No error returned for bad login');
          done();
        })
        .catch(err => {
          assert.equal(err.status, 401, 'Status code 401');
          assert.equal(err.response.type, 'application/json', 'Content type JSON');
          assert.equal(err.response.body.error, 'Invalid credentials', 'Appropriate error report');
          done();
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
    var testGuestUserID;
    var testUserID;
    let agent = null;
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
    let testItem1 = {
      name: "TEST",
      desc: "TEST DESC",
      price: 999,
      img: "TEST.JPG",
      menu_id: 999
    };
    let testItem2 = {
      name: "TEST2",
      desc: "TEST DESC2",
      price: 9999,
      img: "TEST2.JPG",
      menu_id: 9999
    };
    let cart = {items:[]};
    cart.items.push({item:testItem1, qty:1});
    cart.items.push({item:testItem2, qty:2});
    let body = {items: cart.items};
    before('should initialize guest user by entering website', function(done) {
        agent = request.agent();
        agent
          .get(`http://localhost:${port}/`)
          .end((err, res) => {done();});
    });
    it('should add items to cart as guest', function(done) {
      agent
        .post(`http://localhost:${port}/cart`)
        .send(body)
        .then(res => {
          assert.equal(res.statusCode, 200, 'Status code 200');
          assert.equal(res.type, 'application/json', 'Content type JSON');
          // Response content check
          assert.equal(res.body.totalCost, 20997, 'Check total cost');
          assert.equal(res.body.totalQty, 3, 'Check total quantity');
          assert.equal(res.body.items[0].qty, 1, 'Check test item 1 qty');
          assert.equal(res.body.items[1].qty, 2, 'Check test item 2 qty');
          assert.isOk(objEqual(res.body.items[0].item, testItem1), 'Check test item 1');
          assert.isOk(objEqual(res.body.items[1].item, testItem2), 'Check test item 2');
          done();
        })
        .catch(err => {console.log(err);});
    });
    it('should register testuser', function(done) {
      agent
          .post(`http://localhost:${port}/user`)
          .send(testUser)
          .then(function(res) {
              //Check status
              assert.equal(res.statusCode, 200, 'Status code 200');
              //Content type
              assert.equal(res.type, 'application/json', 'Content type JSON');
              assert.isOk(res.body.success);
              done();
          })
          .catch(err => {
              console.log(err);
          });
    });
    it('should get guest cart', function(done) {
      agent
        .get(`http://localhost:${port}/cart`)
        .then(res => {
          assert.equal(res.statusCode, 200, 'Status code 200');
          assert.equal(res.type, 'application/json', 'Content type JSON');
          // Response content check
          assert.equal(res.body.totalCost, 20997, 'Check total cost');
          assert.equal(res.body.totalQty, 3, 'Check total quantity');
          assert.equal(res.body.items[0].qty, 1, 'Check test item 1 qty');
          assert.equal(res.body.items[1].qty, 2, 'Check test item 2 qty');
          assert.isOk(objEqual(res.body.items[0].item, testItem1), 'Check test item 1');
          assert.isOk(objEqual(res.body.items[1].item, testItem2), 'Check test item 2');
          done();
        })
        .catch(err => {console.log(err);});
    });
    it('should create new agent', function(done) {
      agent = request.agent();
      agent
        .get(`http://localhost:${port}/`)
        .end((err, res) => {done();});
    });
    it('should add to new guest cart', function(done) {
      body.items[0].qty = 10;
      agent
        .post(`http://localhost:${port}/cart`)
        .send(body)
        .then(res => {
          assert.equal(res.statusCode, 200, 'Status code 200');
          assert.equal(res.type, 'application/json', 'Content type JSON');
          // Response content check
          assert.equal(res.body.totalCost, 29988, 'Check total cost');
          assert.equal(res.body.totalQty, 12, 'Check total quantity');
          assert.equal(res.body.items[0].qty, 10, 'Check test item 1 qty');
          assert.equal(res.body.items[1].qty, 2, 'Check test item 2 qty');
          assert.isOk(objEqual(res.body.items[0].item, testItem1), 'Check test item 1');
          assert.isOk(objEqual(res.body.items[1].item, testItem2), 'Check test item 2');
          done();
        })
        .catch(err => {console.log(err);});
    });
    it('should login as testuser successfully', function(done) {
      agent
        .post(`http://localhost:${port}/user/login`)
        .send(testLogin)
        .then(res => {
          assert.equal(res.statusCode, 200, 'Status code 200');
          assert.equal(res.type, 'application/json', 'Content type JSON');
          assert.isOk(res.body.success, 'Check successful login');
          done();
        })
        .catch(err => {console.log(err);});
    });
    it('should get equivalent new guest cart', function(done) {
      agent
        .get(`http://localhost:${port}/cart`)
        .then(res => {
          assert.equal(res.statusCode, 200, 'Status code 200');
          assert.equal(res.type, 'application/json', 'Content type JSON');
          // Response content check
          assert.equal(res.body.totalCost, 29988, 'Check total cost');
          assert.equal(res.body.totalQty, 12, 'Check total quantity');
          assert.equal(res.body.items[0].qty, 10, 'Check test item 1 qty');
          assert.equal(res.body.items[1].qty, 2, 'Check test item 2 qty');
          assert.isOk(objEqual(res.body.items[0].item, testItem1), 'Check test item 1');
          assert.isOk(objEqual(res.body.items[1].item, testItem2), 'Check test item 2');
          done();
        })
        .catch(err => {console.log(err);});
    });
    after('should delete all carts and users', function(done) {
        agent
            .delete(`http://localhost:${port}/cart`)
            .end(function(err, res) {
                assert.isNotOk(err, "Error check");
                assert.equal(res.statusCode, 200, "Status code 200");
                assert.equal(res.type, 'application/json', 'Content type JSON');
                assert.isOk(res.body.success);
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
});

describe('Order API', function() {
  var testGuestUserID;
  var testUserID;
  let agent = null;
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
  let testItem1 = {
    name: "TEST",
    desc: "TEST DESC",
    price: 999,
    img: "TEST.JPG",
    menu_id: 999
  };
  let testItem2 = {
    name: "TEST2",
    desc: "TEST DESC2",
    price: 9999,
    img: "TEST2.JPG",
    menu_id: 9999
  };
  let cart = {items:[]};
  let orderbody = {
    cart: null,
    phone: '999-9999',
    delivery: true,
    address: 'Test Address',
    card: 1234512345,
    cost: {delivery: 10, tax: 1, final: 27}
  };
  let session_userId = null;
  before('should initialize guest user by entering website', function(done) {
      agent = request.agent();
      agent
        .get(`http://localhost:${port}/`)
        .end((err, res) => {done();});
  });
  it('should get from menu and add items to local cart', function(done) {
    agent
      .get(`http://localhost:${port}/menu`)
      .then(res => {
        for (var i in res.body) {
          cart.items.push({item: res.body[i], qty: parseInt(i)+1});
        }
        done();
      })
      .catch(err => {console.log(err);});
  });
  it('should add items to cart as guest', function(done) {
    agent
      .post(`http://localhost:${port}/cart`)
      .send({items: cart.items})
      .then(res => {
        assert.equal(res.statusCode, 200, 'Status code 200');
        assert.equal(res.type, 'application/json', 'Content type JSON');
        done();
      })
      .catch(err => {console.log(err);});
  });
  it('should register testuser', function(done) {
    agent
        .post(`http://localhost:${port}/user`)
        .send(testUser)
        .then(function(res) {
            //Check status
            assert.equal(res.statusCode, 200, 'Status code 200');
            //Content type
            assert.equal(res.type, 'application/json', 'Content type JSON');
            assert.isOk(res.body.success);
            done();
        })
        .catch(err => {
            console.log(err);
        });
  });
  it('should get guest cart', function(done) {
    agent
      .get(`http://localhost:${port}/cart`)
      .then(res => {
        assert.equal(res.statusCode, 200, 'Status code 200');
        assert.equal(res.type, 'application/json', 'Content type JSON');
        orderbody.cart = res.body;
        done();
      })
      .catch(err => {console.log(err);});
  });
  it('should submit order', function(done) {
    agent
    .post(`http://localhost:${port}/order`)
    .send(orderbody)
    .then(res => {
      assert.equal(res.statusCode, 200, 'Status code 200');
      assert.equal(res.type, 'application/json', 'Content type JSON');
      // Response content check
      assert.isOk(res.body.success, "Successful order made");
      assert.isOk(res.body.userId, 'Order contains userId');
      session_userId = res.body.userId;
      done();
    })
    .catch(err => {console.log(err);});
  });
  it('should get order', function(done) {
    agent
    .get(`http://localhost:${port}/order`)
    .then(res => {
      assert.equal(res.statusCode, 200, 'Status code 200');
      assert.equal(res.type, 'application/json', 'Content type JSON');
      // Response content check
      assert.equal(res.body.cart.userId, session_userId, 'Check if cart matches user');
      assert.equal(res.body.phone, '999-9999', 'Check phone number');
      assert.isOk(res.body.delivery, 'Check if delivery true');
      assert.equal(res.body.address, 'Test Address', 'Check address');
      assert.equal(res.body.card, 1234512345, 'Check card number');
      assert.equal(res.body.cost.delivery, 10, 'Check delivery cost');
      assert.equal(res.body.cost.tax, 1, 'Check tax cost');
      assert.equal(res.body.cost.final, 27, 'Check final cost');
      done();
    })
    .catch(err => {console.log(err);});
  });
  after('should delete all carts and users', function(done) {
      agent
          .delete(`http://localhost:${port}/cart`)
          .end(function(err, res) {
              assert.isNotOk(err, "Error check");
              assert.equal(res.statusCode, 200, "Status code 200");
              assert.equal(res.type, 'application/json', 'Content type JSON');
              assert.isOk(res.body.success);
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
});

//Helper Functions
function objEqual(a, b) {
  var aProp = Object.getOwnPropertyNames(a);
  var bProp = Object.getOwnPropertyNames(b);
  if (aProp.length != bProp.length) return false;
  for (var i = 0; i < aProp.length; i++) {
    var propName = aProp[i];
    if (a[propName] !== b[propName])
      return false;
  }
  return true;
}
