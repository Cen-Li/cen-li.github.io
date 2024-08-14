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
	glColor3f(0.0f, 0.0f, 1.0f);
	
	glMatrixMode (GL_PROJECTION);    
	glLoadIdentity ();    
	gluOrtho2D(-4.0, 4.0, -4.0, 4.0);  	
}

void Draw()
{
	GLfloat R=1.0, r=1./3;
	glClear(GL_COLOR_BUFFER_BIT);
	GLint n=6;

	GLfloat alpha = 2*PI/(2*n);

	// description of the symbol
	// based on two concentric parent circles pp 113
	// outer circle radius=1, inner circle radiue=1/3
	
	// first try 1
	/*
	 glBegin(GL_POLYGON);
	 for (GLint i=0; i<2*n; i+=2)
	 {
		// point from inner circle
		glVertex2f(r*cos(i*alpha), r*sin(i*alpha));
		
		// point from outer circle
		glVertex2f(R*cos((i+1)*alpha), R*sin((i+1)*alpha));
	 }*/
	 
	 glBegin(GL_LINE_LOOP);
	 for (GLint i=0; i<2*n; i+=2)
	 {
		// point from inner circle
		glVertex2f(r*cos(i*alpha), r*sin(i*alpha));
		
		// point from outer circle
		glVertex2f(R*cos((i+1)*alpha), R*sin((i+1)*alpha));
	 }
	 glEnd(); 

	 n=50; // number of segments
	glBegin(GL_LINE_LOOP);
	glVertex3f(R, 0, 0);
	for (GLint i=0; i<n; i++)
	{
		glVertex3f(R*cos(1.0*i/n*2*PI), R*sin(1.0*i/n*2*PI), 0);
		glVertex3f(R*cos(1.0*(i+1)/n*2*PI), R*sin(1.0*(i+1)/n*2*PI), 0);
	}
	glEnd();
	
	glFlush();
}

