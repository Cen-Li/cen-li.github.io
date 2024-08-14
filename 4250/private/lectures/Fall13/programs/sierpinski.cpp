//
//  Sierpinski
//
// This program produces a drawing of the Sierpinski gasket.
// This is an interesting shape that has a long history
// and that is of interest in areas such as fractal geometry.
// 
// There is no user input.
//
// The expected output is a drawing of the Sierpinski gasket.
//
// To exit the program, the user must close the window in which
// the Sierpinski gasket was drawn.
// 
// This program is very limited in capability. There is no color
// and the user is not allowed to interact at all.  It does produce
// the picture of the Sierpinski gasket.
//
///////////////////////////////////////////////////////////////////////
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

#include <cstdlib>
using namespace std;

#define Width 500
#define Height 500

// function prototypes
void MyInit();
void DrawSierpinski();

///////////////////////////////////////////////////////////////////////
// Function Name:  main()
//
// Preconditions:  There are none.
//
// Postconditions: This function initializes glut (and thus OpenGL).  
// It registers appropriate callbacks to produce a Sierpinski gasket
// in the window created by glut.
//
///////////////////////////////////////////////////////////////////////
int main(int argc, char** argv)
{
	
	//initialize the OpenGL Utility Toolkit
	glutInit(&argc, argv);	
	
	//set the display mode--a single display buffer and colors
	//specified using amounts of red, green, & blue
	glutInitDisplayMode( GLUT_SINGLE | GLUT_RGB);
	
	//request a screen window 500 pixels wide by 500 pixels high
	glutInitWindowSize(Width, Height);
	
	//specify the window position 
	glutInitWindowPosition(100,100);
	
	//open and display the window putting "Sierpinski Gasket" on
	//the title bar
	glutCreateWindow("Sierpinski Gasket");
	
	//register the drawSierpinski() function as the function to
	//activate when a redraw event occurs.
	glutDisplayFunc(DrawSierpinski);
	
	//set up the initial state of some of OpenGL's variables
	MyInit();
	
	//enter an unending loop waiting from events to occur
	glutMainLoop();
	return 0;
}

///////////////////////////////////////////////////////////////////////
//
// Function Name:  MyInit()
//
// Preconditions:  Prior to this function, glut should already be 
// initialized and the window information should be set.
//
// Postconditions: This function sets the drawing colors and the world
// to window transformation.
//
///////////////////////////////////////////////////////////////////////
void MyInit()
{
	glClearColor (1.0, 1.0, 1.0, 1.0);			//set the background color to white
	glColor3f (0.0, 0.0, 1.0); 					//set the foreground color to blue
	glPointSize (3.0);							//set the point size to 3 X 3 pixels
	
	//set up a world window to screen transformation
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity();
	gluOrtho2D(0.0, Width, 0.0, Height);// define clipping window
	
}

///////////////////////////////////////////////////////////////////////
//
// Function Name: DrawSierpinski()
// 
// Preconditions:  Glut should already be initialized and the window 
// information should be set.  This function should be registered as 
// a callback for a redraw event.
//
// Postconditions: This function draws the Sierpinski gasket in the 
// active window when it is called which is anytime the window is 
// redrawn.
///////////////////////////////////////////////////////////////////////
void DrawSierpinski()
{
	// define a point data type
	typedef GLfloat point2[2];
	
	//define the vertices of the outer most triangle in terms of vectors
	point2 vertices[3] = {{0.0, 0.0}, {250.0, 500.0}, {500.0, 0.0}};
	
	//define indices to be used in the loops
	GLint j, k;
		
	//define an initial point at random inside the triangle
	//point2 p = {75.0, 50.0};
	point2 p = {40.0, 0.0};
	
	//clear the screeen
	glClear(GL_COLOR_BUFFER_BIT);
	
	//compute and plot 50000 new points by selecting a point
	//halfway between the initial point and a randomly selected vertex.
	
	for (k = 0; k < 50000; k++)
	{
		j = rand() % 3;		//pick a vertex at random
		
		//compute the point halfway between selected vertex & old point
		p[0] = (p[0] + vertices[j][0]) / 2.0;
		p[1] = (p[1] + vertices[j][1]) / 2.0;
		
		// plot new point 
		glBegin (GL_POINTS);
		glVertex2fv(p);
		glEnd();
	}
	
	glFlush();				//send all output to the display immediately
}
