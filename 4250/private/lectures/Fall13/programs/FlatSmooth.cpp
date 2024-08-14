
/*
 *  flat-smooth.cpp
 *  This program draws overlapping filled polygons
 *  to demonstrate the effect of flat vs. smoothing shading
 *
 *  alpha blending allows the GL primitives to be drawn with transparency.
 *  alpha = 0 --> total transparency
 *  alpha = 1 --> total opaque
 *  say alpha=0.6, for each pixel in that primitive, 60% of the color will be the specified color, 
 *  40% of the color comes from the color that is already there
 *  Therefore, the order of the primitives being drawn is important.
 *                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * 
 */
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include <GLUT/glut.h>
#include <cstdlib>
using namespace std;

//user function prototypes
void MyInit();
void DrawLeftTriangle();
void DrawLeftTriangleBlend();
void DrawRightTriangleSmooth();
void DrawRightTriangleSmoothBlend();
void Draw();
void Reshape(int w, int h);
void Keyboard(unsigned char key, int x, int y);
void DrawMiddleRectangle();

//global vars
#define WIDTH 500
#define HEIGHT 500

/*  Main Loop
 *  Open window with initial window size, title bar, 
 *  RGBA display mode, and handle input events.
 */
int main(int argc, char** argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode (GLUT_SINGLE | GLUT_RGBA);  
	// vs. 
	// glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);
	glutInitWindowSize (WIDTH, HEIGHT);
	glutCreateWindow ("Shading mode");
	
	MyInit();
	glutReshapeFunc (Reshape);
	glutKeyboardFunc (Keyboard);
	glutDisplayFunc (Draw);
	
	glutMainLoop();
	
	return 0;
}

void MyInit()
{
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	
	//glClearColor(1, 1, 1, 0);
	glClearColor(0.8, 0.6, 0.5, 0.6);
}

void DrawLeftTriangle()
{
	// draw yellow triangle on LHS of screen 
	glShadeModel(GL_FLAT);

	//glColor3f(1.0, 1.0, 0.0); 
	// what if the flat triangle is transparent
	glColor4f(1.0, 1.0, 0.0, 0.5);
	
	glBegin (GL_TRIANGLES);
	glVertex3f(0.1, 0.9, 0.0); 
	glVertex3f(0.1, 0.1, 0.0); 
	glVertex3f(0.7, 0.5, 0.0); 
	glEnd();

}

void DrawLeftTriangleBlend()
{
	// draw yellow triangle on LHS of screen 
	glShadeModel(GL_FLAT);
	glEnable (GL_BLEND); // enable color blending
	glBlendFunc (GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA); // selecting blending method
	
	//glColor3f(1.0, 1.0, 0.0); 
	// what if the flat triangle is transparent
	glColor4f(1.0, 1.0, 0.0, 0.5);  //experiment with alpha=0, 1, or 0.5...
	
	glBegin (GL_TRIANGLES);
	glVertex3f(0.1, 0.9, 0.0); 
	glVertex3f(0.1, 0.1, 0.0); 
	glVertex3f(0.7, 0.5, 0.0); 
	glEnd();
	glDisable(GL_BLEND);
}

void DrawMiddleRectangle()
{
	glColor3f(0.5, 0.8, 0.4);
	glRectf(0.45, 0.3, 0.7, 0.7);
}

void DrawRightTriangleSmoothBlend()
{
	// draw smooth shading triangle on the right side of screen
	glShadeModel(GL_SMOOTH);
	glEnable (GL_BLEND); // enable color blending
	glBlendFunc (GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA); // selecting blending method
	
	glBegin(GL_TRIANGLES);
	glColor4f(1.0, 0, 0, 0.);   // adding alpha values
	glVertex3f(0.9, 0.9, 0.0); 
	glColor4f(0, 1, 0, 0.5);
	glVertex3f(0.3, 0.5, 0.0); 
	glColor4f(0, 0, 1, 0.5);
	glVertex3f(0.9, 0.1, 0.0); 
	glEnd();
	
	glDisable (GL_BLEND); // enable color blending
}

void DrawRightTriangleSmooth()
{
	// draw smooth shading triangle on the right side of screen
	glShadeModel(GL_SMOOTH);

	glBegin(GL_TRIANGLES);
	glColor3f(1.0, 0, 0);
	glVertex3f(0.9, 0.9, 0.0); 
	glColor3f(0, 1, 0);
	glVertex3f(0.3, 0.5, 0.0); 
	glColor3f(0, 0, 1);
	glVertex3f(0.9, 0.1, 0.0); 
	glEnd();
}


// Display Call back
void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT);
	
	// experiment with the color effects by:
	//  - changing the order of the drawing sequence
	//  - changing the drawing routines
	DrawMiddleRectangle();
	DrawLeftTriangle();
	//DrawLeftTriangleBlend();
	//DrawRightTriangleSmooth();
	//DrawRightTriangleSmoothBlend();
	
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
		case 'q':
		case 27:  /*  Escape key  */
			exit(0);
			break;
		default:
			break;
	}
}

