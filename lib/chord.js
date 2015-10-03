var daccord = require('daccord');
var knowledge = require('./knowledge');
var Note = require('./note');
var Interval = require('./interval');

var XML_HARMONIES = {
  'major': ['M3', 'P5'],
  'minor': ['m3', 'P5'],
  'augmented': ['M3', 'A5'],
  'diminished': ['m3', 'd5'],
  'dominant': ['M3', 'P5', 'm7'],
  'major-seventh': ['M3', 'P5', 'M7'],
  'minor-seventh': ['m3', 'P5', 'm7'],
  'diminished-seventh': ['m3', 'd5', 'd7'],
  'augmented-seventh': ['M3', 'A5', 'm7'],
  'half-diminished': ['m3', 'd5', 'm7'],
  'major-minor': ['m3', 'P5', 'M7'],
  'major-sixth': ['M3', 'P5', 'M6'],
  'minor-sixth': ['m3', 'P5', 'M6'],
  'dominant-ninth': ['M3', 'P5', 'm7', 'M9'],
  'major-ninth': ['M3', 'P5', 'M7', 'M9'],
  'minor-ninth': ['m3', 'P5', 'm7', 'M9'],
  'dominant-11th': ['M3', 'P5', 'm7', 'M9', 'P11'],
  'major-11th': ['M3', 'P5', 'M7', 'M9', 'P11'],
  'minor-11th': ['m3', 'P5', 'm7', 'M9', 'P11'],
  'dominant-13th': ['M3', 'P5', 'm7', 'M9', 'P11'],
  'major-13th': ['M3', 'P5', 'M7', 'M9', 'P11', 'M13'],
  'minor-13th': ['m3', 'P5', 'm7', 'M9', 'P11', 'M13'],
  'suspended-second': ['M2', 'P5'],
  'suspended-fourth': ['P4', 'P5'],
  'Neapolitan': ['M3', 'm6'],
  // 'Italian'
  // 'French'
  // 'German'
  // 'pedal'
  'power': ['P5'],
  'Tristan': ['A4', 'A6', 'A9']
};

function Chord(root, name) {
  if (!(this instanceof Chord)) return new Chord(root, name);
  name = name || '';
  this.name = root.name().toUpperCase() + root.accidental() + name;
  this.symbol = name;
  this.root = root;
  this.intervals = [];
  this._voicing = [];

  var bass = name.split('/');
  if (bass.length === 2 && bass[1].trim() !== '9') {
    name = bass[0];
    bass = bass[1].trim();
  } else {
    bass = null;
  }

  this.intervals = daccord(name).map(Interval.toCoord)
  this._voicing = this.intervals.slice();

  if (bass) {
    var intervals = this.intervals, bassInterval, note;
    // Make sure the bass is atop of the root note
    note = Note.fromString(bass + (root.octave() + 1)); // crude

    bassInterval = Interval.between(root, note);
    bass = bassInterval.simple();
    bassInterval = bassInterval.invert().direction('down');

    this._voicing = [bassInterval];
    for (var i = 0, length = intervals.length;  i < length; i++) {
      if (!intervals[i].simple().equal(bass))
        this._voicing.push(intervals[i]);
    }
  }
}

