var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

vows.describe('Solfege').addBatch({
  'C in C minor': function() {
    var pitch = teoria.pitch('c');
    assert.equal(pitch.solfege(teoria.scale(pitch, 'minor')), 'do');
  },

  'A in d major': function() {
    var pitch = teoria.pitch('a');
    var tonic = teoria.pitch('d');
    assert.equal(pitch.solfege(teoria.scale(tonic, 'major')), 'so');
  },

  'F# in B major': function() {
    var pitch = teoria.pitch('f#');
    var tonic = teoria.pitch('B');
    assert.equal(pitch.solfege(teoria.scale(tonic, 'major')), 'so');
  },

  'C4 in C4 minor': function() {
    var pitch = teoria.pitch('c4');
    var scale = teoria.scale(pitch, 'minor');
    assert.equal(pitch.solfege(scale, true), 'do');
  },

  'A3 in D4 major': function() {
    var pitch = teoria.pitch('a3');
    var scale = teoria.scale('d4', 'major');
    assert.equal(pitch.solfege(scale, true), 'so,');
  },

  'F#6 in B5 major': function() {
    var pitch = teoria.pitch('f#6');
    var scale = teoria.scale('b5', 'major');
    assert.equal(pitch.solfege(scale, true), 'so');
  },

  'F2 in E6 phrygian': function() {
    var pitch = teoria.pitch('f2');
    var scale = teoria.scale('e6', 'phrygian');
    assert.equal(pitch.solfege(scale, true), 'ra,,,,');
  },

  'Eb10 in E8 dorian': function() {
    var pitch = teoria.pitch('eb10');
    var scale = teoria.scale('e8', 'dorian');
    assert.equal(pitch.solfege(scale, true), 'de\'\'');
  },

  'A#6 in Bb4 locrian': function() {
    var pitch = teoria.pitch('A#6');
    var scale = teoria.scale('Bb4', 'locrian');
    assert.equal(pitch.solfege(scale, true), 'tai\'');
  },

  'E2 in C3 major': function() {
    var pitch = teoria.pitch('e2');
    var scale = teoria.scale('c3', 'major');
    assert.equal(pitch.solfege(scale, true), 'mi,');
  }
}).export(module);
