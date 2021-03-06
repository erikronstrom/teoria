Teoria.js
=========

Teoria.js is a lightweight and fast JavaScript library
for music theory, both Jazz and Classical. It aims at providing an intuitive
programming interface for music software (such as Sheet Readers,
Sheet Writers, MIDI Players etc.).

This fork replaces the pitch and interval representation of Teoria.
The `[fifths, octaves]` representation used in Teoria is elegant,
but it does not [easily] extend to pitch-classes outside the Western
tonal system of twelve semitones per octave.

This fork uses instead a vector of `[steps, semitones]`, where `steps`
is the "diatonic distance" of an interval, and `semitones` the number
of semitones. Thus, a major third is represented as `[2, 4]`. It is
easy to identify the relationship with e.g. the minor third `[2, 3]`,
which belongs to the same pitch-class but has different accidentals and
sound differently. The diminished fourth `[3, 4]` sounds the same as
the major third, but belongs to a different pitch-class.

This model can easily represent intervals with higher resoultion than
semitones, by using fractional numbers as `semitones`. For example,
a third between major and minor can be written `[2, 3.5]`.

Features
---------

 - A pitch object (`teoria.Pitch`), which understands alterations, octaves,
 key number, frequency and etc. and Helmholtz notation

 - A chord object (`teoria.Chord`), which understands everything
 from simple major/minor chords to advanced Jazz chords (Ab#5b9, F(#11) and such)

 - A scale object (`teoria.Scale`), The scale object is a powerful presentation of
 a scale, which supports quite a few handy methods. A scale can either be
 constructed from the predefined scales, which by default contains the 7 modes
 (Ionian, Dorian, Phrygian etc.) a major and minor pentatonic and the harmonic
 chromatic scale or from an arbitrary array of intervals. The scale object
 also supports solfège, which makes it perfect for tutorials on sight-reading.

 - An interval object (`teoria.Interval`), which makes it easy to find the
 interval between two pitches, or find a pitch that is a given interval from a pitch.
 There's also support for counting the interval span in semitones and inverting the
 interval.

Usage
--------

    $ npm install teoria

Can be used with both Node and Browserify/webpack/etc.

### ... or less preferable

Include the bundled build file, `teoria.js` from this repository, directly:
```html
<script src="path/to/teoria.js"></script>
```
Syntax
---------

This is just a short introduction to what teoria-code looks like,
for a technical library reference, look further down this document.

```javascript

// Create pitches:
var a4 = teoria.pitch('a4');       // Scientific notation
var g5 = teoria.pitch("g''");      // Helmholtz notation
var c3 = teoria.pitch.fromKey(28); // From a piano key number

// Find and create pitches based on intervals
teoria.interval(a4, g5);    // Returns a Interval object representing a minor seventh
teoria.interval(a4, 'M6');  // Returns a Pitch representing F#5
a4.interval('m3');          // Returns a Pitch representing C#4
a4.interval(g5);            // Returns a Interval object representing a minor seventh
a4.interval(teoria.pitch('bb5')).invert(); // Returns a Interval representing a major seventh

// Create scales, based on pitches.
a4.scale('mixolydian').simple();  // Returns: ["a", "b", "c#", "d", "e", "f#", "g"]
a4.scale('aeolian').simple();     // Returns: ["a", "b", "c", "d", "e", "f", "g"]
g5.scale('ionian').simple();      // Returns: ["g", "a", "b", "c", "d", "e", "f#"]
g5.scale('dorian');               // Returns a Scale object

// Create chords with the powerful chord parser
a4.chord('sus2').name;    // Returns the name of the chord: 'Asus2'
c3.chord('m').name;       // Returns 'Cm'
teoria.chord('Ab#5b9');   // Returns a Chord object, representing a Ab#5b9 chord
g5.chord('dim');          // Returns a Chord object, representing a Gdim chord

// Calculate pitch frequencies or find the pitch corresponding to a frequency
teoria.pitch.fromFrequency(467); // Returns: {'pitch':{...},'cents':3.102831} -> A4# a little out of tune.
a4.fq(); // Outputs 440
g5.fq(); // Outputs 783.9908719634985

// teoria allows for crazy chaining:
teoria.pitch('a')    // Create a pitch, A3
  .scale('lydian')  // Create a lydian scale with that pitch as root (A lydian)
  .interval('M2')   // Transpose the whole scale a major second up (B lydian)
  .get('third')     // Get the third pitch of the scale (D#4)
  .chord('maj9')    // Create a maj9 chord with that pitch as root (D#maj9)
  .toString();      // Make a string representation: 'D#maj9'
```

Documentation
------------------------

## teoria.pitch (name | coord)

*name* - The name argument is the pitch name as a string. The pitch can both
be expressed in scientific and Helmholtz notation.
Some examples of valid pitch names: `Eb4`, `C#,,`, `C4`, `d#''`, `Ab2`

*coord* - If the first argument isn't a string, but a coord array,
it will instantiate a `Pitch` instance.

### teoria.pitch.fromKey(key)
A static method that returns an instance of Pitch set to the pitch
at the given piano key, where A0 is key number 1.
See [Wikipedia's piano key article](http://en.wikipedia.org/wiki/Piano_key_frequencies)
for more information.

### teoria.pitch.fromFrequency(fq)
A static method returns an object containing two elements:

*pitch* - A `Pitch` which corresponds to the closest pitch with the given frequency

*cents* - A number value of how many cents the pitch is out of tune

### teoria.pitch.fromMIDI(pitch)
 - Returns an instance of Pitch set to the corresponding MIDI pitch value.

*pitch* - A number ranging from 0-127 representing a MIDI pitch value

### teoria.pitch.fromString(pitch)
 - Returns an instance of Pitch representing the pitch name

*pitch* - The name argument is the pitch name as a string. The pitch can both
be expressed in scientific and Helmholtz notation.
Some examples of valid pitch names: `Eb4`, `C#,,`, `C4`, `d#''`, `Ab2`

#### Pitch.name()
 - The name of the pitch, in lowercase letter (*only* the name, not the
 accidental signs)

#### Pitch.octave()
 - The numeric value of the octave of the pitch

#### Pitch.accidental()
 - Returns the string symbolic of the accidental sign (`x`, `#`, `b` or `bb`)

#### Pitch.accidentalValue()
 - Returns the numeric value (mostly used internally) of the sign:
`x = 2, # = 1, b = -1, bb = -2`

#### Pitch#key([whitekeys])
 - Returns the piano key number. E.g. A4 would return 49

*whitekeys* - If this parameter is set to `true` only the white keys will
be counted when finding the key number. This is mostly for internal use.

#### Pitch#midi()
 - Returns a number ranging from 0-127 representing a MIDI pitch value

#### Pitch#fq([concertPitch])
 - Calculates and returns the frequency of the pitch.

*concertPitch* - If supplied this number will be used instead of the normal
concert pitch which is 440hz. This is useful for some classical music.

#### Pitch#chroma()
 - Returns the pitch class (index) of the pitch.

This allows for easy enharmonic checking:

    teoria.pitch('e').chroma() === teoria.pitch('fb').chroma();

The chroma number is ranging from pitch class C which is 0 to 11 which is B

#### Pitch#scale(scaleName)
 - Returns an instance of Scale, with the tonic/root set to this pitch.

*scaleName* - The name of the scale to be returned. `'minor'`,
`'chromatic'`, `'ionian'` and others are valid scale names.

#### Pitch#interval(interval)
 - A sugar function for calling teoria.interval(pitch, interval);

Look at the documentation for `teoria.interval`

#### Pitch#transpose(interval)
 - Like the `#interval` method, but changes `this` pitch, instead of returning a new

#### Pitch#chord([name])
 - Returns an instance of Chord, with root pitch set to this pitch

*name* - The name attribute is the last part of the chord symbol.
Examples: `'m7'`, `'#5b9'`, `'major'`. If the name parameter
isn't set, a standard major chord will be returned.

#### Pitch#helmholtz()
 - Returns the pitch name formatted in Helmholtz notation.

Example: `teoria.pitch('A5').helmholtz() -> "a''"`

#### Pitch#scientific()
 - Returns the pitch name formatted in scientific notation.

Example: `teoria.pitch("ab'").scientific() -> "Ab4"`

#### Pitch#enharmonics(oneAccidental)
 - Returns all pitches that are enharmonic with the pitch

*oneAccidental* - Boolean, if set to true, only enharmonic pitches with one
accidental is returned. E.g. results such as 'eb' and 'c#' but not 'ebb' and 'cx'

```javascript
teoria.pitch('c').enharmonics().toString();
// -> 'dbb, b#'

teoria.pitch('c').enharmonics(true).toString();
// -> 'b#'
```

#### Pitch#solfege(scale, showOctaves)
 - Returns the solfege step in the given scale context

*scale* - An instance of `Scale`, which is the context of the solfege step measuring

*showOctaves* - A boolean. If set to true, a "Helmholtz-like" notation will be
used if there's bigger intervals than an octave

#### Pitch#scaleDegree(scale)
 - Returns this pitch's degree in a given scale (Scale). For example a
 `D` in a C major scale will return `2` as it is the second degree of that scale.
 If however the pitch *isn't* a part of the scale, the degree returned will be
 `0`, meaning that the degree doesn't exist. This allows this method to be both
 a scale degree index finder *and* an "isPitchInScale" method.

*scale* - An instance of `Scale` which is the context of the degree measuring

#### Pitch#toString([dontShow])
 - Usability function for returning the pitch as a string

*dontShow* - If set to `true` the octave will not be included in the returned string.

## Chord(root, chord)
 - A chord class with a lot of functionality to alter and analyze the chord.

*root* - A `Pitch` instance which is to be the root of the chord

*chord* - A string containing the chord symbol. This can be anything from
simple chords, to super-advanced jazz chords thanks to the detailed and
robust chord parser engine. Example values:
`'m'`, `'m7'`, `'#5b9'`, `'9sus4` and `'#11b5#9'`

### teoria.chord(name || pitch[, octave || symbol])
 - A simple function for getting the pitches, no matter the octave, in a chord

*name* - A string containing the full chord symbol, with pitch name. Examples:
`'Ab7'`, `'F#(#11b5)'`

*pitch* - Instead of supplying a string containing the full chord symbol,
one can pass a `Pitch` object instead. The pitch will be considered root in
the new chord object

*octave* - If the first argument of the function is a chord name (`typeof "string"`),
then the second argument is an optional octave number (`typeof "number"`) of the root.

*symbol* - A string containing the chord symbol (excluding the pitch name)

#### Chord.name
 - Holds the full chord symbol, inclusive the root name.

#### Chord.root
 - Holds the `Pitch` that is the root of the chord.

#### Chord#pitches()
 - Returns an array of `Pitch`s that the chord consists of.

#### Chord#simple()
 - Returns an `Array` of only the pitches' names, not the full `Pitch` objects.

#### Chord#bass()
 - Returns the bass pitch of the chord (The pitch voiced the lowest)

#### Chord#voicing([voicing])
 - Works both as a setter and getter. If no parameter is supplied the
 current voicing is returned as an array of `Interval`s

*voicing* - An optional array of intervals in simple-format
that represents the current voicing of the chord.

Here's an example:
```javascript
var bbmaj = teoria.chord('Bbmaj7');
// Default voicing:
bbmaj.voicing();  // #-> ['P1', 'M3', 'P5', 'M7'];
bbmaj.pitches();    // #-> ['bb', 'd', 'f', 'a'];

// New voicing
bbmaj.voicing(['P1', 'P5', 'M7', 'M10']);
bbmaj.pitches();    // #-> ['bb', 'f', 'a', 'd'];
```
*NB:* Note that above returned results are pseudo-results, as they will be
returned wrapped in `Interval` and `Pitch` objects.

#### Chord#quality()
 - Returns a string which holds the quality of the chord, `'major'`, `'minor'`,
 `'augmented'`, `'diminished'`, `'half-diminished'`, `'dominant'` or `undefined`

#### Chord#get(interval)
 - Returns the pitch at a given interval in the chord, if it exists.

*interval* - A string name of an interval, for example `'third'`, `'fifth'`, `'ninth'`.

#### Chord#dominant([additional])
 - Returns the naïvely chosen dominant which is a perfect fifth away.

*additional* - Additional chord extension, for example: `'b9'` or `'#5'`

#### Chord#subdominant([additional])
 - Returns the naïvely chosen subdominant which is a perfect fourth away.

*additional* - Like the dominant's.

#### Chord#parallel([additional])
 - Returns the parallel chord for major and minor triads

*additional* - Like the dominant's

#### Chord#chordType()
 - Returns the type of the chord: `'dyad'`, `'triad'`, `'trichord'`,
 `'tetrad'` or `'unknown'`.

#### Chord#interval(interval)
 - Returns the same chord, a `interval` away

#### Chord#transpose(interval)
 - Like the `#interval` method, except it's `this` chord that gets changed instead of
 returning a new chord.

#### Chord#toString()
 - Simple usability function which is an alias for Chord.name


## Scale(tonic, scale)
 - The teoria representation of a scale, with a given tonic.

*tonic* - A `Pitch` which is to be the tonic of the scale

*scale* - Can either be a name of a scale (string), or an array of
absolute intervals that defines the scale. The scales supported by default are:

 - major
 - minor
 - ionian (Alias for major)
 - dorian
 - phrygian
 - lydian
 - mixolydian
 - aeolian (Alias for minor)
 - locrian
 - majorpentatonic
 - minorpentatonic
 - chromatic
 - harmonicchromatic (Alias for chromatic)
 - blues
 - doubleharmonic
 - flamenco
 - harmonicminor
 - melodicminor

### teoria.scale(tonic, scale)
 - Sugar function for constructing a new `Scale` object

#### Scale.pitches()
 - Returns an array of `Pitch`s which is the scale's pitches

#### Scale.name
 - The name of the scale (if available). Type `string` or `undefined`

#### Scale.tonic
 - The `Pitch` which is the scale's tonic

#### Scale#simple()
 - Returns an `Array` of only the pitches' names, not the full `Pitch` objects.

#### Scale#type()
 - Returns the type of the scale, depending on the number of pitches.
 A scale of length x gives y:
  - 2 gives 'ditonic'
  - 3 gives 'tritonic'
  - 4 gives 'tetratonic'
  - 5 gives 'pentatonic'
  - 6 gives 'hexatonic',
  - 7 gives 'heptatonic',
  - 8 gives 'octatonic'

#### Scale#get(index)
 - Returns the pitch at the given scale index

*index* - Can be a number referring to the scale step, or the name (string) of the
scale step. E.g. 'first', 'second', 'fourth', 'seventh'.

#### Scale#solfege(index, showOctaves)
 - Returns the solfege name of the given scale step

*index* Same as `Scale#get`

*showOctaves* - A boolean meaning the same as `showOctaves` in `Pitch#solfege`


## teoria.interval(from, to)
 - A sugar function for the `#from` and `#between` methods of the same namespace and
 for creating `Interval` objects.

#### teoria.interval(`string`: from)
 - A sugar method for the `Interval.fromString` function

#### teoria.interval(`Pitch`: from, `string`: to)
 - A sugar method for the `Interval.from` function

#### teoria.interval(`Pitch`: from, `Interval`: to)
 - Like above, but with a `Interval` instead of a string representation of
 the interval

#### teoria.interval(`Pitch`: from, `Pitch`: to)
 - A sugar method for the `Interval.between` function

##### teoria.interval.from -> Interval.from
##### teoria.interval.between -> Interval.between
##### teoria.interval.invert -> Interval.invert
##### teoria.Interval.fromString -> Interval.fromString


## Interval(coord)
 - A representation of a music interval

### Interval.fromString(simpleInterval)
 - Returns a `Interval` representing the interval expressed in string form.

### Interval.from(from, to)
 - Returns a pitch which is a given interval away from a root pitch.

*from* - The `Pitch` which is the root of the measuring

*to* - A `Interval`

### Interval.between(from, to)
 - Returns an interval object which represents the interval between two pitches.

*from* and *to* are two `Pitch`s which are the pitches that the
interval is measured from. For example if 'a' and 'c' are given, the resulting
interval object would represent a minor third.

```javascript
Interval.between(teoria.pitch("a"), teoria.pitch("c'")) -> teoria.interval('m3')
```

### Interval.invert(simpleInterval)
 - Returns the inversion of the interval provided

*simpleInterval* - An interval represented in simple string form. Examples:

 - 'm3' = minor third
 - 'P4' = perfect fourth
 - 'A4' = augmented fifth
 - 'd7' = diminished seventh
 - 'M6' = major sixth.

`'m' = minor`, `'M' = major`, `'A' = augmented` and
`'d' = diminished`

The number may be prefixed with a `-` to signify that its direction is down. E.g.:

`m-3` means a descending minor third, and `P-5` means a descending perfect fifth.

#### Interval.coord
 - The interval representation of the interval

#### Interval.number()
 - The interval number (A ninth = 9, A seventh = 7, fifteenth = 15)

#### Interval.value()
 - The value of the interval - That is a ninth = 9, but a downwards ninth is = -9

#### Interval.toString()
 - Returns the *simpleInterval* representation of the interval. E.g. `'P5'`,
 `'M3'`, `'A9'`, etc.

#### Interval.base()
 - Returns the name of the simple interval (not compound)

#### Interval.type()
 - Returns the type of array, either `'perfect'` (1, 4, 5, 8) or `'minor'` (2, 3, 6, 7)

#### Interval.quality([verbose])
 - The quality of the interval (`'dd'`, `'d'` `'m'`, `'P'`, `'M'`, `'A'` or `'AA'`)

*verbose*  is set to a truish value, then long quality names are returned:
 `'doubly diminished'`, `'diminished'`, `'minor'`, etc.

#### Interval.direction([dir])
 - The direction of the interval

*dir* - If supplied, then the interval's direction is to the `newDirection`
which is either `'up'` or `'down'`

#### Interval#semitones()
 - Returns the `number` of semitones the interval span.

#### Interval#simple([ignoreDirection])
 - Returns the simple part of the interval as a Interval. Example:

*ignoreDirection* - An optional boolean that, if set to `true`, returns the
"direction-agnostic" interval. That is the interval with a positive number.

```javascript
teoria.interval('M17').simple();    // #-> 'M3'
teoria.interval('m23').simple();    // #-> 'm2'
teoria.interval('P5').simple();     // #-> 'P5'
teoria.interval('P-4').simple();    // #-> 'P-4'

// With ignoreDirection = true
teoria.interval('M3').simple(true);     // #->'M3'
teoria.interval('m-10').simple(true);   // #-> 'm3'
```

*NB:* Note that above returned results are pseudo-results, as they will be
returned wrapped in `Interval` objects.

#### Interval#octaves()
 - Returns the number of compound intervals

#### Interval#isCompound()
 - Returns a boolean value, showing if the interval is a compound interval

#### Interval#add(interval)
 - Adds the `interval` to this interval, and returns a `Interval`
 representing the result of the addition

#### Interval#equal(interval)
 - Returns true if the supplied `interval` is equal to this interval

#### Interval#greater(interval)
 - Returns true if the supplied `interval` is greater than this interval

#### Interval#smaller(interval)
 - Returns true if the supplied `interval` is smaller than this interval

#### Interval#invert()
 - Returns the inverted interval as a `Interval`

#### Interval#qualityValue() - *internal*
 - Returns the relative to default, value of the quality.
 E.g. a teoria.interval('M6'), will have a relative quality value of 1, as all the
 intervals defaults to minor and perfect respectively.

