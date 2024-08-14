// Cen Li
//
// This program illustrates: 
// (1) the effect or glOrtho2D on selecting the portion of image to display
// (2) the relationship between the window dimension defined by glOrtho and viewport

#define MAC

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

// Define a constant for the value of PI
#define PI 3.1415f

#define Width 500     // width 0f the square window
#define Height 500    // height of the square window
//#define  Height  400	// dimension of the rectangle window
//#define  Width   647    // 647/400=1.816  (golden ratio)


void MyInit();
void Draw();

int main(int argc, char* argv[])
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB );
	
	glutInitWindowSize(Width,Height); // define the dimension of the window
	glutInitWindowPosition(400, 200); 
	
	glutCreateWindow("From World Coordinate to Windows to Viewport");
	
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
	gluOrtho2D(-4.0, 4.0, -4.0, 4.0);  	// version 1
	//gluOrtho2D(-1.0, 1.0, -1.0, 1.0);	// version 2
	//gluOrtho2D(-15, 15, -15, 15);		// version 3
	
	//glViewport(0, 0, Width, Height/2.0);		// does not have effects when placed here
}

void Draw()
{
	GLfloat R=3.0, r=1.0;
	glClear(GL_COLOR_BUFFER_BIT);
	GLint n=6;
	
	GLfloat alpha = 2*PI/(2*n);
	
	glViewport(0, 0, Width-100, Height-100); // version 4: location
	// glViewport(173, 50, 300, 300);		// version 5: 300 x 300 in the middle 	
	// glViewport(0, 0, 400, 200);		// version 6: aspect ratio 
	
	// draw the inner polypone line shape
	glBegin(GL_LINE_LOOP);
	for (GLint i=0; i<2*n; i+=2)
	{
		// point from inner circle
		glVertex2f(r*cos(i*alpha), r*sin(i*alpha));
		
		// point from outer circle
		glVertex2f(R*cos((i+1)*alpha), R*sin((i+1)*alpha));
	}
	glEnd(); 
	
	// draw the outer circle
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

