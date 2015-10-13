var Pitch = require('./lib/pitch');
var Interval = require('./lib/interval');
var Chord = require('./lib/chord');
var Scale = require('./lib/scale');
var Duration = require('./lib/duration');
var Note = require('./lib/note');

function intervalConstructor(from, to) {
  // Construct a Interval object from string representation
  if (typeof from === 'string')
    return Interval.fromString(from);
  
  if (from instanceof Array) {
    return new Interval(from);
  }

  if (typeof to === 'string' && from instanceof Pitch)
    return Interval.from(from, Interval.fromString(to));

  if (to instanceof Interval && from instanceof Pitch)
    return Interval.from(from, to);

  if (to instanceof Pitch && from instanceof Pitch)
    return Interval.between(from, to);
  
  throw new Error('Invalid parameters');
}

intervalConstructor.toCoord = Interval.fromString;
intervalConstructor.from = Interval.from;
intervalConstructor.between = Interval.between;
intervalConstructor.invert = Interval.invert;

function pitchConstructor(name) {
  if (typeof name === 'string')
    return Pitch.fromString(name);
  else
    return new Pitch(name);
}

pitchConstructor.fromString = Pitch.fromString;
pitchConstructor.fromKey = Pitch.fromKey;
pitchConstructor.fromFrequency = Pitch.fromFrequency;
pitchConstructor.fromMIDI = Pitch.fromMIDI;

function chordConstructor(name, kind) {
  if (typeof name === 'string' && !kind) {
    return Chord.fromString(name);
  } else if (name instanceof Pitch) {
    return new Chord(name, kind);
  }

  throw new Error('Invalid Chord. Couldn\'t find pitch name');
}

function scaleConstructor(tonic, scale) {
  tonic = (tonic instanceof Pitch) ? tonic : teoria.pitch(tonic);
  return new Scale(tonic, scale);
}

var teoria = {
  pitch: pitchConstructor,

  chord: chordConstructor,

  interval: intervalConstructor,

  scale: scaleConstructor,
  duration: Duration.coerce,
  note: Note.coerce,

  Pitch: Pitch,
  Chord: Chord,
  Scale: Scale,
  Interval: Interval,
  Duration: Duration,
  Note: Note
};

require('./lib/sugar')(teoria);
exports = module.exports = teoria;
