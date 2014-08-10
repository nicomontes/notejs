/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


  /**
  * Action blueprints:
  *    `/user/login`
  */
  login: function (req, res) {
    if (req.session.user) {
      return res.redirect('/note/list');
    }
    else {
      return res.view({ error: "" });
    }
  },


  /**
  * Action blueprints:
  *    `/user/logout`
  */
  logout: function (req, res) {
    if (req.session.user) {
      delete req.session.user;
      return res.redirect('/');
    }
    else {
      return res.redirect('/');
    }
  },


  /**
  * Action blueprints:
  *    `/user/search`
  */
  search: function (req, res) {
    if (req.param('name')) {
      var name = req.param('name');
      User.find({where: {name: {'startsWith': name}}, limit: 5}).done(function(err, usr){
        if (err) {
          return res.json({
            users: 'DB Error'
          });
        }
        else {
          return res.json({users: usr});
        }
      });
    }
    else if (req.param('nameExact')) {
      var name = req.param('nameExact');
      User.findOne({name: name}).done(function(err, usr){
        if (err) {
          return res.json({
            user: 'DB Error'
          });
        }
        else {
          return res.json({user: usr});
        }
      });
    }
    else if (req.param('id')) {
      User.findOne({id: req.param('id')}).done(function(err, usr){
        if (err) {
          return res.json({
            name: 'DB Error'
          });
        }
        else {
          return res.json({id: usr.id, name: usr.name});
        }
      });
    }
  },


 /**
 * Action blueprints:
 *    `/user/create`
 */
 create: function (req, res) {
   return res.view({ error: "" });
 },


 /**
 * Action blueprints:
 *    `/user/confirm`
 */
 confirm: function (req, res) {
   var name = req.body.name;
   var password = req.body.password;
   var email = req.body.email;
   User.findOne({name: name}).done(function(error, usr){
     if (error) {
       res.send(500, { error: "DB Error" });
     } else if (usr) {
       return res.view('user/create', {error: 'Username already Taken'});
     } else {
       var hasher = require("password-hash");
       password = hasher.generate(password);
       User.create({name: name, password: password,email: email}).done(function(error, name) {
         if (error) {
           return res.view(create, {error: 'DB Error'});
         } else {
           return res.view();
         }
       });
     }
   });
 },


  /**
   * Action blueprints:
   *    `/user/update`
   */
   update: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },


  /**
   * Action blueprints:
   *    `/user/destroy`
   */
   destroy: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  }

};
