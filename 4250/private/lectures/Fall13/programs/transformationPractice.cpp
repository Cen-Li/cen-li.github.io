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

char mode='o';   // 'o' for original position, 'r' for rotation-translation, 't' for translation-rotation:

void DrawSquare();
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
	glClear (GL_COLOR_BUFFER_BIT);
	
	glColor3f (0.0, 0.0, 0.0);

	glBegin(GL_LINES);
	glVertex3f(-8, 0, 0); // indicate x-axis
	glVertex3f(8, 0, 0);
	glEnd();
	
	glBegin(GL_LINES);
	glVertex3f(0, -8, 0); // indicate y-axis
	glVertex3f(0, 8, 0);
	glEnd();

	if (mode == 'o')
	{
		DrawSquare();
	}
	else if	(mode == 'r')
	{
		glPushMatrix();
	
		glRotated(45, 0, 0, 1);
		glTranslated(2, 5, 1);
		DrawSquare();
	
		glPopMatrix();
	}
	else if (mode == 't')
	{
		
		glPushMatrix();
		glTranslated(2, 5, 1);
		glRotated(45, 0, 0, 1);
		DrawSquare();
	
		glPopMatrix();
	}
	glFlush();

}

void DrawSquare()
{
	glColor3f (0.0, 0.0, 1.0);
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
	if (key == 'r') // rotate first translate next
	{
		mode='r';
		
	}
	else if (key == 't')  // translate first, rotate next
	{
		mode='t';
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