Chord.prototype = {
  notes: function() {
    var root = this.root;
    return this.voicing().map(function(interval) {
      return root.interval(interval);
    });
  },

  simple: function() {
    return this.notes().map(function(n) { return n.toString(true); });
  },

  bass: function() {
    return this.root.interval(this._voicing[0]);
  },
  
  isMajor: function() {
    var degree = this.getDegree(3);
    return degree && degree.quality() === 'M';
  },
  
  isMinor: function() {
    var degree = this.getDegree(3);
    return degree && degree.quality() === 'm';
  },

  voicing: function(voicing) {
    // Get the voicing
    if (!voicing) {
      return this._voicing;
    }

    // Set the voicing
    this._voicing = [];
    for (var i = 0, length = voicing.length; i < length; i++) {
      this._voicing[i] = Interval.toCoord(voicing[i]);
    }

    return this;
  },

  resetVoicing: function() {
    this._voicing = this.intervals;
  },

  dominant: function(additional) {
    additional = additional || '';
    return new Chord(this.root.interval('P5'), additional);
  },

  subdominant: function(additional) {
    additional = additional || '';
    return new Chord(this.root.interval('P4'), additional);
  },

  parallel: function(additional) {
    additional = additional || '';
    var quality = this.quality();

    if (this.chordType() !== 'triad' || quality === 'diminished' ||
        quality === 'augmented') {
      throw new Error('Only major/minor triads have parallel chords');
    }

    if (this.isMajor()) {
      return new Chord(this.root.interval('m3', 'down'), 'm');
    } else {
      return new Chord(this.root.interval('m3', 'up'));
    }
  },

  // quality: function() {
  //   var third = this.getDegree(3);
  //   var fifth = this.getDegree(5);
  //   var seventh = this.getDegree(7);
  //
  //   if (!third) {
  //     return;
  //   }
  //
  //   // Logical error in the original source?
  //   // If there is a minor 3 downwards, that would no longer be a third if we invert it?!
  //   third = (third.direction() === 'down') ? third.invert() : third;
  //   third = third.simple().toString();
  //
  //   if (fifth) {
  //     fifth = (fifth.direction === 'down') ? fifth.invert() : fifth;
  //     fifth = fifth.simple().toString();
  //   }
  //
  //   if (seventh) {
  //     seventh = (seventh.direction === 'down') ? seventh.invert() : seventh;
  //     seventh = seventh.simple().toString();
  //   }
  //
  //   if (third === 'M3') {
  //     if (fifth === 'A5') {
  //       return 'augmented';
  //     } else if (fifth === 'P5') {
  //       return (seventh === 'm7') ? 'dominant' : 'major';
  //     }
  //
  //     return 'major';
  //   } else if (third === 'm3') {
  //     if (fifth === 'P5') {
  //       return 'minor';
  //     } else if (fifth === 'd5') {
  //       return (seventh === 'm7') ? 'half-diminished' : 'diminished';
  //     }
  //
  //     return 'minor';
  //   }
  // },
  
  quality: function() {
    var degrees = {};
    [2, 3, 4, 5, 6, 7].map(function(x) {
      var interval = this.getDegree(x);
      degrees[x] = interval ? interval.quality() : null;
    }, this);
    
    // SPECIAL
    if (!degrees[3] && degrees[7] === 'm' && degrees[2] === 'M' && degrees[4] === 'P')
      return "dominant-11th";
    if (degrees[7] === 'm' && degrees[3] === 'M' && degrees[6] === 'M')
      return "dominant-13th";
    
    // MAJOR CHORDS
    if (degrees[3] === 'M') {
      // Augmented
      if (degrees[5] === 'A') {
        if (degrees[7] === 'm') return "augmented-seventh";
        return "augmented";
      }
      // Dominants
      if (degrees[7] === 'm') {
        if (degrees[2] === 'M') return "dominant-ninth";
        if (degrees[2] === 'M') return "dominant-ninth";
        return "dominant";
      }
      // Major sevenths
      if (degrees[7] === 'M') {
        if (degrees[6] === 'M') return 'major-13th';
        if (degrees[2] === 'M') return "major-ninth";
        return "major-seventh";
      }
      // Other major chords
      if (degrees[5] === 'A') return "augmented";
      if (degrees[6] === 'M') return "major-sixth";
      return "major";
    }
    
    // MINOR CHORDS
    if (degrees[3] === 'm') {
      // Diminished & half-diminished
      if (degrees[5] === 'd') {
        if (degrees[7] === 'd') return "diminished-seventh";
        if (degrees[7] === 'm') return "half-diminished";
        return "diminished";
      }
      // Sevenths
      if (degrees[7] === 'm') {
        if (degrees[2] === 'M') return "minor-ninth";
        return "minor-seventh";
      }
      // Other minor chords
      if (degrees[6] === 'M') return "minor-sixth";
      if (degrees[7] === 'M') return "major-minor";
      return "minor";
    }
    
    // SUSPENDED
    if (degrees[5] === 'P' || !degrees[5]) {
      if (degrees[2] === 'M') return "suspended-second";
      if (degrees[4] === 'P') return "suspended-fourth";
    }
      
    return "other";
  },

  chordType: function() { // In need of better name
    var length = this.intervals.length, interval, has, invert, i, name;

    if (length === 2) {
      return 'dyad';
    } else if (length === 3) {
      has = {first: false, third: false, fifth: false};
      for (i = 0; i < length; i++) {
        interval = this.intervals[i];
        invert = interval.invert();
        if (interval.base() in has) {
          has[interval.base()] = true;
        } else if (invert.base() in has) {
          has[invert.base()] = true;
        }
      }

      name = (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
    } else if (length === 4) {
      has = {first: false, third: false, fifth: false, seventh: false};
      for (i = 0; i < length; i++) {
        interval = this.intervals[i];
        invert = interval.invert();
        if (interval.base() in has) {
          has[interval.base()] = true;
        } else if (invert.base() in has) {
          has[invert.base()] = true;
        }
      }

      if (has.first && has.third && has.fifth && has.seventh) {
        name = 'tetrad';
      }
    }

    return name || 'unknown';
  },

  getDegree: function(interval) {
    var intervals = this.intervals, i, length;
    interval = (interval - 1) % 7;
    for (i = 0, length = intervals.length; i < length; i++) {
      if ((intervals[i].number() - 1) % 7 === interval) {
        return intervals[i];
      }
    }
    return null;
  },

  get: function(interval) {
    var intervals = this.intervals, i, length;
    if (typeof interval === 'number') {
      for (i = 0, length = intervals.length; i < length; i++) {
        if (intervals[i].number() === interval) {
          return this.root.interval(intervals[i]);
        }
      }
      return null;
    } else if (typeof interval === 'string' && interval in knowledge.stepNumber) {
      interval = knowledge.stepNumber[interval];
      for (i = 0, length = intervals.length; i < length; i++) {
        if (intervals[i].number() === interval) {
          return this.root.interval(intervals[i]);
        }
      }

      return null;
    } else {
      throw new Error('Invalid interval name');
    }
  },

  interval: function(interval) {
    return new Chord(this.root.interval(interval), this.symbol);
  },

  transpose: function(interval) {
    this.root.transpose(interval);
    this.name = this.root.name().toUpperCase() +
                this.root.accidental() + this.symbol;

    return this;
  },

  toString: function() {
    return this.name;
  }
};

module.exports = Chord;
