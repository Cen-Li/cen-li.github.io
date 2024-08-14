// Cen Li
// show openGL problem with concave polygon
//
// This program illustrates: 
//  how to draw circle


#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

#include <cmath>
using namespace std;

#define Width 500
#define Height 500

// Define a constant for the value of PI
#define PI 3.1415f
void MyInit();
void Draw();

int main(int argc, char* argv[])
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB );
	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(400,400);

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
	glColor3f(0.0f, 1.0f, 1.0f);
	
	glMatrixMode (GL_PROJECTION);    
	glLoadIdentity ();    
	gluOrtho2D(-4.0, 4.0, -4.0, 4.0);  	
}

void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT);
	GLint n=50;
	GLfloat radius = 3.0;

	glBegin(GL_TRIANGLE_FAN);
	glVertex3f(0, 0, 0);
	for (GLint i=0; i<n; i++)
	{
		glVertex3f(radius*cos(1.0*i/n*2*PI), radius*sin(1.0*i/n*2*PI), 0);
		glVertex3f(radius*cos(1.0*(i+1)/n*2*PI), radius*sin(1.0*(i+1)/n*2*PI), 0);
	}
	glEnd();
	
	glFlush();
}

