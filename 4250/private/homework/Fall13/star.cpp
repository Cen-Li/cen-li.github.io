/*
 
 The purpose of this program is to demonstrate 2D transformations. 
 The program draws a twisted star of 5 branches 
 based on vertex definition of one branch of the star

*/

#include <cmath>
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

#include <iostream>
using namespace std;

void DrawOneBranch();
void Display();
void Myinit();
void MyReshape (int w, int h);
void myKeyboard(unsigned char theKey, int x, int y);

int main (int argc, char** argv)
{
	/* create a single buffered window */
	glutInit (&argc, argv);
	glutInitDisplayMode (GLUT_SINGLE| GLUT_RGB);
	glutCreateWindow ("Stars");
	
	/*initialize the window, set the display, reshape,
	 idle, and mouse callbacks for this window */
	glutReshapeFunc (MyReshape);
	glutDisplayFunc (Display);
	glutKeyboardFunc(myKeyboard);
	
	Myinit ();
	
	/* enter the main event loop */
	glutMainLoop();
}

// This draws one branch of a twisted star
void DrawOneBranch()
{
        //draw 1/2 of a branch
        glBegin(GL_LINE_LOOP);
        glVertex2f(0, 2);
        glVertex2f(0.1, 1);

        glVertex2f(0.4, 1);
        glVertex2f(0, 4);

        glVertex2f(-1, -0.3);
        glVertex2f(-0.5, -0.5);

        glEnd();
}

/* This is the display callback for the window.  
 It clears the buffer and then draws a rectangle. */
void Display()
{
	glClear (GL_COLOR_BUFFER_BIT);
	glColor3f (0.0, 0.2, 1.0);
	
	// add code to draw a circle of twisted stars
	// each star is rotated 30 degrees from its previous star

	glFlush();
}


/* This function initializes the background color to black
 and the drawing color to white. */
void Myinit()
{
    glClearColor(1.0, 1.0, 1.0, 1.0);
    glColor3f (1.0, 1.0, 1.0);

    glMatrixMode (GL_MODELVIEW);
    glLoadIdentity();
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
		gluOrtho2D (-25.0, 25.0, -25.0 * (GLfloat)h/(GLfloat)w,
					25.0 * (GLfloat) h/(GLfloat)w);
	else
		
		gluOrtho2D (-25.0 * (GLfloat)w/(GLfloat)h, 
					25.0 * (GLfloat)w/(GLfloat)h, -25.0, 25.0);
	glMatrixMode (GL_MODELVIEW);
	glLoadIdentity();
	glFlush();
}

void myKeyboard(unsigned char theKey, int x, int y)
{
	switch(theKey)
	{
		case 'q':   // end display
			exit (0);
		default:
			if (theKey == 27)   // ASCII for escape character
				exit(0);
	}

	glutPostRedisplay();     // invoke the "Draw" function to actually display the new image
}
