const { Scale, Chord } = require("@tonaljs/tonal");
const modulationChance = require('modulationChance').modulationChance();
const DATA = require('./data.js')
const {WebMidi} = require("webmidi");
const _ = require('lodash');


// INIT

let count = 0
let modulationChance = 0
let root = 'C3'


// MIDI init

WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => console.log(err));

// Function triggered when WebMidi.js is ready
function onEnabled() {

    const MIDI_OUT = WebMidi.getOutputByName("loopMIDI");
    let channel = MIDI_OUT.channels[1];

    //channel.playNote("C3");
}


function main(wait) {


    let notes = [];
    //current data point
    let current = DATA[count]

    //select the 10-note scale
    let scale = Scale.get(`${root} messiaen's mode #7`)

    //get the new note
    let note = scale.notes[current.NUMBER - 1]

    //calculate chance for modulation
    modulationChance += current.NUMBER / 100
    let random = Math.random();

    // weight the modulationChance of modulation
    if (random < modulationChance) {
        // new root is the note that was going to be played
        root = note

        //get root chord
        let chords = Scale.scaleChords(`${root} messiaen's mode #7`);
        let chordTones = chooseChord(chords, note);
        notes.push(chordTones)

        //reset modulationChance
        modulationChance = 0
    }

    



    setTimeout(() => {
        
    }, wait);
    count++

    if (count = 449) {
        console.log('Done');
    } else main(wait)
}


function _play(note) {
    
}

function chooseChord(options, note) {
    let chordType = _.sample(options)
    let chordNotes = Chord.getChord(chordType, note).notes

    return chordNotes
}



