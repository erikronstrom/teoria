var scientific = require('scientific-notation');
var helmholtz = require('helmholtz');
var knowledge = require('./knowledge');
var notecoord = require('notecoord');
var vector = require('./vector');
var Interval = require('./interval');
var misc = require('./misc');
var xml2js = require('xml2js');
var chalk = require('chalk');

function pad(str, ch, len) {
  for (; len > 0; len--) {
    str += ch;
  }

  return str;
}


function Pitch(coord) {
  if (!(this instanceof Pitch)) return new Pitch(coord);
  this.coord = coord;
}

Pitch.prototype = {
  inspect: function() {
    return chalk.green('<') + chalk.green.bold(this.scientific()) + chalk.green('>');
  },
  
  octave: function() {
    return Math.floor((this.coord[0] + knowledge.A4[0]) / 7);
  },

  name: function() {
    return knowledge.tones[(this.coord[0] + knowledge.A4[0]) % 7];
  },

  accidentalValue: function() {
    return (this.coord[1] + knowledge.A4[1]) - (this.octave() * 12 + knowledge.pitches[this.name()][1]);
  },

  accidental: function() {
    return knowledge.accidentals[this.accidentalValue() + 2];
  },

  /**
   * Returns the key number of the pitch
   */
  key: function(white) {
    if (white)
      return this.coord[0] + knowledge.A4[0] - 4;
    else
      return this.coord[1] + knowledge.A4[1] - 8;
  },

  /**
  * Returns a number ranging from 0-127 representing a MIDI pitch value
  */
  midi: function() {
    return this.key() + 20;
  },

  /**
   * Calculates and returns the frequency of the pitch.
   * Optional concert pitch (def. 440)
   */
  fq: function(concertPitch) {
    concertPitch = concertPitch || 440;

    return concertPitch *
      Math.pow(2, (this.coord[1] / 12));
  },

  /**
   * Returns the pitch class index (chroma) of the pitch
   */
  chroma: function() {
    return (((this.coord[1] + knowledge.A4[1]) % 12) + 12) % 12;
  },

  interval: function(interval) {
    if (typeof interval === 'string') interval = Interval.fromString(interval);

    if (interval instanceof Interval)
      return new Pitch(vector.add(this.coord, interval.coord));
    else if (interval instanceof Pitch)
      return new Interval(vector.sub(interval.coord, this.coord));
  },

  transpose: function(interval) {
    this.coord = vector.add(this.coord, interval.coord);
    return this;
  },

  /**
   * Returns the Helmholtz notation form of the pitch (fx C,, d' F# g#'')
   */
  helmholtz: function() {
    var octave = this.octave();
    var name = this.name();
    name = octave < 3 ? name.toUpperCase() : name.toLowerCase();
    var padchar = octave < 3 ? ',' : '\'';
    var padcount = octave < 2 ? 2 - octave : octave - 3;

    return pad(name + this.accidental(), padchar, padcount);
  },

  /**
   * Returns the scientific notation form of the pitch (fx E4, Bb3, C#7 etc.)
   */
  scientific: function() {
    return this.name().toUpperCase() + this.accidental() + this.octave();
  },

  /**
   * Returns pitches that are enharmonic with this pitch.
   */
  enharmonics: function(oneaccidental) {
    var key = this.key(), limit = oneaccidental ? 2 : 3;

    return ['m3', 'm2', 'm-2', 'm-3']
      .map(this.interval.bind(this))
      .filter(function(pitch) {
      var acc = pitch.accidentalValue();
      var diff = key - (pitch.key() - acc);

      if (diff < limit && diff > -limit) {
        pitch.coord = vector.add(pitch.coord, vector.mul(knowledge.sharp, diff - acc));
        return true;
      }
    });
  },

  solfege: function(scale, showOctaves) {
    var interval = scale.tonic.interval(this), solfege, stroke, count;
    if (interval.direction() === 'down')
      interval = interval.invert();

    if (showOctaves) {
      count = (this.key(true) - scale.tonic.key(true)) / 7;
      count = (count >= 0) ? Math.floor(count) : -(Math.ceil(-count));
      stroke = (count >= 0) ? '\'' : ',';
    }

    solfege = knowledge.intervalSolfege[interval.simple(true).toString()];
    return (showOctaves) ? pad(solfege, stroke, Math.abs(count)) : solfege;
  },

  scaleDegree: function(scale) {
    var inter = scale.tonic.interval(this);

    // If the direction is down, or we're dealing with an octave - invert it
    if (inter.direction() === 'down' ||
       (inter.coord[1] === 0 && inter.coord[0] !== 0)) {
      inter = inter.invert();
    }
    
    inter = inter.simple(true).coord;
    
    return scale.scale.reduce(function(index, current, i) {
      var coord = Interval.fromString(current).coord;
      return coord[0] === inter[0] && coord[1] === inter[1] ? i + 1 : index;
    }, 0);
  },

  /**
   * Returns the name of the pitch, with an optional display of octave number
   */
  toString: function(dont) {
    return this.name().toUpperCase() + this.accidental() + (dont ? '' : this.octave());
  },
  
  toXML: function(rootName) {
    return misc.buildXML(this.toXMLObject(), {rootName: rootName || 'pitch'});
  },
  
  toXMLObject: function() {
    return {step: this.name().toUpperCase(), alter: this.accidentalValue(), octave: this.octave() };
  }
};

Pitch.coerce = function(source, copy) {
  if (source instanceof Pitch) return copy ? new Pitch(source.coord) : source;
  if (typeof source === 'string') return Pitch.fromString(source);
  if (source instanceof Array && source.length === 2) return new Pitch(source);
  throw new Error("Cannot coerce " + source + " to a pitch!");
}

Pitch.fromString = function(name) {
  var coord = scientific(name);
  if (!coord) coord = helmholtz(name);
  return new Pitch(coord);
}

Pitch.fromKey = function(key) {
  var semitones = key - knowledge.A4[1] + 8;
  var steps = Math.round(semitones * 7/12)
  return new Pitch([steps, semitones]);
}

Pitch.fromFrequency = function(fq, concertPitch) {
  var key, cents, originalFq;
  concertPitch = concertPitch || 440;

  key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
  key = Math.round(key);
  originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
  cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

  return { pitch: Pitch.fromKey(key), cents: cents };
}

Pitch.fromMIDI = function(pitch) {
  return Pitch.fromKey(pitch - 20);
}

Pitch.fromXML = function(xml) {
  var obj = misc.parseXML(xml, {explicitArray: false, mergeAttrs: true, explicitCharkey: false});
  return Pitch.fromXMLObject(obj);
};

Pitch.fromXMLObject = function(obj) {
  var coord = notecoord.notes[obj.step.toLowerCase()].slice();
  coord[1] += parseInt(obj.alter) || 0;
  var octave = parseInt(obj.octave);
  coord = vector.add(coord, octave.octaves); // TODO: verify that this is the correct octave!
  coord = vector.sub(coord, knowledge.A4);
  return new Pitch(coord);
}

module.exports = Pitch;
