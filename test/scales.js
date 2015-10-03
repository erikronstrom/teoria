var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

vows.describe('Scales').addBatch({
  'Ab2': {
    topic: function() {
      return teoria.pitch('Ab2');
    },

    'Ionian/Major': function(pitch) {
      assert.deepEqual(pitch.scale('ionian').simple(),
          ['ab', 'bb', 'c', 'db', 'eb', 'f', 'g']);
    },

    'Dorian': function(pitch) {
      assert.deepEqual(pitch.scale('dorian').simple(),
          ['ab', 'bb', 'cb', 'db', 'eb', 'f', 'gb']);
    },

    'Phrygian': function(pitch) {
      assert.deepEqual(pitch.scale('phrygian').simple(),
          ["ab", "bbb", "cb", "db", "eb", "fb", "gb"]);
    },

    'Lydian': function(pitch) {
      assert.deepEqual(pitch.scale('lydian').simple(),
          ["ab", "bb", "c", "d", "eb", "f", "g"]);
    },

    'Mixolydian': function(pitch) {
      assert.deepEqual(pitch.scale('mixolydian').simple(),
          ["ab", "bb", "c", "db", "eb", "f", "gb"]);
    },

    'Aeolian/Minor': function(pitch) {
      assert.deepEqual(pitch.scale('aeolian').simple(),
          ["ab", "bb", "cb", "db", "eb", "fb", "gb"]);
    },

    'Locrian': function(pitch) {
      assert.deepEqual(pitch.scale('locrian').simple(),
          ["ab", "bbb", "cb", "db", "ebb", "fb", "gb"]);
    },

    'Major Pentatonic': function(pitch) {
      assert.deepEqual(pitch.scale('majorpentatonic').simple(),
          ["ab", "bb", "c", "eb", "f"]);
    },

    'Minor Pentatonic': function(pitch) {
      assert.deepEqual(pitch.scale('minorpentatonic').simple(),
          ["ab", "cb", "db", "eb", "gb"]);
    },

    'Chromatic': function(pitch) {
      assert.deepEqual(pitch.scale('chromatic').simple(),
          ["ab", "bbb", "bb", "cb", "c", "db",
           "d", "eb", "fb", "f", "gb", "g"]);
    }
  }
}).export(module);
