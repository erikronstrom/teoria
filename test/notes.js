var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

vows.describe('TeoriaPitch class').addBatch({
  'A4 - a\'': {
    topic: function() {
      return teoria.pitch('A4');
    },

    'Octave should be 4': function(pitch) {
      assert.equal(pitch.octave(), 4);
    },

    'Pitch name is lower case': function(pitch) {
      assert.equal(pitch.name(), 'a');
    },

    'A4 is the 49th piano key': function(pitch) {
      assert.equal(pitch.key(), 49);
    },

    'A4 is expressed a\' in Helmholtz notation': function(pitch) {
      assert.equal(pitch.helmholtz(), 'a\'');
    },

    'A4 is expressed A4 in scientific notation': function(pitch) {
      assert.equal(pitch.scientific(), 'A4');
    },

    'The frequency of A4 is 440hz': function(pitch) {
      assert.equal(pitch.fq(), 440);
    }
  },

  'C#5 - c#\'\'': {
    topic: function() {
      return teoria.pitch('c#\'\'');
    },

    'Octave should be 5': function(pitch) {
      assert.equal(pitch.octave(), 5);
    },

    'The name attribute of c# is just c': function(pitch) {
      assert.equal(pitch.name(), 'c');
    },

    'The accidental.sign attribute is #': function(pitch) {
      assert.equal(pitch.accidental(), '#');
    },

    'The accidental.value attribute is 1': function(pitch) {
      assert.equal(pitch.accidentalValue(), 1);
    },

    'C#5 is the 53rd piano key': function(pitch) {
      assert.equal(pitch.key(), 53);
    },

    'C#5 is c#\'\' in Helmholtz notation': function(pitch) {
      assert.equal(pitch.helmholtz(), 'c#\'\'');
    },

    'c#\'\' is C#5 in scientific notation': function(pitch) {
      assert.equal(pitch.scientific(), 'C#5');
    },

    'The frequency of C#5 is approximately 554.365': function(pitch) {
      assert.equal(pitch.fq(), 554.3652619537442);
    },

    'The interval between C#5 and A4 is a major third': function(pitch) {
      var a4 = teoria.pitch('A4');

      assert.deepEqual(pitch.interval(a4), teoria.interval('M-3'));
    },

    'The interval between C#5 and Eb6 is diminished tenth': function(pitch) {
      var eb6 = teoria.pitch('Eb6');

      assert.deepEqual(pitch.interval(eb6), teoria.interval('d10'));
    },

    'An diminished fifth away from C#5 is G5': function(pitch) {
      var g5 = teoria.pitch('G5');

      assert.deepEqual(pitch.interval('d5'), g5);
    },

    'The interval between C#4 and Db4 is a diminished second': function() {
      var cis4 = teoria.pitch('c#4');
      var db4 = teoria.pitch('db4');

      assert.deepEqual(cis4.interval(db4), teoria.interval('d2'));
    }
  },

  'Instantiate with coords': {
    '[0, 0] is A4': function() {
      assert.equal(teoria.pitch([0, 0]).scientific(), 'A4');
    },

    '[-12, -20] is C#3': function() {
      assert.equal(teoria.pitch([-12, -20]).scientific(), 'C#3');
    },

    '[5, 8] is F5': function() {
      assert.equal(teoria.pitch([5, 8]).scientific(), 'F5');
    },

    '[0, -1] is Ab4': function() {
      assert.equal(teoria.pitch([0, -1]).scientific(), 'Ab4');
    }
  },

  'Instantiate from key': {
    '#49 is A4': function() {
      assert.equal(teoria.pitch.fromKey(49).scientific(), 'A4');
    },

    '#20 is E2': function() {
      assert.equal(teoria.pitch.fromKey(20).scientific(), 'E2');
    },

    '#57 is F5': function() {
      assert.equal(teoria.pitch.fromKey(57).scientific(), 'F5');
    },

    '#72 is G#6': function() {
      assert.equal(teoria.pitch.fromKey(72).scientific(), 'G#6');
    }
  },

  'Instantiate from frequency': {
    '391.995Hz is G4': function() {
      assert.equal(teoria.pitch.fromFrequency(391.995).pitch.scientific(), 'G4');
    },

    '220.000Hz is A3': function() {
      assert.equal(teoria.pitch.fromFrequency(220.000).pitch.scientific(), 'A3');
    },

    '155.563Hz is Eb3': function() {
      assert.equal(teoria.pitch.fromFrequency(155.563).pitch.scientific(), 'Eb3');
    },

    '2959.96Hz is F#7': function() {
      assert.equal(teoria.pitch.fromFrequency(2959.96).pitch.scientific(), 'F#7');
    }
  },

  'Instantiate from MIDI': {
    'MIDI#36 is C2': function() {
      assert.equal(teoria.pitch.fromMIDI(36).scientific(), 'C2');
    },

    'MIDI#77 is F5': function() {
      assert.equal(teoria.pitch.fromMIDI(77).scientific(), 'F5');
    },

    'MIDI#61 is C#4': function() {
      assert.equal(teoria.pitch.fromMIDI(61).scientific(), 'C#4');
    },

    'MIDI#80 is G#5': function() {
      assert.equal(teoria.pitch.fromMIDI(80).scientific(), 'G#5');
    }
  },

  'Return MIDI pitch number': {
    'MIDI#36 is C2': function() {
      assert.equal(teoria.pitch('C2').midi(), 36);
    },

    'MIDI#77 is F5': function() {
      assert.equal(teoria.pitch('F5').midi(), 77);
    },

    'MIDI#61 is Db4': function() {
      assert.equal(teoria.pitch('Db4').midi(), 61);
    },

    'MIDI#80 is G#5': function() {
      assert.equal(teoria.pitch('G#5').midi(), 80);
    }
  },

  'Chroma': {
    'C has chroma 0': function() {
      assert.equal(teoria.pitch('c').chroma(), 0);
    },

    'C# has chroma 1': function() {
      assert.equal(teoria.pitch('c#').chroma(), 1);
    },

    'B has chroma 11': function() {
      assert.equal(teoria.pitch('b').chroma(), 11);
    },

    'Db has chroma 1': function() {
      assert.equal(teoria.pitch('db').chroma(), 1);
    },

    'Dbb has chroma 0': function() {
      assert.equal(teoria.pitch('dbb').chroma(), 0);
    },

    'E has chroma 4': function() {
      assert.equal(teoria.pitch('e').chroma(), 4);
    },

    'F has chroma 5': function() {
      assert.equal(teoria.pitch('f').chroma(), 5);
    },

    'Fb has chroma 4': function() {
      assert.equal(teoria.pitch('fb').chroma(), 4);
    },

    'H# has chroma 0': function() {
      assert.equal(teoria.pitch('h#').chroma(), 0);
    },

    'Bx has chroma 1': function() {
      assert.equal(teoria.pitch('bx').chroma(), 1);
    },

    'Cbb has chroma 10': function() {
      assert.equal(teoria.pitch('cbb').chroma(), 10);
    }
  },

  'Scale Degrees': {
    'Eb is scale degree 1 (tonic) in an Eb minor scale': function() {
      var pitch = teoria.pitch('eb');
      assert.equal(pitch.scaleDegree(teoria.scale('eb', 'major')), 1);
    },

    'E is scale degree 3 in a C# dorian': function() {
      var pitch = teoria.pitch('e');
      assert.equal(pitch.scaleDegree(teoria.scale('c#', 'dorian')), 3);
    },

    'C is scale degree 0 in a D major scale (not in scale)': function() {
      var pitch = teoria.pitch('c');
      assert.equal(pitch.scaleDegree(teoria.scale('d', 'major')), 0);
    },

    'Bb is scale degree 7 in a C minor': function() {
      var pitch = teoria.pitch('bb');
      assert.equal(pitch.scaleDegree(teoria.scale('c', 'minor')), 7);
    },
    
    'Db is scale degree 4 in an Ab major scale': function() {
      var pitch = teoria.pitch('db');
      assert.equal(pitch.scaleDegree(teoria.scale('ab', 'major')), 4);
    },

    'A# is scale degree 0 in a G minor scale': function() {
      var pitch = teoria.pitch('a#');
      assert.equal(pitch.scaleDegree(teoria.scale('g', 'minor')), 0);
    }
  },

  'Enharmonics': {
    'c is enharmonic with dbb and b#': function() {
      assert.deepEqual(teoria.pitch('c4').enharmonics(),
        ['dbb4', 'b#3'].map(teoria.pitch));
    },

    'fb is enharmonic with e and dx': function() {
      assert.deepEqual(teoria.pitch('fb4').enharmonics(),
        ['e4', 'dx4'].map(teoria.pitch));
    },

    'cb is enharmonic with ax and b': function() {
      assert.deepEqual(teoria.pitch('cb4').enharmonics(),
        ['b3', 'ax3'].map(teoria.pitch));
    }
  },

  'Enharmonics with only one accidental': {
    'c is enharmonic with b#': function() {
      assert.deepEqual(teoria.pitch('c4').enharmonics(true),
        ['b#3'].map(teoria.pitch));
    },

    'fb is enharmonic with e': function() {
      assert.deepEqual(teoria.pitch('fb4').enharmonics(true),
        ['e4'].map(teoria.pitch));
    },

    'cb is enharmonic with b': function() {
      assert.deepEqual(teoria.pitch('cb4').enharmonics(true),
        ['b3'].map(teoria.pitch));
    }
  }
}).export(module);
