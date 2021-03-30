var metadataTrack;
var player = videojs('player',{
  playbackRates:[0.5,1,1.5,2], controls: true
});

// player.next(player);



/////////////PDF

const url = 'qwa.pdf';

let pdfDoc = null,
pageNum = 1,
pageIsRendering = false,
pageNumIsPending = null;

const scale = 2,
canvas = document.querySelector('#pdf-render'),
ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
pageIsRendering = true;

// Get page
pdfDoc.getPage(num).then(page => {
// Set scale
const viewport = page.getViewport({ scale });
canvas.height = viewport.height;
canvas.width = viewport.width;

const renderCtx = {
  canvasContext: ctx,
  viewport
};

page.render(renderCtx).promise.then(() => {
  pageIsRendering = false;

  if (pageNumIsPending !== null) {
    renderPage(pageNumIsPending);
    pageNumIsPending = null;
  }
});

// // Output current page
// document.querySelector('#page-num').textContent = num;
});
};

// Check for pages rendering
const queueRenderPage = num => {
if (pageIsRendering) {
pageNumIsPending = num;
} else {
renderPage(num);
}
};

// Show Prev Page
const showPrevPage = () => {
if (pageNum <= 1) {
return;
}
pageNum--;
player.currentTime(metadataTrack.cues_[pageNum-1].startTime);
queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
if (pageNum >= pdfDoc.numPages) {
return;
}
pageNum++;

player.currentTime(metadataTrack.cues_[pageNum-1].startTime);

queueRenderPage(pageNum);
};

// Get Document
pdfjsLib
.getDocument(url)
.promise.then(pdfDoc_ => {
pdfDoc = pdfDoc_;

document.querySelector('#page-count').textContent = pdfDoc.numPages;

renderPage(pageNum);
})
.catch(err => {
// Display error
const div = document.createElement('div');
div.className = 'error';
div.appendChild(document.createTextNode(err.message));
// document.querySelector('body').insertBefore(div, canvas);
// // Remove top bar
// document.querySelector('.top-bar').style.display = 'none';
});

// // Button Events
// document.querySelector('#prev-page').addEventListener('click', showPrevPage);
// document.querySelector('#next-page').addEventListener('click', showNextPage);





var nextButton = createButton('&#9205');
var prevButton = createButton('&#9204');


nextButton.onclick = showNextPage;
prevButton.onclick= showPrevPage;

function createButton(icon){
    var button = document.createElement('button');
    button.classList.add('vjs-menu-button');
    button.innerHTML=icon;
    button.style.fontSize = '1.8em';
    return button;
}
var playbutton = document.querySelector('.vjs-playback-rate');
insertAfter(prevButton,playbutton);
insertAfter(nextButton,prevButton);





function insertAfter (newEl,element){
    element.parentNode.insertBefore(newEl,element.nextSibling);
}






function init() {

    var tracks = player.textTracks();
    
    console.log(tracks);
    console.log(tracks.length);
    
    // var metadataTrack;

    for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];

    // Find the metadata track that's labeled "ads".
    if (track.kind === 'metadata' && track.label === 'folienwechsel') {
        track.mode = 'hidden';

        // Store it for usage outside of the loop.
        metadataTrack = track;
    }
    }
    
    // Add a listener for the "cuechange" event and start ad playback.
    metadataTrack.addEventListener('cuechange', function() {
    console.log("wechsel");
    if (metadataTrack.activeCues_.length>0){
      // var text=metadataTrack.activeCues_[0].text;
      // // var foliennummer =JSON.parse(text).folie;
      var id=parseInt(metadataTrack.activeCues_[0].id);
      
      queueRenderPage(id);
    }
    
    
    });

    }

    window.addEventListener('load',init)



