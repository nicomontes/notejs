/**
 * Note
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

  	/* e.g.
  	nickname: 'string'
  	*/

    title: {
      type: 'string',
      required: true
    },
    content: {
      type: 'text',
      required: true
    },
    creator: {
      type: 'array',
      required: true
    },
    writer: {
      type: 'array'
    },
    reader: {
      type: 'array'
    }
  }

};
