// This is coded to study coordinate system transformation

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

#include <cmath>
using namespace std;
char mode='o';   // 'o' for original position, 't' for translation-rotation:

void DrawSquare();
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
	glutCreateWindow ("2D Transformation Practice 2");
	
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
	glClear (GL_COLOR_BUFFER_BIT);
	
	glPushMatrix();  // Start: this part needs original coordinate system
	glLoadIdentity();

	glColor3f (0.0, 0.0, 0.0);
	glBegin(GL_LINES);
	glVertex3f(-8, 0, 0); // indicate x-axis
	glVertex3f(8, 0, 0);
	glEnd();
	
	glBegin(GL_LINES);
	glVertex3f(0, -8, 0); // indicate y-axis
	glVertex3f(0, 8, 0);
	glEnd();
	
	// yellow square P3 on origin point -- call it square 0
	glColor3f (1.0, 1.0, 0.0);
	DrawSquare();
	
	// red square: square 0 translates and rotates to desired position
	glColor3f(1, 0, 0);
	glPushMatrix();
	glTranslated(2, 5, 1);
	glRotated(45, 0, 0, 1);
	DrawSquare();	
	glPopMatrix();
	glPopMatrix();   // End: this part needs original coordinate system
	
	// blue square centers at origin point -- call it square 1
	glColor3f (0.0, 0.0, 1.0);
	if (mode == 'o')
	{
		DrawSquare2();
	}
	else if	(mode == 't')
	{
		//glTranslated(3.5, 3.5, 1);
		DrawSquare2();
	}
	else if (mode == 'r')
	{
		//version 1
		/*
		glRotated(45, 0, 0, 1);
		DrawSquare2();
	
		
		//version 2
		
		glTranslated(-1.5, 1.5, 0);
		glRotated(45, 0, 0, 1);
		glTranslated(1.5, -1.5, 0);
		*/

		//version 3
		glTranslated(2+3*sqrt(2.0)/2, 5, 0);
		glRotated(45, 0, 0, 1);
		DrawSquare2();
		
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
	glFlush();
}

void DrawSquare()
{
	glBegin(GL_POLYGON);
	glVertex3f(0, 0, 0);
	glVertex3f(3, 0, 0);
	glVertex3f(3, -3, 0);
	glVertex3f(0, -3, 0);
	glEnd();
	glFlush();
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
	if (key == 't') 
	{
		mode='t';		
	}
	else if (key == 'r')
	{
		mode = 'r';
	}
	else if (key == 'o')
	{
		mode = 'o';
	}
	
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

