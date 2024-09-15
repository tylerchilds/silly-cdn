import elf from '../external-js/module.js'
import '../external-js/Tone.js'
import '../Tonejs-Instruments.js'

// load samples / choose 4 random instruments from the list //
let chooseFour = ['piano', 'bass-electric', 'bassoon', 'cello', 'clarinet', 'contrabass', 'flute', 'french-horn', 'guitar-acoustic', 'guitar-electric','guitar-nylon', 'harmonium', 'harp', 'organ', 'saxophone', 'trombone', 'trumpet', 'tuba', 'violin', 'xylophone']
shuffle(chooseFour);
chooseFour = chooseFour.slice(0, 4);

var samples = SampleLibrary.load({
  instruments: chooseFour,
  baseUrl: "samples/"
})

var current
// show keyboard on load //
Tone.Buffer.on('load', function() {
  document.querySelector(".container").style.display = 'block';
  document.querySelector("#loading").style.display = 'none';
  NProgress.done();

  // loop through instruments and set release, connect to master output
  for (var property in samples) {
    if (samples.hasOwnProperty(property)) {
      console.log(samples[property])
      samples[property].release = .5;
      samples[property].toMaster();
    }
  }

  current = samples[chooseFour[0]];

  $.teach({ samples })
})

// show error message on loading error //
$.when('change', '.samples', function(event) {
  current = samples[event.target.value];
})

Tone.Buffer.on('error', function() {
  $.teach({ error: "I'm sorry, there has been an error loading the samples." })
})

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

const $ = elf('dial-tone', { root: 60, samples: {} })

$.draw(() => {
  const { root, samples } = $.learn()
  const instrument = Object.keys(samples).map((item) => {
    debugger
  })
  return `
      <div class="the-compass">
        <button class="note root" data-note="${root}">
          ${root} C
        </button>
        <button class="note plus-5" data-note="${root + 5}">
          ${root + 5} F
        </button>
        <button class="note plus-7" data-note="${root + 7}">
          ${root + 7} G
        </button>
        <button class="note plus-2" data-note="${root + 2}">
          ${root + 2} D
        </button>
        <button class="note plus-9" data-note="${root + 9}">
          ${root + 9} A
        </button>
        <button class="note plus-4" data-note="${root + 4}">
          ${root + 4} E
        </button>
        <button class="note plus-11" data-note="${root + 11}">
          ${root + 11} B
        </button>
      </div>
  `
})

$.style(`
  & {
    display: block;
    height: 100%;
    background: black;
  }
  & .the-compass {
    display: grid;
    grid-template-columns: repeat(6, calc(100% / 6));
    grid-template-rows: repeat(6, calc(100% / 6));
    pointer-events: all;
    aspect-ratio: 1;
    margin: auto;
    max-height: 100%;
    top: 50%;
    position: relative;
    transform: translateY(-50%);
  }


  & .the-compass button {
    position: relative;
    overflow: hidden;
    touch-action: manipulation;
    border: none;
    border-radius: 100%;
    color: white;
    background-image: radial-gradient(rgba(0,0,0,.85), rgba(0,0,0,.25));
  }
  & .the-compass button:hover {
    background-image: radial-gradient(rgba(255,255,255,.35), rgba(0,0,0,.15));
  }


  & .the-compass img {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
  & .the-compass button{
    padding: 0;
  }

  & .the-compass .plus-2 {
    grid-row: 3 / 5;
    grid-column: 5 / 7;
    background-color: mediumseagreen;
  }

  & .the-compass .plus-11 {
    grid-row: 3 / 5;
    grid-column: 1 / 3;
    background-color: yellow;
  }

  & .the-compass .plus-5 {
    grid-row: 1 / 3;
    grid-column: 2 / 4;
    background-color: red;
    transform: translateY(13%);
  }

  & .the-compass .plus-7 {
    grid-row: 1 / 3;
    grid-column: 4 / 6;
    background-color: orange;
    transform: translateY(13%);
  }

  & .the-compass .plus-4 {
    grid-row: 5 / 7;
    grid-column: 2 / 4;
    background-color: dodgerblue;
    transform: translateY(-13%);
  }

  & .the-compass .plus-9 {
    grid-row: 5 / 7;
    grid-column: 4 / 6;
    background-color: mediumpurple;
    transform: translateY(-13%);
  }


  & .the-compass .root {
    grid-row: 3 / 5;
    grid-column: 3 / 5;
    background-color: white;
  }
`)

$.when('touchstart', '.note', attack)
$.when('touchend', '.note', release)

$.when('mousedown', '.note', attack)
$.when('mouseup', '.note', release)

function attack(event) {
  const note = event.target.dataset.note
  current.triggerAttack(Tone.Frequency(note, "midi").toNote());
}

function release(event) {
  const note = event.target.dataset.note
  current.triggerRelease(Tone.Frequency(note, "midi").toNote());
}
