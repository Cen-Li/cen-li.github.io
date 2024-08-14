// Cen Li
// show openGL problem with concave polygon
//
// This program illustrates: 
// (1) how to draw circle
// (2) combining shapes to draw special symbol

#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

#include <cmath>
using namespace std;

// Define a constant for the value of PI
#define PI 3.1415f
#define Width 500
#define Height 500

void MyInit();
void Draw();

int main(int argc, char* argv[])
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB );

	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(400, 400); 

	glutCreateWindow("Polygonal Symbol");
	
	glutDisplayFunc(Draw);
	MyInit();
	glutMainLoop();
	
	return 0;
}

// set the background and foreground drawing color
void MyInit()
{
	// Black background
	glClearColor(1.0f, 1.0f, 1.0f, 1.0f );
	
	// Set drawing color 
	glColor3f(1.0f, 0.0f, 0.0f);
	
	glMatrixMode (GL_PROJECTION);    
	glLoadIdentity ();    
	gluOrtho2D(-4.0, 4.0, -4.0, 4.0);  	
}

void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT);
	GLfloat R=3, r=2;	
	// description of the symbol
	// based on two concentric parent circles pp 113

	// Set drawing color 
	glColor3f(0.0f, 0.0f, 1.0f);
	// draw a square
	glBegin(GL_POLYGON);
		glVertex3f(r/2, r/2, 0);
		glVertex3f(-r/2, r/2, 0);
		glVertex3f(-r/2, -r/2, 0);
		glVertex3f(r/2, -r/2, 0);
	glEnd();
	
	// draw 4 spikes
	glColor3f(1.0f, 0.0f, 1.0f);
	glBegin(GL_TRIANGLES);
		glVertex3f(R, 0, 0);
		glVertex3f(r/2, r/2, 0);
		glVertex3f(r/2, -r/2, 0);
	glEnd();
	
	glBegin(GL_TRIANGLES);
		glVertex3f(r/2, r/2, 0);
		glVertex3f(0, R, 0);
		glVertex3f(-r/2, r/2, 0);
	glEnd();

	glBegin(GL_TRIANGLES);
		glVertex3f(-r/2, r/2, 0);
		glVertex3f(-R, 0, 0);
		glVertex3f(-r/2, -r/2, 0);
	glEnd();

	glBegin(GL_TRIANGLES);
		glVertex3f(-r/2, -r/2, 0);
		glVertex3f(0, -R, 0);
		glVertex3f(r/2, -r/2, 0);
	glEnd();
	
	glFlush();
}

