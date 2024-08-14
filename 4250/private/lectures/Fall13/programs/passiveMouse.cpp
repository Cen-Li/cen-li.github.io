/*
 PassiveMouse.cpp  
 This program illustrate: the callback function to handle passive mouse movements
 (1) register a passive mouse movement callback function in the main function
 (2) define the callback function
 (3) don't forget to use "glutPostRedisplay" at the end of the function
 
 First use the mouse to select the lower left point of the rectangle.
 Then, select the upper right corner of the rectangle
 As the mouse moves, without pressing, the shape of the rectangle defined with the mouse position corresponding to the
 upper right corner of the rectangle is displayed. The press of the mouse button "determines" the second point of the 
 rectangle.
 
 variables:
 --select : whether the starting point has been selected with mouse click
 --done : whether two points have been selected with mouse clicks
  
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


#ifdef MAC
#include <OpenGL/gl.h>      
#include <OpenGL/glu.h>     
#include <GLUT/glut.h>      
#endif

#define Width 500
#define Height 500

struct GLintPoint{
	GLint x, y;
};

// user defined functions
void Draw();
void MyInit();
void MyPassiveMotion(int, int);
void MyMouse(int, int, int, int);
void MyKeyboard(unsigned char, int, int);

// global vars
bool selected=false; // no points has been selected initially
bool done=false;

GLintPoint corner[2];  // the coordinates of the lower left and the upper right corners of a rectangle

int main(int argc, char** argv)
{
	glutInit(&argc,argv);  // extracts command line options intended for the GLUT library. 
	// Typically, no command line arguments is supplied
	glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB);  // set to use single frame buffer, RGB color
	
	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(0, 0);  // define the position of the window: upper left corner of the screen
	glutCreateWindow("Rubber Rectangle");   // define the name of the window	

	MyInit();   // set window's initial settings : background, transformation matrix, clipping window, etc.
    
	glutDisplayFunc(Draw); // Display callback function is "Draw"
	glutMouseFunc(MyMouse);   // register Mouse event callbak function
	glutPassiveMotionFunc(MyPassiveMotion);  // register Passive Mouse event callback
	glutKeyboardFunc(MyKeyboard);
	
	glutMainLoop();  // enter the program main loop waiting for events to occur 
	
	return 0;
}

void MyInit()
{
	// set clear color to black 
	glClearColor (0.0, 0.0, 0.0, 0.0);
	
	// set fill color to red 
	glColor3f(0.0, 1.0, 0.5);
	
	/* set up standard orthogonal view with clipping 
	 box as cube of side 2 centered at origin 
	 This is default view and these statement could be removed */
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity ();
	
	// set up the clipping window, left(0), right(500), bottom(0), top(500   *** important!!! ***
	gluOrtho2D(0, Width, 0, Height);
}

// This function is responsible for drawing things in the window
void Draw()
{
	// clear window using the backgound color set in the MyInit function 
	glClear(GL_COLOR_BUFFER_BIT);
		 
	if (selected)   // draw the current size of the rectangle. The rectangle shape changes as the mouse moves
	{
		glBegin(GL_POLYGON);
		glVertex2i(corner[0].x, corner[0].y);
		glVertex2i(corner[0].x, corner[1].y);
		glVertex2i(corner[1].x, corner[1].y);
		glVertex2i(corner[1].x, corner[0].y);
		glEnd();
	}
	
	// swap the GL (2) buffers, so the things drawn above is reflected on screen immediately 
	glutSwapBuffers();
}

void MyMouse(int button, int state, int x, int y)
{
	if (button == GLUT_LEFT_BUTTON && state == GLUT_DOWN && !selected)
	{
		corner[0].x = x;
		corner[0].y = Height - y;
		cout << "select set to true" << endl;
		
		selected = true;
	}
	else if (button == GLUT_LEFT_BUTTON && state == GLUT_DOWN && selected)
		done=true;     // ends "rubber rectangling" 
}

void MyPassiveMotion(int x, int y)
{
	if (selected && !done)  // start recording the second point after one point is selected
	{
		corner[1].x = x;
		corner[1].y = Height - y;
	}

	glutPostRedisplay(); // invoke "Draw" to draw the image with the new corner[1] data
}

void MyKeyboard(unsigned char theKey, int x, int y)
{
	if (theKey == 'q' || theKey == 27)
		exit (0);

}