/*
 PROGRAMMER:
 CLASS:       CSCI 425/525
 DUE:         October 5, 1999
 INSTRUCTOR:  Dr. Hankins
 
 The purpose of this program is to demonstrate single
 and double buffering for flicker-free animation. This
 is the first introduction of the idle callback.  It is
 used to perform processing while no events are happening.
 
 The	left and right mouse buttons start and stop the 
 spinning motion of a square.  To exit the applicaion,
 close the application window.
 */

#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

#include <ctime>
#include <cmath>
#include <cstdlib>


/* spin controls the angle of rotation of the square */
static GLfloat spin = 0.0;

/* 
 Function:  displayd()
 
 Preconditions:  GLUT and OpenGL should be initialized
 and this function should be registered as the display
 callback.
 
 Postconditions: This is the display callback for a single 
 buffered window.  It clears the buffer and then draws a 
 rectangle in the back buffer and then swaps buffers. 
 */
void displayd(void)
{
	glClear (GL_COLOR_BUFFER_BIT);        //set the background to black
	glRectf (-25.0, -25.0, 25.0, 25.0);   //draw the rectangle
	glutSwapBuffers();                    //swap buffers
	glFlush();
}

/* 
 Function:  spinDisplay()
 
 Preconditions:  GLUT and OpenGL must be initialized and
 this function must be registered as the idle callback.
 
 Postconditions: This is the idle function callback.  It runs 
 when no event processing is happening.  This callback increments
 the angle of rotation by 2 degrees and updates the transformation
 matrices for both the single buffer window and the double
 buffer window. 
 */
void spinDisplay(void)
{
	/* increment the rotation angle */
	spin = spin + 0.5;
	
	/* if the angle is too big, resize it */
	if (spin > 360.0) 
		spin = spin - 360.0;
	
	/* use the angle for the single buffer window */
	glLoadIdentity();
	glRotatef(spin, 0.0, 0.0, 1.0);
	
	/* mark the single buffer window as needing to be redisplayed */
	//glFlush();
	glutPostRedisplay();
	
}

/* 
 Function:  myinit()
 Preconditions:  OpenGL and GLUT must be initialized.
 
 Postconditions: This function initializes the background color 
 to black and the drawing color to white. 
 */
void myinit()
{
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glColor3f (1.0, 1.0, 1.0);
	glFlush();
}

/* 
 Function:  mouse()
 
 Preconditions:  OpenGL and GLUT must be initialized and this
 function must be registered as the mouse callback.
 
 Postconditions: This function handles the mouse callback.  If the 
 left button is clicked, the idle callback is set to spinDisplay() 
 which causes the square to spin.  If the right button is clicked, 
 the idle callback is set to NULL and the square stops spinning. 
 */
void mouse (int btn, int state, int x, int y)
{	
	if (btn == GLUT_LEFT_BUTTON && state == GLUT_DOWN)
		glutIdleFunc (spinDisplay);
	if (btn == GLUT_RIGHT_BUTTON && state == GLUT_DOWN)
		glutIdleFunc (NULL);
	//glutSwapBuffers();
	//glutPostRedisplay();
}

/* 
 Function:  myReshape()
 
 Preconditions:  OpenGL and GLUT must have been initialized and
 this function must be registered as the reshape callback.
 
 Postconditions: This is the reshape callback.  It takes care of 
 resize events. The parameters w and h are the width and height 
 of the window after the resize event. 
 */
void myReshape (int w, int h)
{
	/* set the viewport to the entire window */
	glViewport (0, 0, w, h);
	
	/* set the window to viewport transformation based on
	 whether the window is wider than it is high or vice versa */
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity();
	if (w < h)
		gluOrtho2D (-50.0, 50.0, -50.0 * (GLfloat)h/(GLfloat)w,
					50.0 * (GLfloat) h/(GLfloat)w);
	else
		gluOrtho2D (-50.0 * (GLfloat)w/(GLfloat)h, 
					50.0 * (GLfloat)w/(GLfloat)h, -50.0, 50.0);

	glMatrixMode (GL_MODELVIEW);
	glLoadIdentity();
	
	glFlush();
}

int main (int argc, char** argv)
{
	/* create a single/double buffered window */
	glutInit (&argc, argv);
	//glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);
	glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB);
	glutCreateWindow ("Spinning Cube");
	
	/*initialize the window, set the display, reshape,
	 idle, and mouse callbacks for this window */
	myinit ();
	glutReshapeFunc (myReshape);
	glutDisplayFunc (displayd);
	glutMouseFunc (mouse);
	
	/* enter the main event loop */
	glutMainLoop();
	return 0;
}