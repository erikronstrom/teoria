var knowledge = require('./knowledge');

module.exports = function(teoria) {
  var Pitch = teoria.Pitch;
  var Chord = teoria.Chord;
  var Scale = teoria.Scale;

  Pitch.prototype.chord = function(chord) {
    chord = (chord in knowledge.chordShort) ? knowledge.chordShort[chord] : chord;

    return new Chord(this, chord);
  }

  Pitch.prototype.scale = function(scale) {
    return new Scale(this, scale);
  }
}

// NB: for these to work in the node REPL, it must be started with {useGlobal: true}

Object.defineProperty(Number.prototype, 'semitones', {
  get: function() { return [0, this.valueOf()]; },
  enumerable: false,
  configurable: false
});

Object.defineProperty(Number.prototype, 'octaves', {
  get: function() { return [7 * this.valueOf(), 12 * this.valueOf()]; },
  enumerable: false,
  configurable: false
});
