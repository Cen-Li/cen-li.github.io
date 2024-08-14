/*
 cube.cpp  
 cube version 1: Illustrate:
 1) the proper include statements to be used on (a) Windows, (b) Linux, and (c) Mac machines
 2) the basic program structure
 
 This program draws a white rectangle on a black background.
 */

#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

#define Width 500
#define Height 500

void Draw();
void MyInit();

int main(int argc, char** argv)
{
	/* Window title is name of program (arg[0]) */
	
	glutInit(&argc,argv);  // extracts command line options intended for the GLUT library. 
	// Typically, no command line arguments is supplied
	glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);  // set to use single frame buffer, RGB color
	
	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(400,800);  // define the position of the window: upper left corner of the screen
	glutCreateWindow("Cube Display");   // define the name of the window
	
	glutDisplayFunc(Draw); // Display call back function is "Draw"
	
	MyInit();   // set window's initial settings : background, transformation matrix, clipping window, etc.
	
	glutMainLoop();  // enter the program main loop waiting for events to occur 

	return 0;
}

// This function is responsible for drawing things in the window
void Draw()
{
	// clear window using the backgound color set in the MyInit function 
	glClear(GL_COLOR_BUFFER_BIT);
	
	// draw unit square polygon using the draw color defined in myInit
	glBegin(GL_POLYGON);
	glVertex2f(-0.5, -0.5);
	glVertex2f(-0.5, 0.5);
	glVertex2f(0.5, 0.5);
	glVertex2f(0.5, -0.5);
	glEnd();

	// flush GL buffers, so the things drawn above is reflected on screen immediately 
	glFlush();
}

void MyInit()
{
	// set clear color to black 
	glClearColor (0.0, 0.0, 0.0, 0.0);
	
	// set fill color to white 
	glColor3f(1.0, 1.0, 1.0);
	
	/* set up standard orthogonal view with clipping 
	 box as cube of side 2 centered at origin 
	 This is default view and these statement could be removed */
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity ();
	
	// set up the clipping window, left(-1.0), right(1.0), bottom(-1.0), top(1.0), front(-1.0) and back(1.0)
	glOrtho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
}

