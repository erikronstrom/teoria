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
