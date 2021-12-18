const { Note, Scale, ScaleType } = require("@tonaljs/tonal");


//console.log(ScaleType.all().filter(scaleType => scaleType.intervals.length === 10)); 
const SCALE = Scale.get("f2 messiaen's mode #7")

console.log(SCALE.notes);

