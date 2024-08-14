////////////////////////////////////////////////////////////////////////////////
// windows.js --- Answer Sheet and Resource Window Script File
//
// ***edited Aug. 2001 to be used with the 117 manual***
//
// Author: Brad Rudnik - bar2a@mtsu.edu - May 1999 
//         Written for the Online Version of the MTSU CSCI 217
//         Computer Science II LABORATORY MANUAL 1998-1999 Edition
//                             BY: Thomas Cheatham
//                                 Judith Hankins
//                                 Brenda Parker
//                                 Nancy Wahl 
// 
// Purpose: A JavaScript source file containing the functions used to open 
//          additional (smaller) browser windows to display an Answer Sheet 
//          and various resource materials to the student.
//
// Requirements: This file must be loaded by the HTML document and calls to 
//               these functions must be contained in that document. This file
//               uses two Perl CGI files: 
//                    AnswerSheet.pl - to produce the Answer Sheet 
//                    viewcode.pl  - to produce C++ source code files in html
//               The location of these files must be included in this file.
//               For more information on any of these requirements please see 
//               the SiteDesign file in the 217man directory.
//////

// AnswerSheet.pl directory 
//master = "http://www.mtsu.edu/cgi-bin/users/csdept/217man/AnswerSheet.pl/";
//master = "/cgi-bin/users/csci117/AnswerSheet.pl/";
master = "http://www.cs.mtsu.edu/~cs2170/manual/AnswerSheet.pl/";

// viewcode.pl directory
//code = "http://www.mtsu.edu/cgi-bin/users/csdept/217man/viewcode.pl";
//code = "/cgi-bin/users/csci117/viewcode.pl";
code = "http://www.cs.mtsu.edu/~cs2170/manual/viewcode.pl";
ncode = "http://www.cs.mtsu.edu/~cs2170/manual/viewcodenln.pl";


// window status flags
//Answer_Window = null;
//DisplayWindow = null; 


// open a browser window containing the lab answer sheet 
// IN: the lab calling for an answer sheet ex. AnswerWindow('lab1/lab1')
function AnswerWindow(lab) {

     // check to see if window is open --- bring it to the front if it is open 
     if ( window.Answer_Window && !window.Answer_Window.closed ) {

          window.Answer_Window.focus(); 
     }
     else {
     // if window has not been opened or has been close --- open it

     // add lab number passed to the function to master url
     masterURL = master + lab ;  
    
     // open the window
     Answer_Window = window.open(masterURL,"Answer_Window",
                     "width=550,height=600,scrollbars=1,resizable=1,menubar=1"); }

}// END AnswerWindow()

// open a browser window containing lab resource material
// IN: the page to open ex. Display('$CLA/inlab1.cc') or 
//  Display('http://www.mtsu.edu')
function Display(url){

     // check to see if window is open --- bring it to the front if it is open 
     if ( window.Display_Window && !window.Display_Window.closed ) {

          window.Display_Window.focus(); 
     }

     // check for the CLA directory - if found at the first position
     // assume it is a source code file,  remove $CLA/ and call viewcode.pl
     if ( url.indexOf( "$CLA/" ) == 0 ) {

        arrayOfUrl = url.split ( "/" );
        url = code + "?" + arrayOfUrl[1];
 
     }

     // open the new window or change the contents of an open window
     Display_Window = window.open(url,"Display_Window",
                      "width=600,height=600,scrollbars=1,resizable=1,menubar=1");

}// END Display()

// open a browser window containing lab resource material withOUT line numbers
// IN: the page to open ex. Displaynln('$CLA/inlab1.cc') or 
//  Displaynln('http://www.mtsu.edu')
function Displaynln(url){

     // check to see if window is open --- bring it to the front if it is open 
     if ( window.Display_Window && !window.Display_Window.closed ) {

          window.Display_Window.focus(); 
     }

     // check for the CLA directory - if found at the first position
     // assume it is a source code file,  remove $CLA/ and call viewcode.pl
     if ( url.indexOf( "$CLA/" ) == 0 ) {

        arrayOfUrl = url.split ( "/" );
        url = ncode + "?" + arrayOfUrl[1];
 
     }

     // open the new window or change the contents of an open window
     Display_Window = window.open(url,"Display_Window",
                      "width=600,height=600,scrollbars=1,resizable=1,menubar=1");

}// END Displaynln()


// bring the AnswerWindow to the top and move to the desired question
// IN: the question ex. Answer('Exercise1')
function Answer(question) {

     // check to see if window is open 
     // bring it to the front & move to question if it is open
     if (window.Answer_Window) {

          if (!window.Answer_Window.closed) { 

             window.Answer_Window.focus(); 
             window.Answer_Window.location.hash = question ;}
 
     } else { 

     // if window has not been opened or has been close --- alert user
     alert('You must open the Answer Window before Exercise Links will work.');
 
     }

}// END of Answers()

// end of windows.js file
