var assert = require('assert');
var sinon = require('sinon');
var players = require('../../lib/players.js');
var Game = require('../../models/game.js');

describe('players', function(){
  var game, player;

  beforeEach(function(){
    game = new Game();
    game.e = sinon.spy();
    player = {};
  });

  describe('.join', function(){

    describe('when player is not in the game', function(){
      beforeEach(function(){
        players.join(player, game);
      });

      it('adds a player to the players list', function(){
        assert.equal(game.players.length, 1);
      });

      it('emits the players:joined event', function(){
        assert(game.e.calledWith('players:joined', player));
      });
    });

    describe('when game is full', function(){
      beforeEach(function(){
        game.maxPlayers = 0;
        players.join(player, game);
      });

      it('doesnt add player to game list', function(){
        assert.equal(game.players.length, 0);
      });

      it('emits the error:playerJoined event', function(){
        assert(game.e.calledWith('error:gameFull', player));
      });
    });

    describe('when player is already in', function(){
      beforeEach(function(){
        game.players = [player];
        players.join(player, game);
      });

      it('doesnt add player twice', function(){
        assert.equal(game.players.length, 1);
      });

      it('emits the error:playerJoined event', function(){
        assert(game.e.calledWith('error:playerJoined', player));
      });
    });
  });
});