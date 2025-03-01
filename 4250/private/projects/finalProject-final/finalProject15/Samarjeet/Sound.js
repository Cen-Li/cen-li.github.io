// Create a couple of global variables to use. 
var audioElm = document.getElementById("audio1"); // Audio element
var ratedisplay = document.getElementById("rate"); // Rate display area

// Hook the ratechange event and display the current playbackRate after each change
audioElm.addEventListener("ratechange", function () 
{
    ratedisplay.innerHTML = "Rate: " + audioElm.playbackRate;
}, false);


//  Alternates between play and pause based on the value of the paused property
function togglePlay() 
{
    if (document.getElementById("audio1")) 
	{
		if (audioElm.paused == true) 
			{
				playAudio(audioElm);    //  if player is paused, then play the file
			} 
		else 
			{
				pauseAudio(audioElm);   //  if player is playing, then pause
			}
    }
}


function playAudio(audioElm) 
{
    document.getElementById("playbutton").innerHTML = "Pause"; // Set button text == Pause
         
	// Get file from text box and assign it to the source of the audio element 
    audioElm.src = document.getElementById('audioFile').value;
    audioElm.play();
}

function pauseAudio(audioElm) 
{

	document.getElementById("playbutton").innerHTML = "play"; // Set button text == Play
	audioElm.pause();
}

// Increment playbackRate by 1 
function increaseSpeed() 
{
    audioElm.playbackRate += 1;
}

// Cut playback rate in half
function decreaseSpeed() 
{
    if (audioElm.playbackRate <= 1) 
	{
        var temp = audioElm.playbackRate;
        audioElm.playbackRate = (temp / 2); 
    } 
	else 
	{
        audioElm.playbackRate -= 1;
    }
}
	   