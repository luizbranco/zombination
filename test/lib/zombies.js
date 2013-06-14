var assert = require('assert');
var sinon = require('sinon');
var zombies = require('../../lib/zombies.js');

describe('zombies', function () {
  var city, game;

  beforeEach(function () {
    game = {e: sinon.spy()};
    city = {name: 'Fake City', zombies: 0, connections: []};
  });

  describe('.infect', function () {

    it('adds a zombie to a city', function () {
      zombies.infect(city, {}, game);
      assert.equal(city.zombies, 1);
    });

    it('adds up to 3 zombies to a city', function () {
      zombies.infect(city, {zombies: 4}, game);
      assert.equal(city.zombies, 3);
    });

    it('emits outbreak event if city would have more than 3 zombies', function () {
      zombies.infect(city, {zombies: 4}, game);
      assert(game.e.calledOnce);
    });

    it('does not outbreak the same city twice during the same call', function () {
      var crowded = {name: 'crowded', zombies: 3, connections: [city]};
      city.connections = [crowded];
      zombies.infect(city, {zombies: 4}, game);
      assert.equal(game.e.withArgs('outbreak', city).callCount, 1);
    });

  })

  describe('.outbreak', function () {

    it('emits infect event with all cities connected to a city outbreaking', function () {
      city.connections = [{zombies: 0}, {zombies: 0}, {zombies: 0}];
      zombies.outbreak(city, {}, game);
      assert.equal(game.e.callCount, city.connections.length)
    });

  });

  describe('.kill', function () {

    beforeEach(function () {
      zombies.infect(city, {zombies: 3}, game);
    });

    it('removes zombies from a city', function () {
      zombies.kill(city, 1, game);
      assert.equal(city.zombies, 2);
    });

    it('removes up to 3 zombies from a city', function () {
      zombies.kill(city, 4, game);
      assert.equal(city.zombies, 0);
    });

    it('emits zombieRemoved event', function () {
      zombies.kill(city, 2, game);
      assert.equal(game.e.callCount, 2);
    });

  });
});
