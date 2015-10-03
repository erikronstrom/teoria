var Pitch = require('./lib/pitch');
var Interval = require('./lib/interval');
var Chord = require('./lib/chord');
var Scale = require('./lib/scale');

// never thought I would write this, but: Legacy support
function intervalConstructor(from, to) {
  // Construct a Interval object from string representation
  if (typeof from === 'string')
    return Interval.toCoord(from);

  if (typeof to === 'string' && from instanceof Pitch)
    return Interval.from(from, Interval.toCoord(to));

  if (to instanceof Interval && from instanceof Pitch)
    return Interval.from(from, to);

  if (to instanceof Pitch && from instanceof Pitch)
    return Interval.between(from, to);

  throw new Error('Invalid parameters');
}

intervalConstructor.toCoord = Interval.toCoord;
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

function chordConstructor(name, symbol) {
  if (typeof name === 'string') {
    var root, octave;
    root = name.match(/^([a-h])(x|#|bb|b?)/i);
    if (root && root[0]) {
      octave = typeof symbol === 'number' ? symbol.toString(10) : '4';
      return new Chord(Pitch.fromString(root[0].toLowerCase() + octave),
                            name.substr(root[0].length));
    }
  } else if (name instanceof Pitch)
    return new Chord(name, symbol);

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

  Pitch: Pitch,
  Chord: Chord,
  Scale: Scale,
  Interval: Interval
};

require('./lib/sugar')(teoria);
exports = module.exports = teoria;
