/**
 * NoteController
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
   *    `/note/create`
   */
   create: function (req, res) {
    return res.view({error: '', layout: null});
  },


  /**
  * Action blueprints:
  *    `/note/search`
  */
  search: function (req, res) {
    Note.findOne({id: req.param('id')}).done(function(err, noteDetail) {
      if (err) {
        console.log(err);
        return res.view('note/list', {error: 'DB Error'});
      }
      else {
        //return res.json({id: noteDetail.id, content: noteDetail.content});
        return res.json(noteDetail);
      }
    });
  },


  /**
   * Action blueprints:
   *    `/note/list`
   */
  list: function (req, res) {
    if (req.body.name) {
      var name = req.body.name;
      var password = req.body.password;
      User.findOne({name: name}).done(function(err, usr) {
        if (err) {
          return res.view('user/login', {error: 'DB Error'});
        }
        else {
          if (usr) {
            var hasher = require("password-hash");
            if (hasher.verify(password, usr.password)) {
              req.session.user = usr.id;
              var noteList;
              Note.find({or:[{creator: usr.id},{writer: usr.id},{reader: usr.id}]}).done(function(err, noteList) {
                if (err) {
                  return res.view('user/login', {error: 'DB Error'});
                }
                else {
                  return res.view({noteList: noteList});
                }
              });
            }
            else {
              return res.view('user/login', {error: 'Wrong Password'});
              if (req.session.user) req.session.user = null;
            }
          }
          else {
            return res.view('user/login', {error: 'Wrong Password'});
            if (req.session.user) req.session.user = null;
          }
        }
      });
    }
    else if (req.body.title){
      Note.create({title: req.body.title, content: req.body.content, creator: [req.session.user], writer: [], reader: []}).done(function(error, note) {
        if (error) {
          return res.view('note/create', {error: 'DB Error'});
        }
        else {
          Note.find({or:[{creator: req.session.user},{writer: req.session.user},{reader: req.session.user}]}).done(function(err, noteList) {
            if (err) {
              return res.view('user/login', {error: 'DB Error'});
            }
            else {
              return res.view({noteList: noteList});
            }
          });
        }
      });
    }
    else if (req.session.user) {
      Note.find({or:[{creator: req.session.user},{writer: req.session.user},{reader: req.session.user}]}).done(function(err, noteList) {
        if (err) {
          return res.view('user/login', {error: 'DB Error'});
        }
        else {
          return res.view({noteList: noteList});
        }
      });
    }
    else {
      return res.redirect('/');
    }
  },


  /**
   * Action blueprints:
   *    `/note/update`
   */
  update: function (req, res) {
    var id = req.param('id');
    if (req.param('content')) {
       var content = req.param('content');
       Note.update({id: id}, {content: content}, function(err, notes) {
         if (err) {
           return res.json({
             success: false,
           });
         } else {
           return res.json({
             success: true,
             id: id,
             content: content
           });
         }
       });
       req.socket.broadcast.to(id).emit('message', {content: content, id: id});
     }
     else {
       Note.findOne(id).exec(function(err, note) {
         console.log(req.param('autoRm'));
         console.log(req.param('autoAdd'));
         console.log(req.param('userId'));
          console.log(note);
          //remove user
          if (req.param('autoRm') == "creator") {
            note.creator.splice(note.creator.indexOf(req.param('userId')));
          }
          else if (req.param('autoRm') == "writer") {
            note.writer.splice(note.writer.indexOf(req.param('userId')));
          }
          else if (req.param('autoRm') == "reader") {
            note.reader.splice(note.reader.indexOf(req.param('userId')));
          }
          // Add user in new autorisation array
          if (req.param('autoAdd') == "creator") {
              note.creator.push(req.param('userId'));
          }
          else if (req.param('autoAdd') == "writer") {
              note.writer.push(req.param('userId'));
          }
          else if (req.param('autoAdd') == "reader") {
              note.reader.push(req.param('userId'));
          }
          console.log(note);
          note.save(function(err,note){
            return res.json({
              success: true,
              id: id,
            });
          });
        });
    }
  },


  /**
   * Action blueprints:
   *    `/note/destroy`
   */
   destroy: function (req, res) {
     var id = req.param('id');
     Note.destroy({id: id}, function(err) {
       if (err) {
         return res.json({
           success: false,
         });
       } else {
         return res.json({
           success: true,
         });
       }
     });
  },


	/**
	* Action blueprints:
	*    `/note/share`
	*/
	share: function (req, res) {
		/*Note.findOne({id: req.param('id')}).done(function(err, noteDetail) {
			if (err) {
				console.log(err);
				return res.view('note/list', {error: 'DB Error'});
			}
			else {*/
        return res.view({layout: null});
        /*
				var users = {};
				var creatorId;
				var writerId;
				var readerId;
				creator = noteDetail.creator;
				for (var i=0; i<creator.length; i++) {
					var j = i;
					User.findOne({id: creator[i]}).done(function(err, usr) {
						if (err) {
							return res.view('note/list', {error: 'DB Error'});
						}
						else {
							users.push({id: creator[i], name:usr.name})
							if (j == creator.length-1){
								console.log("creator finish");
                return res.view({layout: null, creator: user.creator});
							}
						}
					});
				}*/
      //}
		//});
	},

  /**
   * Action blueprints:
   *    `/note/subscribe`
   */
   subscribe: function (req, res) {
    // Send a JSON response
    Note.find(function foundNotes(err, notes) {
      if (err) return next(err);
        req.socket.join(req.param('room'));
        if (req.param('leave')){
          //Note.unsubscribe(req.socket);
          //Note.unsubscribe(req.socket, notes);
          req.socket.leave(req.param('leave'));
        }
        Note.subscribe(req.socket);
        Note.subscribe(req.socket, notes);
        res.send(200);
    });
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to NoteController)
   */
  _config: {}


};
