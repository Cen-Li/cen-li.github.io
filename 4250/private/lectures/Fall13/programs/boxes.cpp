// This is coded to study coordinate system transformation
// when the user presses '1', 18 scaled-down squares are displayed in a circle, each rotated
// when the user presses '2', .... squares are not rotated

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

#include <cmath>
#include <iostream>
#include <stdlib.h>
using namespace std;

char mode=0;   // 0-original single square; 1-rotated circle of squares; 2-straight circle of squares   
float pi=3.14159;

void DrawSquare2();
void Displays();
void Myinit();
void MyReshape (int w, int h);
void Keyboard (unsigned char key, int x, int y);

int main (int argc, char** argv)
{
	/* create a single buffered window */
	glutInit (&argc, argv);
	glutInitDisplayMode (GLUT_SINGLE| GLUT_RGB);
	glutCreateWindow ("2D Transformation Practice");
	
	/*initialize the window, set the display, reshape,
	 keyboard callbacks for this window */
	glutReshapeFunc (MyReshape);
	glutDisplayFunc (Displays);
	glutKeyboardFunc (Keyboard);
	
	Myinit ();
	
	/* enter the main event loop */
	glutMainLoop();
}

void Displays()
{
	float radius=4.0;
	float x, y;
	float angle;
	
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(0, 0, 1);
	
	if (mode==0)
	{
		// draw a square centered at origin, length=3
		DrawSquare2();
	}
	else if	(mode==1)
	{
		// fill code here to draw 16 squares scaled down to 0.3 and
		// placed around a circle of radius=4.0, each square is rotated at 45 degree
		for (int i=0; i<16; i++)
		{
			








		}
	}
	else if (mode==2)
	{
		// fill code here to draw 16 squares scaled down to 0.3 and
		// placed around a circle of radius=4.0, each square is its original orientation 
		for (int i=0; i<16; i++)
		{










		}
	}
	glFlush();
}

void DrawSquare2()
{
	glBegin(GL_POLYGON);
	glVertex3f(1.5, 1.5, 0);
	glVertex3f(1.5, -1.5, 0);
	glVertex3f(-1.5, -1.5, 0);
	glVertex3f(-1.5, 1.5, 0);
	glEnd();	
}

/* This function initializes the background color to black
 and the drawing color to white. */
void Myinit()
{
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity ();
	
	// set up the clipping window, 
	gluOrtho2D(-10.0, 10.0, -10.0, 10.0);
	
	glMatrixMode (GL_MODELVIEW);
	glLoadIdentity();
	
	glClearColor(1.0, 1.0, 1.0, 1.0);//background white
	glColor3f (0.0, 1.0, 1.0);
	
}

void Keyboard (unsigned char key, int x, int y)
{
	//Perform a translation in x
	if (key == '0') // rotate first translate next
	{
		mode=0;
	}
	else if (key == '1')  // translate first, rotate next
	{
		mode=1;
	}
	else if (key == '2')
	{
		mode=2;
	}
	else if (key == 'q')
		exit(0);
	
	glutPostRedisplay();
	
}

/* This is the reshape callback.  It takes care of resize events.
 The parameters w and h are the width and height of the window after
 the resize event. */
void MyReshape (int w, int h)
{
	/* set the viewport to the entire window */
	glViewport (0, 0, w, h);
	
	/* set the window to viewport transformation based on
	 whether the window is wider than it is high or vice versa */
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity();
	if (w < h)
		gluOrtho2D (-10.0, 10.0, -10.0 * (GLfloat)h/(GLfloat)w,
					10.0 * (GLfloat) h/(GLfloat)w);
	else
		
		gluOrtho2D (-10.0 * (GLfloat)w/(GLfloat)h, 
					10.0 * (GLfloat)w/(GLfloat)h, -10.0, 10.0);
	glMatrixMode (GL_MODELVIEW);
	glLoadIdentity();
	glFlush();
}

