const { Scale, Chord, Interval, Note } = require("@tonaljs/tonal");
const DATA = require('./data.js')
const {WebMidi} = require("webmidi");
const _ = require('lodash');


// INIT

let count = 0
let modulationChance = 0
let invertChanceCheck = 3
let root = 'C3'
let time = 800

// MIDI init

WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => console.log(err));

// Function triggered when WebMidi.js is ready
function onEnabled() {
    main(time)
}


function main(wait) {

    let notes = [];
    //current data point
    let current = DATA[count];

    //select the 10-note scale
    let scale = Scale.get(`${root} messiaen's mode #7`);

    // get the new interval
    let interval = scale.intervals[current.NUMBER - 1];

    //give chance to invert the interval
    let invertChance = _.random(invertChanceCheck)
    if (invertChance = invertChanceCheck) {
        interval = Interval.invert(interval)
    }

    // transpose the interval with the root
    let transposedNote = Note.transpose(root, interval);

    //simplify note to prevent crash when MIDI can't be read anymore
    let note = Note.simplify(transposedNote);
    


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

        //reset modulationChance
        modulationChance = 0;
    }

    _play(notes)


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


function _play(notes) {
    const MIDI_OUT = WebMidi.getOutputByName("loopMIDI");
    let channel = MIDI_OUT.channels[1];
    console.log(notes);
    channel.playNote(notes, {duration: time - 50});
}

function chooseChord(options, note) {
    let chordType = _.sample(options);
    let chordNotes = Chord.getChord(chordType, note).notes;
    //console.log('chordtype', chordNotes);
    return chordNotes;
}



