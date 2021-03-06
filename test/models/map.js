var assert = require('assert');
var Map = require('../../models/map.js');;

describe('Map', function () {

  describe('.new', function () {
    var map;

    beforeEach(function () {
      var json = {"nodes": {
        "City1": {"color": "red"},
        "City2": {"color": "blue"}
        }, "links" : [
          {"City1":"City2"}
        ]
      }
      map = new Map(json, true);
    });

    it('generates a list of cities', function () {
      assert(map.City1);
    });

    it('links all sources as target connections', function () {
      assert(map.City1.connections[0] == map.City2.name);
    });

    it('links all targets as sources connections', function () {
      assert(map.City2.connections[0] == map.City1.name);
    });

    it('adds empty zombie list to each city', function () {
      assert.equal(map.City1.zombies.length, 0);
    });

  });

});
