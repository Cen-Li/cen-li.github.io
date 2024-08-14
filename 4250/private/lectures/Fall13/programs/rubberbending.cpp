/*
 rubberband.cpp  
 This example illustrates the callback function 
 that handles the mouse event when the mouse left or right button is pressed 
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

#define NUM 20

struct GLintPoint
{
	GLint x;
	GLint y;
};

// user defined functions
void Draw();
void MyInit();
void myMouse(int button, int state, int x, int y);

// global vars
GLintPoint List[NUM];
GLint last = -1;            	// last index used so far 

int main(int argc, char** argv)
{
	glutInit(&argc,argv);  // extracts command line options intended for the GLUT library. 
	// Typically, no command line arguments is supplied
	glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB);  // set to use single frame buffer, RGB color
	
	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(0, 0);  // define the position of the window: upper left corner of the screen
	glutCreateWindow("Rubberband");   // define the name of the window
	
	MyInit();   // set window's initial settings : background, transformation matrix, clipping window, etc.
    
	glutDisplayFunc(Draw); // Display call back function is "Draw"
	glutMouseFunc(myMouse);
	
	glutMainLoop();  // enter the program main loop waiting for events to occur 
	
	return 0;
}

void MyInit()
{
	// set clear color to black 
	glClearColor (0.0, 0.0, 0.0, 0.0);
	
	// set fill color to red 
	glColor3f(1, 0, 0);
	
	/* set up standard orthogonal view with clipping 
	 box as cube of side 2 centered at origin 
	 This is default view and these statement could be removed */
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity ();
	
	// set up the 2D clipping window, left(0), right(500), bottom(0), top(500)
	gluOrtho2D(0, 500, 0, 500);
}

// This function is responsible for drawing things in the window
void Draw()
{
	// clear window using the backgound color set in the MyInit function 
	glClear(GL_COLOR_BUFFER_BIT);
	
	glColor3f(0.0, 0.0, 1.0); // draw line with blue color

	glBegin(GL_LINE_STRIP); 		    // redraw the polyline				     
	for(int i = 0; i <= last; i++)
		glVertex2i(List[i].x, List[i].y);
	glEnd();
	
	// flush GL buffers, so the things drawn above is reflected on screen immediately 
	glutSwapBuffers();
}

// the origin of the windows' co-ordinate system is always the top left corner of the window.
// the origin of the opengl's window co-ordinate system is the lower left corner
// the origin of the coordinates for the drawing in opengl window is defined by glOrtho or gluOrtho2D
void myMouse(int button, int state, int x, int y)
{
	// test for mouse button as well as for a full array
	if(button == GLUT_LEFT_BUTTON && state == GLUT_DOWN && last < NUM -1)
	{        
		List[++last].x = x; 		    // add new point to list
		List[  last].y = Height - y; // window height is 480
		// cout << "x= " << x << ", y=" << y << ", last="<< last << endl; //debugging info in the console window
	}
	else if(button == GLUT_RIGHT_BUTTON && state == GLUT_DOWN)
		last = -1;	         // reset the list to empty
	
	glutSwapBuffers();
	glutPostRedisplay();
}

