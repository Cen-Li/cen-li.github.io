/*
 cube.cpp  
 cube version 1: Illustrate:
 1) the proper include statements to be used on (a) Windows, (b) Linux, and (c) Mac machines
 2) the basic program structure
 
 This program draws a white rectangle on a black background.
 Right click on the window will bring up the menu for color picking
 
 */

#include <iostream>
using namespace std;

#define MAC

#ifdef WINDOWS
#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>
#endif

#ifdef LINUX
#include <GL/glut.h>
#endif
/*
 and compile with:
 gcc program.cpp -o RunProgram -I/usr/X11R6/include/ -L/usr/X11R6/lib -lX11 -lXi -lglut -lGL -lGLU
 */

#ifdef MAC
#include <OpenGL/gl.h>      
#include <OpenGL/glu.h>     
#include <GLUT/glut.h>      
#endif

#define Width 500
#define Height 500

#define RED 1
#define BLUE 2
#define YELLOW 3
#define GREEN 4
#define WHITE 5

// user defined functions
void Draw();
void MyInit();
void ProcessMenuEvents(int);

// global vars
GLfloat red=1.0, green=0.0, blue=1.0;

int main(int argc, char** argv)
{
	glutInit(&argc,argv);  // extracts command line options intended for the GLUT library. 
	// Typically, no command line arguments is supplied
	glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB);  // set to use single frame buffer, RGB color
	
	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(0, 0);  // define the position of the window: upper left corner of the screen
	glutCreateWindow("Cube with Menu");   // define the name of the window
	
	MyInit();   // set window's initial settings : background, transformation matrix, clipping window, etc.
    
	glutDisplayFunc(Draw); // Display call back function is "Draw"

	// create a menu for color
	glutCreateMenu(ProcessMenuEvents);
	glutAddMenuEntry("Red", RED);
	glutAddMenuEntry("Blue", BLUE);
	glutAddMenuEntry("Yellow", YELLOW);
	glutAddMenuEntry("Green",GREEN);
	glutAddMenuEntry("White", WHITE);
	glutAttachMenu(GLUT_RIGHT_BUTTON);
	
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
	glutSwapBuffers();
	glutPostRedisplay();
}

void ProcessMenuEvents(int option)
{
	switch (option)
	{
		case RED:		red=1.0; green=0.0; blue=0.0; cout << "red" << endl;
			// draw unit square polygon 
			glBegin(GL_POLYGON);
			glVertex2f(-0.5, -0.5);
			glVertex2f(-0.5, 0.5);
			glVertex2f(0.5, 0.5);
			glVertex2f(0.5, -0.5);
			glEnd();
			
			break;
		case GREEN: 	red=0.0; green=1.0; blue=0.0; cout << "green" << endl;
			// draw unit square polygon 
			glBegin(GL_POLYGON);
			glVertex2f(-0.5, -0.5);
			glVertex2f(-0.5, 0.5);
			glVertex2f(0.5, 0.5);
			glVertex2f(0.5, -0.5);
			glEnd();
			
			break;
		case BLUE:		red=0.0; green=0.0; blue=1.0; cout << "blue" << endl;
			break;
		case WHITE: 	red=1.0; green=1.0; blue=1.0;
			break;
		case YELLOW: 	red=1.0; green=1.0; blue=0.0;
			break;
	}
	
	glutSwapBuffers();

}
