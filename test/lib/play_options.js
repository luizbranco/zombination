var assert = require('assert');
var sinon = require('sinon');
var _ = require('lodash');
var options = require('../../lib/play_options');
var Game = require('../../models/game');
var Player = require('../../models/player');
var Card = require('../../models/card');

describe('playOptions', function(){
  var game, player;

  beforeEach(function(){
    game = new Game();
    player = new Player({position: city});
  });

  describe('.fly', function(){

    beforeEach(function(){
      player.hand = [new Card({name: 'New York'})];
    });

    it('can fly to other card cities', function(){
      var result = options.fly(player);
      assert.deepEqual(result, {'New York': ['flyTo']});
    });

    it('can fly from the current city with same card', function(){
      player.position = game.map['New York'];
      var result = options.fly(player);
      assert.deepEqual(result, {'New York': ['flyFrom']});
    });

  });

  describe('.placeHQ', function(){

    beforeEach(function(){
      player.hand = [new Card({name: 'New York'})];
    });

    describe('when there is a card with same name as current city', function(){

      beforeEach(function(){
        player.position = game.map['New York'];
      });

      it('can place a HQ if city doesnt have a hq', function(){
        var result = options.placeHQ(player, game);
        assert.deepEqual(result, {'New York': ['placeHQ']});
      });

      it('can place a HQ if city doesnt have a hq', function(){
        player.position.hq = true;
        var result = options.placeHQ(player, game);
        assert.deepEqual(result, {});
      });

    });

    describe('when there isnt a card with same name as current city', function(){

      it('cant place a HQ', function(){
        var result = options.placeHQ(player, game);
        assert.deepEqual(result, {});
      });

    });

  });

  describe('.purge', function(){

    it('can purge a color with 5 or more cards', function(){
      player.hand = [
        new Card({color: 'blue', name: 'New York'}),
        new Card({color: 'blue', name: 'Chicago'}),
        new Card({color: 'blue', name: 'Atlanta'}),
        new Card({color: 'blue', name: 'Montreal'}),
        new Card({color: 'blue', name: 'London'})
      ];
      var result = options.purge(player);
      assert.deepEqual(result, {
        'New York': ['purge'],
        'Chicago' : ['purge'],
        'Atlanta' : ['purge'],
        'Montreal': ['purge'],
        'London'  : ['purge']
      });
    });

    it('cant purge a color with less than 5 cards', function(){
      player.hand = [
        new Card({color: 'blue', name: 'New York'}),
        new Card({color: 'blue', name: 'Chicago'}),
        new Card({color: 'blue', name: 'Atlanta'}),
        new Card({color: 'blue', name: 'Montreal'})
      ];
      var result = options.purge(player);
      assert.deepEqual(result, {});
    });

  });

  describe('.special', function(){

    it('lists all special cards', function(){
      var card = new Card({group: 'special', name: 'Place a Free HQ'});
      player.hand = [card];
      var result = options.special(player);
      assert.deepEqual(result, {
        'Place a Free HQ' : ['special']
      });
    });

  });

  describe('.trade', function(){
    var city, friend;

    describe('when two players are in the same city', function(){

      beforeEach(function(){
        city = game.map['New York'];
        friend = new Player({position: city});
        player.position = city;
        game.players = [player, friend];
      });

      it('lists card with the same city name that can be traded', function(){
        player.hand = [new Card({name: 'New York'})];
        var result = options.trade(player, game);
        assert.deepEqual(result, {
          'New York' : ['trade']
        });
      });

    });

    describe('when players are not in the same city', function(){

      it('does not list card', function(){
        player.hand = [new Card({name: city.name})];
        var result = options.trade(player, game);
        assert.deepEqual(result, {});
      });

    });

  });

});
