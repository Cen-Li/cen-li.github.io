/*
 
 The purpose of this program is to demonstrate 2D transformations. 
 
 Input to the program comes from the keyboard.  Either an i, r, R, s, S, t,
 p, or P cause the program to perform some transformation.
 
 Tips:  The following keys perform the associated action:
 i -- load the identity matrix (restore the original image)
 r -- rotate by 10 degrees about the origin
 R -- rotate by 30 degrees about the lower left corner of the rectangle
 s -- scale by 1/2 about the origin
 S -- scale by 2 about the origin
 L -- scale by 1/2 about the lower left corner of the rectangle
 t -- translate by 2 in x
 p -- push onto the matrix stack
 P -- pop from the matrix stack
 
 */

#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

void DrawBackgroundSquare();
void Displays();
void Myinit();
void MyReshape (int w, int h);
void Keyboard (unsigned char key, int x, int y);

int main (int argc, char** argv)
{
	/* create a single buffered window */
	glutInit (&argc, argv);
	glutInitDisplayMode (GLUT_DOUBLE| GLUT_RGB);
	glutCreateWindow ("2D Transformations");
	
	/*initialize the window, set the display, reshape,
	 idle, and mouse callbacks for this window */
	glutReshapeFunc (MyReshape);
	glutDisplayFunc (Displays);
	glutKeyboardFunc (Keyboard);
	
	Myinit ();
	
	/* enter the main event loop */
	glutMainLoop();
}

/* This draws a yellow square in the background.
 It pushes matrices and attributes so that
 any changes made by this method will not
 affect the square that rotates.
 */
void DrawBackgroundSquare()
{
	//push the modelview matrix
	glPushMatrix();
	
	//push all other attributes
	glPushAttrib(GL_ALL_ATTRIB_BITS);
	
	//set the color to yellow
	glColor3f (1.0, 1.0, 0.0);
	
	//set the modelview matrix to the identity
	glLoadIdentity();
	
	//draw the background square
	glRectf (-30.0, -30.0, 30.0, 30.0);
	
	//pop previous attributes and modelview matrix
	glPopAttrib();
	glPopMatrix();
}

/* This is the display callback for the window.  
 It clears the buffer and then draws a rectangle. */
void Displays()
{
	glClear (GL_COLOR_BUFFER_BIT);
	
	DrawBackgroundSquare();
	glRectf (-25.0, -25.0, 25.0, 25.0);
	glutSwapBuffers();
	glFlush();
}


/* This function initializes the background color to black
 and the drawing color to white. */
void Myinit()
{
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glColor3f (1.0, 1.0, 1.0);
	glFlush();
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
		gluOrtho2D (-50.0, 50.0, -50.0 * (GLfloat)h/(GLfloat)w,
					50.0 * (GLfloat) h/(GLfloat)w);
	else
		
		gluOrtho2D (-50.0 * (GLfloat)w/(GLfloat)h, 
					50.0 * (GLfloat)w/(GLfloat)h, -50.0, 50.0);
	glMatrixMode (GL_MODELVIEW);
	glLoadIdentity();
	glFlush();
}

//This function is the keyboard callback.  It
//allows the user to explore rotations, scales,
//and translations as well as using the matrix stack.  
void Keyboard (unsigned char key, int x, int y)
{
	//Perform a translation in x
	if (key == 't')
	{
		glTranslatef(2.0, 0.0, 0.0);
	}
	//Perform a 10 degree rotation about the origin
	//(Really about the z axis)
	else if (key == 'r')
	{
		glRotatef(10, 0.0, 0.0, 1.0);
	}
	//Perform a scalei about the origin
	else if (key == 's')
	{
		glScalef(.5, .5, 1.0);
	}
	else if (key == 'S')
	{
		glScalef(2.0, 2.0, 1.0);
	}
	//Reset all transformations
	else if (key == 'i')
	{
		glLoadIdentity();
	}
	//Perform a 30 degree rotation about
	//the lower left corner of the rectangle
	else if (key == 'R')
	{
		// The translate temporarily moves the center of 
		// the rotation (0, 0) to (-25, -25)--the 
		// left corner. perform the rotation, 
		// then moves the center of the square back to (0, 0)
		glTranslatef(-25.0, -25.0, 0.0);
		glRotatef (30.0, 0.0, 0.0, 1.0);
		glTranslatef (25.0, 25.0, 0.0);
	}
	//Perform a scale about the lower left
	//corner of the rectangle
	else if (key == 'L')
	{
		glTranslatef(-25.0, -25.0, 0.0);
		glScalef (.75, .75, 0.0);
		glTranslatef (25.0, 25.0, 0.0);
	}
	//Push onto the matrix stack
	else if (key == 'p')
	{
		glPushMatrix();
	}
	//Pop from the matrix stack
	else if (key == 'P')
	{
		glPopMatrix();
	}
	glutPostRedisplay();

}
