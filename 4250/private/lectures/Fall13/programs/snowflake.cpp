/*
 
 The purpose of this program is to demonstrate 2D transformations. 
 The program draws a snowflake of 6 branches 
 based on drawing of a branch of a snowflake

*/

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

#include <iostream>
using namespace std;

void DrawPart();
void DrawOneBranch();
void Displays();
void Myinit();
void MyReshape (int w, int h);
void myKeyboard(unsigned char theKey, int x, int y);
void DrawWholeSnowFlake();

int main (int argc, char** argv)
{
	/* create a single buffered window */
	glutInit (&argc, argv);
	glutInitDisplayMode (GLUT_SINGLE| GLUT_RGB);
	glutCreateWindow ("Snowflake");
	
	/*initialize the window, set the display, reshape,
	 idle, and mouse callbacks for this window */
	glutReshapeFunc (MyReshape);
	glutDisplayFunc (Displays);
	glutKeyboardFunc(myKeyboard);
	
	Myinit ();
	
	/* enter the main event loop */
	glutMainLoop();
}

void DrawPart()
{
	//draw 1/2 of a branch
	glBegin(GL_LINE_STRIP);
	glVertex2f(0, 0.1);
	glVertex2f(2, 0.1);

	glVertex2f(3, 1.5);
	glVertex2f(3.2, 1.4);

	glVertex2f(2, 0.1);
	glVertex2f(2.1, 0.1);

	
	glVertex2f(4, 0.1);
	glVertex2f(5, 1.4);
	glVertex2f(5.2, 1.4);

	glVertex2f(4.1, 0.1);
	glVertex2f(5.5, 0.1);
	glVertex2f(5.8, 0);
	glEnd();
}

void DrawOneBranch()
{
	//glPushMatrix();
	DrawPart();
	glScaled(1, -1, 0);
	DrawPart();
	//glPopMatrix();
}
	
void DrawWholeSnowFlake()
{
	for (int i=0; i<6; i++)
	{
		//glLoadIdentity();
		glRotated(60, 0, 0, 1);
    	DrawOneBranch();
	}
}

/* This is the display callback for the window.  
 It clears the buffer and then draws a rectangle. */
void Displays()
{
	glClear (GL_COLOR_BUFFER_BIT);
	
	// white transformed triangle
	glColor3f (0.0, 0.2, 1.0);

    DrawWholeSnowFlake();
	
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
		gluOrtho2D (-15.0, 15.0, -15.0 * (GLfloat)h/(GLfloat)w,
					15.0 * (GLfloat) h/(GLfloat)w);
	else
		
		gluOrtho2D (-15.0 * (GLfloat)w/(GLfloat)h, 
					15.0 * (GLfloat)w/(GLfloat)h, -15.0, 15.0);
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
