/*
 *
 * File: fans.js
 * Author: Michael Pollard (msp4k)
 * Class: CSCI 4250
 * Prof: Dr. Cen Li
 * Description: This file contains the container for the translation
 *              factors for all 186 fans in an array
 */




            // tx   ty   tz  stad. cheer jump
            //               side  flag  flag
var Fans = [[-1.7, .55, 5.25, 1, false, false],    //----------------
            [-1.7, .55, 4.75, 1, false, false],    //
            [-1.7, .55, 4.25, 1, false, false],    //
            [-1.7, .55, 3.75, 1, false, false],    //
            [-1.7, .55, 3.25, 1, false, false],    //
            [-1.7, .55, 2.75, 1, false, false],    //
            [-1.7, .55, 2.25, 1, false, false],    //
            [-1.7, .55, 1.75, 1, false, false],    //
            [-1.7, .55, 1.25, 1, false, false],    //
            [-1.7, .55, 0.75, 1, false, false],    // left tier one
            [-1.7, .55, 0.25, 1, false, false],    //
            [-1.7, .55, -0.25, 1, false, false],   //
            [-1.7, .55, -0.75, 1, false, false],   //
            [-1.7, .55, -1.25, 1, false, false],   //
            [-1.7, .55, -1.75, 1, false, false],   //
            [-1.7, .55, -2.25, 1, false, false],   //
            [-1.7, .55, -2.75, 1, false, false],   //
            [-1.7, .55, -3.25, 1, false, false],   //
            [-1.7, .55, -3.75, 1, false, false],   //
            [-1.7, .55, -4.25, 1, false, false],   //---------------- 19
            [-1, .550, -4.70, 2, false, false],    //----------------
            [-.5, .550, -4.7, 2, false, false],    //
            [0.0, .550, -4.7, 2, false, false],    //
            [0.5, .550, -4.7, 2, false, false],    // back tier one
            [1.0, .550, -4.7, 2, false, false],    //
            [1.5, .550, -4.7, 2, false, false],    //
            [2.0, .550, -4.7, 2, false, false],    //---------------- 26
            [2.7, .55, 5.25, 3, false, false],     //----------------
            [2.7, .55, 4.75, 3, false, false],     //
            [2.7, .55, 4.25, 3, false, false],     //
            [2.7, .55, 3.75, 3, false, false],     //
            [2.7, .55, 3.25, 3, false, false],     //
            [2.7, .55, 2.75, 3, false, false],     //
            [2.7, .55, 2.25, 3, false, false],     //
            [2.7, .55, 1.75, 3, false, false],     //
            [2.7, .55, 1.25, 3, false, false],     //
            [2.7, .55, 0.75, 3, false, false],     // right tier one
            [2.7, .55, 0.25, 3, false, false],     //
            [2.7, .55, -0.25, 3, false, false],    //
            [2.7, .55, -0.75, 3, false, false],    //
            [2.7, .55, -1.25, 3, false, false],    //
            [2.7, .55, -1.75, 3, false, false],    //
            [2.7, .55, -2.25, 3, false, false],    //
            [2.7, .55, -2.75, 3, false, false],    //
            [2.7, .55, -3.25, 3, false, false],    //
            [2.7, .55, -3.75, 3, false, false],    //
            [2.7, .55, -4.25, 3, false, false],    //---------------- 46
            [-2.1, 1.05, 5.00, 1, false, false],    //----------------
            [-2.1, 1.05, 4.50, 1, false, false],    //
            [-2.1, 1.05, 4.00, 1, false, false],    //
            [-2.1, 1.05, 3.50, 1, false, false],    //
            [-2.1, 1.05, 3.00, 1, false, false],    //
            [-2.1, 1.05, 2.50, 1, false, false],    //
            [-2.1, 1.05, 2.00, 1, false, false],    //
            [-2.1, 1.05, 1.50, 1, false, false],    //
            [-2.1, 1.05, 1.00, 1, false, false],    //
            [-2.1, 1.05, 0.50, 1, false, false],    // left tier two
            [-2.1, 1.05, 0.00, 1, false, false],    //
            [-2.1, 1.05, -0.50, 1, false, false],   //
            [-2.1, 1.05, -1.00, 1, false, false],   //
            [-2.1, 1.05, -1.50, 1, false, false],   //
            [-2.1, 1.05, -2.00, 1, false, false],   //
            [-2.1, 1.05, -2.50, 1, false, false],   //
            [-2.1, 1.05, -3.00, 1, false, false],   //
            [-2.1, 1.05, -3.50, 1, false, false],   //
            [-2.1, 1.05, -4.00, 1, false, false],   //---------------- 65
            [-1.25, 1.05, -5.1, 2, false, false],    //----------------
            [-.75, 1.050, -5.1, 2, false, false],    //
            [-.25, 1.050, -5.1, 2, false, false],    //
            [0.25, 1.050, -5.1, 2, false, false],    // back tier two
            [0.75, 1.050, -5.1, 2, false, false],    //
            [1.25, 1.050, -5.1, 2, false, false],    //
            [1.75, 1.050, -5.1, 2, false, false],    //
            [2.25, 1.050, -5.1, 2, false, false],    //---------------- 74
            [3.1, 1.05, 5.00, 3, false, false],     //----------------
            [3.1, 1.05, 4.50, 3, false, false],     //
            [3.1, 1.05, 4.00, 3, false, false],     //
            [3.1, 1.05, 3.50, 3, false, false],     //
            [3.1, 1.05, 3.00, 3, false, false],     //
            [3.1, 1.05, 2.50, 3, false, false],     //
            [3.1, 1.05, 2.00, 3, false, false],     //
            [3.1, 1.05, 1.50, 3, false, false],     //
            [3.1, 1.05, 1.00, 3, false, false],     //
            [3.1, 1.05, 0.50, 3, false, false],     // right tier two
            [3.1, 1.05, 0.00, 3, false, false],     //
            [3.1, 1.05, -0.50, 3, false, false],    //
            [3.1, 1.05, -1.00, 3, false, false],    //
            [3.1, 1.05, -1.50, 3, false, false],    //
            [3.1, 1.05, -2.00, 3, false, false],    //
            [3.1, 1.05, -2.50, 3, false, false],    //
            [3.1, 1.05, -3.00, 3, false, false],    //
            [3.1, 1.05, -3.50, 3, false, false],    //
            [3.1, 1.05, -4.00, 3, false, false],    //---------------- 93
            [-2.5, 1.55, 5.25, 1, false, false],    //----------------
            [-2.5, 1.55, 4.75, 1, false, false],    //
            [-2.5, 1.55, 4.25, 1, false, false],    //
            [-2.5, 1.55, 3.75, 1, false, false],    //
            [-2.5, 1.55, 3.25, 1, false, false],    //
            [-2.5, 1.55, 2.75, 1, false, false],    //
            [-2.5, 1.55, 2.25, 1, false, false],    //
            [-2.5, 1.55, 1.75, 1, false, false],    //
            [-2.5, 1.55, 1.25, 1, false, false],    //
            [-2.5, 1.55, 0.75, 1, false, false],    // left tier three
            [-2.5, 1.55, 0.25, 1, false, false],    //
            [-2.5, 1.55, -0.25, 1, false, false],   //
            [-2.5, 1.55, -0.75, 1, false, false],   //
            [-2.5, 1.55, -1.25, 1, false, false],   //
            [-2.5, 1.55, -1.75, 1, false, false],   //
            [-2.5, 1.55, -2.25, 1, false, false],   //
            [-2.5, 1.55, -2.75, 1, false, false],   //
            [-2.5, 1.55, -3.25, 1, false, false],   //
            [-2.5, 1.55, -3.75, 1, false, false],   //
            [-2.5, 1.55, -4.25, 1, false, false],   //---------------- 110
            [-1, 1.550, -5.50, 2, false, false],    //----------------
            [-.5, 1.550, -5.5, 2, false, false],    //
            [0.0, 1.550, -5.5, 2, false, false],    //
            [0.5, 1.550, -5.5, 2, false, false],    // back tier three
            [1.0, 1.550, -5.5, 2, false, false],    //
            [1.5, 1.550, -5.5, 2, false, false],    //
            [2.0, 1.550, -5.5, 2, false, false],    //---------------- 118
            [3.5, 1.55, 5.25, 3, false, false],     //----------------
            [3.5, 1.55, 4.75, 3, false, false],     //
            [3.5, 1.55, 4.25, 3, false, false],     //
            [3.5, 1.55, 3.75, 3, false, false],     //
            [3.5, 1.55, 3.25, 3, false, false],     //
            [3.5, 1.55, 2.75, 3, false, false],     //
            [3.5, 1.55, 2.25, 3, false, false],     //
            [3.5, 1.55, 1.75, 3, false, false],     //
            [3.5, 1.55, 1.25, 3, false, false],     //
            [3.5, 1.55, 0.75, 3, false, false],     // right tier three
            [3.5, 1.55, 0.25, 3, false, false],     //
            [3.5, 1.55, -0.25, 3, false, false],    //
            [3.5, 1.55, -0.75, 3, false, false],    //
            [3.5, 1.55, -1.25, 3, false, false],    //
            [3.5, 1.55, -1.75, 3, false, false],    //
            [3.5, 1.55, -2.25, 3, false, false],    //
            [3.5, 1.55, -2.75, 3, false, false],    //
            [3.5, 1.55, -3.25, 3, false, false],    //
            [3.5, 1.55, -3.75, 3, false, false],    //
            [3.5, 1.55, -4.25, 3, false, false],    //---------------- 138
            [-2.9, 2.05, 5.00, 1, false, false],    //----------------
            [-2.9, 2.05, 4.50, 1, false, false],    //
            [-2.9, 2.05, 4.00, 1, false, false],    //
            [-2.9, 2.05, 3.50, 1, false, false],    //
            [-2.9, 2.05, 3.00, 1, false, false],    //
            [-2.9, 2.05, 2.50, 1, false, false],    //
            [-2.9, 2.05, 2.00, 1, false, false],    //
            [-2.9, 2.05, 1.50, 1, false, false],    //
            [-2.9, 2.05, 1.00, 1, false, false],    //
            [-2.9, 2.05, 0.50, 1, false, false],    // left tier four
            [-2.9, 2.05, 0.00, 1, false, false],    //
            [-2.9, 2.05, -0.50, 1, false, false],   //
            [-2.9, 2.05, -1.00, 1, false, false],   //
            [-2.9, 2.05, -1.50, 1, false, false],   //
            [-2.9, 2.05, -2.00, 1, false, false],   //
            [-2.9, 2.05, -2.50, 1, false, false],   //
            [-2.9, 2.05, -3.00, 1, false, false],   //
            [-2.9, 2.05, -3.50, 1, false, false],   //
            [-2.9, 2.05, -4.00, 1, false, false],   //---------------- 157
            [-1.25, 2.05, -5.9, 2, false, false],    //----------------
            [-.75, 2.050, -5.9, 2, false, false],    //
            [-.25, 2.050, -5.9, 2, false, false],    //
            [0.25, 2.050, -5.9, 2, false, false],    // back tier four
            [0.75, 2.050, -5.9, 2, false, false],    //
            [1.25, 2.050, -5.9, 2, false, false],    //
            [1.75, 2.050, -5.9, 2, false, false],    //
            [2.25, 2.050, -5.9, 2, false, false],    //---------------- 165
            [3.9, 2.05, 5.00, 3, false, false],     //----------------
            [3.9, 2.05, 4.50, 3, false, false],     //
            [3.9, 2.05, 4.00, 3, false, false],     //
            [3.9, 2.05, 3.50, 3, false, false],     //
            [3.9, 2.05, 3.00, 3, false, false],     //
            [3.9, 2.05, 2.50, 3, false, false],     //
            [3.9, 2.05, 2.00, 3, false, false],     //
            [3.9, 2.05, 1.50, 3, false, false],     //
            [3.9, 2.05, 1.00, 3, false, false],     //
            [3.9, 2.05, 0.50, 3, false, false],     // right tier four
            [3.9, 2.05, 0.00, 3, false, false],     //
            [3.9, 2.05, -0.50, 3, false, false],    //
            [3.9, 2.05, -1.00, 3, false, false],    //
            [3.9, 2.05, -1.50, 3, false, false],    //
            [3.9, 2.05, -2.00, 3, false, false],    //
            [3.9, 2.05, -2.50, 3, false, false],    //
            [3.9, 2.05, -3.00, 3, false, false],    //
            [3.9, 2.05, -3.50, 3, false, false],    //
            [3.9, 2.05, -4.00, 3, false, false],    //---------------- 186
            ];



