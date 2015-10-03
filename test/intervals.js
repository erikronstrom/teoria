var vows = require('vows'),
    assert = require('assert'),
    teoria = require('../');

function addSimple(interval1, interval2) {
  return teoria.interval(interval1).add(teoria.interval(interval2));
}

vows.describe('Intervals').addBatch({
  'Relative Intervals': {
    topic: function() {
      return teoria.pitch('F#,');
    },

    'Doubly diminished second': function(pitch) {
      assert.deepEqual(pitch.interval('dd2'), teoria.pitch('Gbb,'));
    },

    'Diminished second': function(pitch) {
      assert.deepEqual(pitch.interval('d2'), teoria.pitch('Gb,'));
    },

    'Diminished second, API method two': function(pitch) {
      assert.deepEqual(teoria.interval(pitch, teoria.interval('d2')), teoria.pitch('Gb,'));
    },

    'Diminished second, API method three': function(pitch) {
      assert.deepEqual(pitch.interval(teoria.interval('d2')), teoria.pitch('Gb,'));
    },

    'Minor second': function(pitch) {
      assert.deepEqual(pitch.interval('m2'), teoria.pitch('G,'));
    },

    'Major second': function(pitch) {
      assert.deepEqual(pitch.interval('M2'), teoria.pitch('G#,'));
    },

    'Augmented second': function(pitch) {
      assert.deepEqual(pitch.interval('A2'), teoria.pitch('Gx,'));
    },

    'Doubly diminished third': function(pitch) {
      assert.deepEqual(pitch.interval('dd3'), teoria.pitch('Abb,'));
    },

    'Diminished third': function(pitch) {
      assert.deepEqual(pitch.interval('d3'), teoria.pitch('Ab,'));
    },

    'Minor third': function(pitch) {
      assert.deepEqual(pitch.interval('m3'), teoria.pitch('A,'));
    },

    'Major third': function(pitch) {
      assert.deepEqual(pitch.interval('M3'), teoria.pitch('A#,'));
    },

    'Augmented third': function(pitch) {
      assert.deepEqual(pitch.interval('A3'), teoria.pitch('Ax,'));
    },

    'Doubly diminished fourth': function(pitch) {
      assert.deepEqual(pitch.interval('dd4'), teoria.pitch('Bbb,'));
    },

    'Diminished fourth': function(pitch) {
      assert.deepEqual(pitch.interval('d4'), teoria.pitch('Bb,'));
    },

    'Perfect fourth': function(pitch) {
      assert.deepEqual(pitch.interval('P4'), teoria.pitch('B,'));
    },

    'Augmented fourth': function(pitch) {
      assert.deepEqual(pitch.interval('A4'), teoria.pitch('B#,'));
    },

    'Doubly augmented fourth': function(pitch) {
      assert.deepEqual(pitch.interval('AA4'), teoria.pitch('Bx,'));
    },

    'Doubly diminished fifth': function(pitch) {
      assert.deepEqual(pitch.interval('dd5'), teoria.pitch('Cb'));
    },

    'Diminished fifth': function(pitch) {
      assert.deepEqual(pitch.interval('d5'), teoria.pitch('C'));
    },

    'Perfect fifth': function(pitch) {
      assert.deepEqual(pitch.interval('P5'), teoria.pitch('C#'));
    },

    'Augmented fifth': function(pitch) {
      assert.deepEqual(pitch.interval('A5'), teoria.pitch('Cx'));
    },

    'Doubly diminished sixth': function(pitch) {
      assert.deepEqual(pitch.interval('dd6'), teoria.pitch('Dbb'));
    },

    'Diminished sixth': function(pitch) {
      assert.deepEqual(pitch.interval('d6'), teoria.pitch('Db'));
    },

    'Minor sixth': function(pitch) {
      assert.deepEqual(pitch.interval('m6'), teoria.pitch('D'));
    },

    'Major sixth': function(pitch) {
      assert.deepEqual(pitch.interval('M6'), teoria.pitch('D#'));
    },

    'Augmented sixth': function(pitch) {
      assert.deepEqual(pitch.interval('A6'), teoria.pitch('Dx'));
    },

    'Doubly diminished seventh': function(pitch) {
      assert.deepEqual(pitch.interval('dd7'), teoria.pitch('Ebb'));
    },

    'Diminished seventh': function(pitch) {
      assert.deepEqual(pitch.interval('d7'), teoria.pitch('Eb'));
    },

    'Minor seventh': function(pitch) {
      assert.deepEqual(pitch.interval('m7'), teoria.pitch('E'));
    },

    'Major seventh': function(pitch) {
      assert.deepEqual(pitch.interval('M7'), teoria.pitch('E#'));
    },

    'Augmented seventh': function(pitch) {
      assert.deepEqual(pitch.interval('A7'), teoria.pitch('Ex'));
    },

    'Doubly diminished octave': function(pitch) {
      assert.deepEqual(pitch.interval('dd8'), teoria.pitch('Fb'));
    },

    'Diminished octave': function(pitch) {
      assert.deepEqual(pitch.interval('d8'), teoria.pitch('F'));
    },

    'Perfect octave': function(pitch) {
      assert.deepEqual(pitch.interval('P8'), teoria.pitch('F#'));
    },

    'Augmented octave': function(pitch) {
      assert.deepEqual(pitch.interval('A8'), teoria.pitch('Fx'));
    },

    'Minor ninth': function(pitch) {
      assert.deepEqual(pitch.interval('m9'), teoria.pitch('G'));
    },

    'Major ninth': function(pitch) {
      assert.deepEqual(pitch.interval('M9'), teoria.pitch('G#'));
    },

    'Minor tenth': function(pitch) {
      assert.deepEqual(pitch.interval('m10'), teoria.pitch('A'));
    },

    'Major tenth': function(pitch) {
      assert.deepEqual(pitch.interval('M10'), teoria.pitch('A#'));
    },

    'Perfect eleventh': function(pitch) {
      assert.deepEqual(pitch.interval('P11'), teoria.pitch('B'));
    },

    'Diminished twelfth': function(pitch) {
      assert.deepEqual(pitch.interval('d12'), teoria.pitch('c'));
    },

    'Perfect twelfth': function(pitch) {
      assert.deepEqual(pitch.interval('P12'), teoria.pitch('c#'));
    },

    'Minor thirteenth': function(pitch) {
      assert.deepEqual(pitch.interval('m13'), teoria.pitch('d'));
    },

    'Major thirteenth': function(pitch) {
      assert.deepEqual(pitch.interval('M13'), teoria.pitch('d#'));
    },

    'Minor fourteenth': function(pitch) {
      assert.deepEqual(pitch.interval('m14'), teoria.pitch('e'));
    },

    'Major fourteenth': function(pitch) {
      assert.deepEqual(pitch.interval('M14'), teoria.pitch('e#'));
    },

    'Doubly diminished second up': function() {
      assert.deepEqual(teoria.pitch('e').interval(teoria.pitch('fbb')),
          teoria.interval('dd2'));
    },

    'Doubly diminished second down': function() {
      assert.deepEqual(teoria.pitch('f').interval(teoria.pitch('ex')),
          teoria.interval('dd-2'));
    }
  },

  'Interval descending': {
    'A major third down from E4': function() {
      assert.deepEqual(teoria.pitch('E4').interval('M-3'), teoria.pitch('C4'));
    },

    'Minor second down from C2': function() {
      assert.deepEqual(teoria.pitch('C2').interval('m-2'), teoria.pitch('B1'));
    },

    'A diminished fifth down from Eb5': function() {
      assert.deepEqual(teoria.pitch('Eb5').interval('d-5'), teoria.pitch('A4'));
    },

    'A major ninth down from G#4': function() {
      assert.deepEqual(teoria.pitch('G#4').interval('M-9'), teoria.pitch('F#3'));
    },

    'An augmented sixth down from Bb4': function() {
      assert.deepEqual(teoria.pitch('Bb4').interval('A-6'), teoria.pitch('Dbb4'));
    }
  },

  'Interval inversions': {
    'Invert m2 is M7': function() {
      assert.equal(teoria.interval.invert('m2'), 'M7');
    },

    'Invert M2 is m7': function() {
      assert.equal(teoria.interval.invert('M2'), 'm7');
    },

    'Invert m3 is M6': function() {
      assert.equal(teoria.interval.invert('m3'), 'M6');
    },

    'Invert M3 is m6': function() {
      assert.equal(teoria.interval.invert('M3'), 'm6');
    },

    'Invert P4 is P5': function() {
      assert.equal(teoria.interval.invert('P4'), 'P5');
    },

    'Invert A5 is d4': function() {
      assert.equal(teoria.interval.invert('A5'), 'd4');
    }
  },

  'Interval base': {
    'Base of d5 is a fifth': function() {
      assert.equal(teoria.interval('d5').base(), 'fifth');
    },

    'Base of A7 is a seventh': function() {
      assert.equal(teoria.interval('A7').base(), 'seventh');
    },

    'Base of m2 is a second': function() {
      assert.equal(teoria.interval('m2').base(), 'second');
    },

    'Base of M6 is a sixth': function() {
      assert.equal(teoria.interval('M6').base(), 'sixth');
    },

    'Base of dd8 is an octave if octaveIsSimple is set': function() {
      teoria.Interval.octaveIsSimple = true;
      assert.equal(teoria.interval('dd8').base(), 'octave');
    },
    
    'Base of dd8 is a unison if octaveIsSimple is not set': function() {
      teoria.Interval.octaveIsSimple = false;
      assert.equal(teoria.interval('dd8').base(), 'unison');
    },

    'Base of AA4 is a fourth': function() {
      assert.equal(teoria.interval('AA4').base(), 'fourth');
    },

    'Base of d-5 is a fifth': function() {
      assert.equal(teoria.interval('d-5').base(), 'fifth');
    },

    'Base of m-9 is a second': function() {
      assert.equal(teoria.interval('m-2').base(), 'second');
    },

    'Base of M-13 is a sixth': function() {
      assert.equal(teoria.interval('M-13').base(), 'sixth');
    },

    'Base of P-11 is a fourth': function() {
      assert.equal(teoria.interval('P-11').base(), 'fourth');
    },

    'Base of AA-7 is a seventh': function() {
      assert.equal(teoria.interval('AA-7').base(), 'seventh');
    }
  },

  'Compound Intervals': {
    'A major seventeenth is a compound interval': function() {
      assert.equal(teoria.interval('M17').isCompound(), true);
    },

    'A major seventeenth\'s simple part is a major third': function() {
      assert.equal(teoria.interval('M17').simple(), 'M3');
    },

    'A descending major fourteenth\'s simple part is a descending major seventh': function() {
      assert.equal(teoria.interval('M-14').simple(), 'M-7');
    },

    'A perfect nineteenth\'s simple part is equal to a perfect fifth': function() {
      assert.equal(teoria.interval('P19').simple().equal(teoria.interval('P5')), true);
    },

    'A perfect nineteenth\'s simple part is not equal to a major sixth': function() {
      assert.equal(teoria.interval('P19').simple().equal(teoria.interval('M6')), false);
    },

    'A descending augmented ninth\'s simple part is equal to a descending augmented second': function() {
      assert.equal(teoria.interval('A-9').simple().equal(teoria.interval('A-2')), true);
    },

    'A 22nd has two compound octaves if octave is simple': function() {
      teoria.Interval.octaveIsSimple = true;
      assert.equal(teoria.interval('P22').octaves(), 2);
    },
    
    'A 22nd has three compound octaves if octave is compound': function() {
      teoria.Interval.octaveIsSimple = false;
      assert.equal(teoria.interval('P22').octaves(), 3);
    },

    'A descending fourth has no compound octaves': function() {
      assert.equal(teoria.interval('P-4').octaves(), 0);
    },

    'A descending eleventh has one compound octave': function() {
      assert.equal(teoria.interval('P-11').octaves(), 1);
    },

    'A descending augmented third has no compound octaves': function() {
      assert.equal(teoria.interval('A-3').octaves(), 0);
    },

    'A descending major 16th has two compound octaves': function() {
      assert.equal(teoria.interval('M-16').octaves(), 2);
    },

    'A major seventh is greater than a minor seventh': function() {
      assert.equal(teoria.interval('M7').greater(teoria.interval('m7')), true);
    },

    'An augmented octave is smaller than a major ninth': function() {
      assert.equal(teoria.interval('A8').smaller(teoria.interval('M9')), true);
    },

    'A major third is equal to another major third': function() {
      assert.equal(teoria.interval('M3').equal(teoria.interval('M3')), true);
    },

    'An augmented fifth is not equal to a minor sixth': function() {
      assert.equal(teoria.interval('P5').equal(teoria.interval('m6')), false);
    },

    'A perfect fifth is not equal to a perfect octave': function() {
      assert.equal(teoria.interval('P5').equal(teoria.interval('P8')), false);
    },

    'The simple part of a major 23th is a major second': function() {
      assert.equal(teoria.interval('M23').simple(), 'M2');
    }
  },

  'Interval direction': {
    'A3 to C4 is up': function() {
      assert.equal(teoria.pitch('A3').interval(teoria.pitch('C4')).direction(), 'up');
    },

    'Bb5 to Bb5 is up (a unison is always up)': function() {
      assert.equal(teoria.pitch('Bb5').interval(teoria.pitch('Bb5')).direction(), 'up');
    },

    'G#4 to D4 is down': function() {
      assert.equal(teoria.pitch('G#4').interval(teoria.pitch('D4')).direction(), 'down');
    },

    'F6 to E6 is down': function() {
      assert.equal(teoria.pitch('F6').interval(teoria.pitch('E6')).direction(), 'down');
    },

    'C4 to A3 is up, w. direction set to up': function() {
      assert.equal(teoria.pitch('C4').interval(teoria.pitch('A3')).direction('up').direction(), 'up');
    },

    'A3 to C4 remains up w. direction set to up': function() {
      assert.equal(teoria.pitch('A3').interval(teoria.pitch('C4')).direction('up').direction(), 'up');
    },

    'm2 is up': function() {
      assert.equal(teoria.interval('m2').direction(), 'up');
    },

    'P11 is up': function() {
      assert.equal(teoria.interval('P11').direction(), 'up');
    },

    'P1 is up': function() {
      assert.equal(teoria.interval('P1').direction(), 'up');
    },

    'A1 is up': function() {
      assert.equal(teoria.interval('A1').direction(), 'up');
    },

    // 'd1 is up': function() {
    //   assert.equal(teoria.interval('d1').direction(), 'up');
    // },

    'm-2 is down': function() {
      assert.equal(teoria.interval('m-2').direction(), 'down');
    },

    'M-17 is down': function() {
      assert.equal(teoria.interval('M-17').direction(), 'down');
    },

    'd-2 is down': function() {
      assert.equal(teoria.interval('d-2').direction(), 'down');
    },

    'dd-2 is down (although it is up)': function() {
      assert.equal(teoria.interval('dd-2').direction(), 'down');
    },

    'A-2 is down': function() {
      assert.equal(teoria.interval('A-2').direction(), 'down');
    },

    // 'd-1 is up (all unison values are up)': function() {
    //   assert.equal(teoria.interval('d-1').direction(), 'up');
    // },

    'A-1 is up (all unison values are up)': function() {
      assert.equal(teoria.interval('A-1').direction(), 'up');
    }
  },

  'Interval arithmetic': {
    'm3 + M2 = P4': function() {
      assert.equal(addSimple('m3', 'M2').toString(), 'P4');
    },

    'P4 + P5 = P8': function() {
      assert.equal(addSimple('P4', 'P5').toString(), 'P8');
    },

    'M6 + A4 = A9': function() {
      assert.equal(addSimple('M6', 'A4').toString(), 'A9');
    },

    'M-2 + m-2 = m-3': function() {
      assert.equal(addSimple('M-2', 'm-2').toString(), 'm-3');
    },

    'A11 + M9 = A19': function() {
      assert.equal(addSimple('A11', 'M9').toString(), 'A19');
    },

    'm-10 + P4 = m-7': function() {
      assert.equal(addSimple('m-10', 'P4').toString(), 'm-7');
    }
  },

  'Theoretical intervals - Triple augmented': {
    topic: function() {
      return teoria.pitch('F').interval(teoria.pitch('Bx'));
    },

    'F to Bx has quality value = 3 (triple augmented)': function(interval) {
      assert.equal(interval.qualityValue(), 3);
    },

    '#simple() works': function(interval) {
      assert.deepEqual(interval.simple().coord, [3, 8]);
    }
  }
}).export(module);
