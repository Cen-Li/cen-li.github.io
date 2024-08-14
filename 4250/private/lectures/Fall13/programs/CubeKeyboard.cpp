/*
 CubeKeyboard.cpp  
 This program illustrate: the callback function to handle keyboard inputs
 (1) register a keyboard callback function in the main function
 (2) define the keyboard callback function
 (3) don't forget to use "glutPostRedisplay" at the end of the function
  
 */

#include <iostream>
using namespace std;

#define WINDOWS

#ifdef WINDOWS
#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>
#endif

#ifdef LINUX
#include <GL/glut.h>
#endif


#ifdef MAC
#include <OpenGL/gl.h>      
#include <OpenGL/glu.h>     
#include <GLUT/glut.h>      
#endif

#define Width 500
#define Height 500

// user defined functions
void Draw();
void MyInit();
void myKeyboard(unsigned char theKey, int x, int y);

// global vars
GLfloat red=1.0, green=0.0, blue=1.0;

int main(int argc, char** argv)
{
	glutInit(&argc,argv);  // extracts command line options intended for the GLUT library. 
	// Typically, no command line arguments is supplied
	glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);  // set to use single frame buffer, RGB color
	
	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(0, 0);  // define the position of the window: upper left corner of the screen
	glutCreateWindow("Cube with Keyboard event callback");   // define the name of the window
	
	
	MyInit();   // set window's initial settings : background, transformation matrix, clipping window, etc.
    
	glutDisplayFunc(Draw); // Display call back function is "Draw"
	glutKeyboardFunc(myKeyboard);
	
	glutMainLoop();  // enter the program main loop waiting for events to occur 
	
	return 0;
}

void MyInit()
{
	// set clear color to black 
	glClearColor (0.0, 0.0, 0.0, 0.0);
	
	// set fill color to red 
	glColor3f(red, green, blue);
	
	/* set up standard orthogonal view with clipping 
	 box as cube of side 2 centered at origin 
	 This is default view and these statement could be removed */
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity ();
	
	// set up the clipping window, left(-1.0), right(1.0), bottom(-1.0), top(1.0), front(-1.0) and back(1.0)
	glOrtho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
}

// This function is responsible for drawing things in the window
void Draw()
{
	// clear window using the backgound color set in the MyInit function 
	glClear(GL_COLOR_BUFFER_BIT);
	
	glColor3f(red, green, blue);  // set draw color
	
	// draw unit square polygon 
	glBegin(GL_POLYGON);
	glVertex2f(-0.5, -0.5);
	glVertex2f(-0.5, 0.5);
	glVertex2f(0.5, 0.5);
	glVertex2f(0.5, -0.5);
	glEnd();
	
	// flush GL buffers, so the things drawn above is reflected on screen immediately 
	glFlush();
}

// This function handles the input entered from the keyboard
// user may change the color of the cube by pressing a letter
// user may also exit the program by pressing either 'q' or the ESC key
void myKeyboard(unsigned char theKey, int x, int y)
{
	switch(theKey)
	{
		case 'w':   // change to white color
			red=1.0; green=1.0; blue=1.0;
			break;
		case 'r':  // change to red color
			red=1.0; green=0.0; blue=0.0;
			break;
		case 'g':   // change to white color
			red=0.0; green=1.0; blue=0.0;
			break;
		case 'b':  // change to red color
			red=0.0; green=0.0; blue=1.0;
			break;
		case 'y':  // change to white color
			red=1.0; green=1.0; blue=0.0;
			break;
		case 'o':  // change to red color
			red=0.3; green=0.6; blue=0.2;
			break;
		case 'q':   // end display
			exit (0);
		default:
			if (theKey == 27)   // ASCII for escape character
				exit(0);
	}

	glutPostRedisplay();     // invoke the "Draw" function to actually display the new image
}