const { Scale, Chord, Interval, Note } = require("@tonaljs/tonal");
const DATA = require('./data.js');
const {WebMidi} = require("webmidi");
const _ = require('lodash');


// INIT

let count = 0;
let modulationChance = 0;
let invertChanceCheck = 3;
let root = 'C3';
let time = 200;
let invertFailsafeNotActiveCounter = 0;
let invertFailsafeActiveCounter = 0;
let invertFailsafe = {
    check: 16,
    active: false,
    counter: 5
};

// MIDI init

WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => console.log(err));

// Function triggered when WebMidi.js is ready
function onEnabled() {
    main(time);
}


function main(wait) {

    wait = time;
    let notes = [];
    //current data point
    let current = DATA[count];

    //select the 10-note scale
    let scale = Scale.get(`${root} messiaen's mode #7`);

    // get the new interval
    let interval = scale.intervals[current.NUMBER - 1];
    let invertChance = _.random(invertChanceCheck);

    //check to invert interval
    if (invertFailsafe.active == true) {
        console.log('Failsafe active');
        interval = '-' + interval;
        console.log(interval);
        invertFailsafeActiveCounter++;
        console.log('failsafe counter', invertFailsafeActiveCounter);
        if (invertFailsafeActiveCounter == invertFailsafe.counter) {
            console.log('turned off failsafe');
            invertFailsafe.active = false;
            invertFailsafeActiveCounter = 0;
        }
    } else if (invertChance == invertChanceCheck) {
        console.log('inverting interval regularly');
        interval = Interval.invert(interval);
        //invertFailsafeNotActiveCounter = 0;
    } else {
        invertFailsafeNotActiveCounter++
        if (invertFailsafeNotActiveCounter == invertFailsafe.check) {
            console.log('activating failsafe');
            invertFailsafe.active = true;
            console.log(invertFailsafe.active);
        }
    }

    // transpose the interval with the root
    let transposedNote = Note.transpose(root, interval);

    //simplify note to prevent crash when MIDI can't be read anymore
    let note = Note.simplify(transposedNote);
    //let simpleNote = Note.simplify(transposedNote);
    notes.push(note);

    //calculate chance for modulation
    modulationChance += current.NUMBER / 100;
    let random = Math.random();

    // weight the modulationChance of modulation
    if (random < modulationChance) {
        // new root is the note that was going to be played
        root = note;

        //get root chord
        let chords = Scale.scaleChords(`${root} messiaen's mode #7`);
        let chordTones = chooseChord(chords, note);
        notes.push(...chordTones);

        //add bass note
        const octaves = notes.flatMap(str => str.match(/\d+/));
        let bassNote = notes[0].replace(/[0-9]/g, parseInt(octaves[0]) - Math.floor(octaves[0] / 2));
        //console.log(bassNote);
        notes.push(bassNote)


        //reset modulationChance
        modulationChance = 0;

        //hold chord for longer
        wait += 600
    }

    //lower notes if too high
    const octaves = notes.flatMap(str => str.match(/\d+/))

    if (octaves[0] >= 7) {
        // replace the string
        console.log('lowering octave');
        let newRoot = notes[0].replace(/[0-9]/g, parseInt(octaves[0]) - 4);
        root = newRoot;
    }


    _play(notes, wait)


    count++
    if (count == 449) {
        console.log('Done');
    } else {
        setTimeout(() => {
            main(wait)
        }, wait);
        count++
    }
}


function _play(notes, duration) {
    const MIDI_OUT = WebMidi.getOutputByName("loopMIDI");
    let channel = MIDI_OUT.channels[1];
    console.log(notes);
    channel.playNote(notes, {duration: duration - 50});
}

function chooseChord(options, note) {
    let chordType = _.sample(options);
    let chordNotes = Chord.getChord(chordType, note).notes;
    //console.log('chordtype', chordNotes);
    return chordNotes;
}



