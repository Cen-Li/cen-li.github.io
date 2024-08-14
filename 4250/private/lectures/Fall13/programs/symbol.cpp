// Cen Li
// show openGL problem with concave polygon
//
// This program illustrates: 
// (1) how to draw circle
// (2) combining shapes to draw special symbol

#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include <GLUT/glut.h>
#include <cmath>
using namespace std;

// Define a constant for the value of PI
#define PI 3.1415f
void MyInit();
void Draw();

int main(int argc, char* argv[])
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB );
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
	
	// description of the symbol
	// based on two concentric parent circles pp 113
	// outer circle radius=1, inner circle radiue=1/3
	
	/* Trial 1:    GL can not draw concave polygon properly!!!! */
	 glBegin(GL_POLYGON);
	 GLint n=4;
	 for (GLint i=0; i<n; i++)
	 {
		// point from outer circle
		glVertex2f(cos(1.0*i/n*2*PI), sin(1.0*i/n*2*PI));
	 
		// point from inner circle
		glVertex2f(1.0/3*cos(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI), 1.0/3*sin(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI));
	 }
	 glVertex2f(1.0, 0.0);
	 glEnd(); 
	
	/* Trial 2:
	 try draw 4 triangles and then draw the center circle 
	GLint n=4;
	for (GLint i=0; i<n; i++)
	{
		glBegin(GL_TRIANGLES);
		glVertex3f(1.0/3*cos(1.0*i/n*PI*2-1.0/2*1.0/n*2*PI), 1.0/3*sin(1.0*i/n*PI*2-1.0/2*1.0/n*2*PI), 0);
		
		// point from outer circle
		glVertex3f(cos(1.0*i/n*2*PI), sin(1.0*i/n*2*PI), 0);
	    
		// point from inner circle
		glVertex3f(1.0/3*cos(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI), 1.0/3*sin(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI), 0);
		glEnd();
	} */
	
	// draw the circle in the middle
	n=20;
	for (GLint i=0; i<n; i++)
	{
		glBegin(GL_TRIANGLE_FAN);
		glVertex3f(0, 0, 0);
		glVertex3f(1.0/3*cos(1.0*i/n*2*PI), 1.0/3*sin(1.0*i/n*2*PI), 0);
		glVertex3f(1.0/3*cos(1.0*(i+1)/n*2*PI), 1.0/3*sin(1.0*(i+1)/n*2*PI), 0);
		glEnd();
	}
	
	glFlush();
}

