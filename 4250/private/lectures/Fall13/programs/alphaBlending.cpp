/*
 *  alpha-blending.cpp
 *  This program draws overlapping filled polygons
 *  to demonstrate the effect ordering has on alpha blending results.
 *  Use the 't' key to toggle the order of drawing polygons.
 *
 *  alpha blending allows the GL primitives to be drawn with transparency.
 *  say alpha=0.6, for each pixel in that primitive, 60% of the color will be the specified color, 
 *  40% of the color comes from the color that is already there
 *  Therefore, the order of the primitives being drawn is important.
 * 
 */
#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

#include <cstdlib>
using namespace std;

//user function prototypes
void MyInit();
void DrawLeftTriangle();
void DrawRightTriangle();
void Draw();
void Reshape(int w, int h);
void Keyboard(unsigned char key, int x, int y);

//global vars
int leftFirst = GL_TRUE;
#define WIDTH 200
#define HEIGHT 200

/*  Main Loop
 *  Open window with initial window size, title bar, 
 *  RGBA display mode, and handle input events.
 */
int main(int argc, char** argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);
	glutInitWindowSize (WIDTH, HEIGHT);
	glutCreateWindow ("Alpha Blending");
	MyInit();
	glutReshapeFunc (Reshape);
	glutKeyboardFunc (Keyboard);
	glutDisplayFunc (Draw);
	glutMainLoop();
	
	return 0;
}

/*  Initialize alpha blending function.
 */
void MyInit()
{
	glClearColor(1, 1, 1, 0);
	glClear(GL_COLOR_BUFFER_BIT);
	glEnable (GL_BLEND);
	glBlendFunc (GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
	glShadeModel (GL_FLAT);
}

void DrawLeftTriangle()
{
	/* draw yellow triangle on LHS of screen */
	
	glBegin (GL_TRIANGLES);
	glColor4f(1.0, 1.0, 0.0, 1.0);  // alpha is 1.0, 100% opaque, no transparency
	glVertex3f(0.1, 0.9, 0.0); 
	glVertex3f(0.1, 0.1, 0.0); 
	glVertex3f(0.7, 0.5, 0.0); 
	glEnd();
}

void DrawRightTriangle()
{
	/* draw cyan triangle on RHS of screen */
	
	glBegin (GL_TRIANGLES);
	glColor4f(0.0, 1.0, 1.0, .5);  // alpha is 0.5, 50% transparency
	glVertex3f(0.9, 0.9, 0.0); 
	glVertex3f(0.3, 0.5, 0.0); 
	glVertex3f(0.9, 0.1, 0.0); 
	glEnd();
}

// Display Call back
void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT);
	
	if (leftFirst)				// initial draw
	{
		DrawLeftTriangle();
		DrawRightTriangle();
	}
	else {
		DrawRightTriangle();
		DrawLeftTriangle();
	}
	
	glFlush();
}

// Reshape call back
void Reshape(GLint w, GLint h)
{
	glViewport(0, 0, (GLsizei) w, (GLsizei) h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	if (w <= h) 
		gluOrtho2D (0.0, 1.0, 0.0, 1.0*(GLfloat)h/(GLfloat)w);
	else 
		gluOrtho2D (0.0, 1.0*(GLfloat)w/(GLfloat)h, 0.0, 1.0);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
}

// Keyboard call back
void Keyboard(unsigned char key, GLint x, GLint y)
{
	switch (key) {
		case 't':
		case 'T':
			leftFirst = !leftFirst;
			glutPostRedisplay();	
			break;
		case 27:  /*  Escape key  */
			exit(0);
			break;
		default:
			break;
	}
}

