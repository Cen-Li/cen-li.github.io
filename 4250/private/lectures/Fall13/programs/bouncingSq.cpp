//
//  bouncingSq.cpp
//
// Demonstrates a simple animated rectangle program with GLUT
// OpenGL SuperBible, 3rd Edition
//
// modified Fall 2011 - C. Li
//
// The world window for this app is -100, 100, -100, 100
// after reshaping of the window, the world window will change accordingly, keeping the same aspect ratio
// 

// Header File For The GLut Library
#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>
		
// Initial square position and size
GLfloat x = 0.0f;     // starting location of square
GLfloat y = 0.0f;
GLfloat rsize = 25;   // size of the square

// Step size in x and y directions
// (number of pixels to move each time)
GLfloat xstep = 1.0f;
GLfloat ystep = 1.0f;

#define WIDTH 800
#define HEIGHT 600

// Keep track of windows changing width and height, initially 100
GLfloat windowWidth=100; 
GLfloat windowHeight=100;

// user function prototypes
void MyReshape(int w, int h);
void Draw();
void TimerFunction(int value);
void MyInit();

///////////////////////////////////////////////////////////
// Main program entry point
int main(int argc, char* argv[])
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
	glutInitWindowSize(WIDTH,HEIGHT);
	glutCreateWindow("Bouncing Square");
	glutDisplayFunc(Draw);
	glutReshapeFunc(MyReshape);
	glutTimerFunc(30, TimerFunction, 1);
	
	MyInit();
	
	glutMainLoop();
	
	return 0;
}


///////////////////////////////////////////////////////////
// Setup the rendering state
void MyInit()
{
	glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
	
	gluOrtho2D(-100.0, 100.0, -100.0, 100.0);
	
    // Set clear/background color to blue
    glClearColor(0.0f, 0.0f, 1.0f, 1.0f);
	
	glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
	
}

///////////////////////////////////////////////////////////
// Called to draw scene
void Draw()
{
	// Clear the window with current clearing color
	glClear(GL_COLOR_BUFFER_BIT);
	
   	// Set current drawing color to red
	//		   R	 G	   B
	glColor3f(1.0f, 0.0f, 0.0f);
	
	// Draw a filled rectangle with current color
	// x,y top left corner, (x+rsize, y-rsize) lower right corner
	glRectf(x, y, x + rsize, y - rsize);
	
	// Flush drawing commands and swap
	glutSwapBuffers();
}

///////////////////////////////////////////////////////////
// Called by GLUT library when idle (window not being
// resized or moved)
// Timer call back function
void TimerFunction(int value)
{
	// Actually move the square
    x += xstep;
    y += ystep;
	
    // Reverse direction when it reaches left or right edge
    if(x > windowWidth-rsize || x < -windowWidth)
        xstep = -xstep;
	
    // Reverse direction when you reach top or bottom edge
    if(y > windowHeight || y < -windowHeight + rsize)
        ystep = -ystep;
	
    // Check bounds
	if(x > (windowWidth-rsize))
        x = windowWidth-rsize - 1;
	else if(x < -(windowWidth))
		x = -windowWidth + 1;			// Question Line
	
	if(y > (windowHeight))
        y = windowHeight - 1; 
	else if(y < -windowHeight + rsize)
		y = -windowHeight + rsize + 1;		// Question Line
	
	// Redraw the scene with new coordinates every 20 milliseconds
    glutPostRedisplay();
	
	// important!! otherwise timer function is not called again
    glutTimerFunc(20,TimerFunction, 1);
}


///////////////////////////////////////////////////////////
// Called by GLUT library when the window has chanaged size
void MyReshape(int w, int h)
{
    GLfloat aspectRatio;
	
    // Prevent a divide by zero
    if(h == 0)
        h = 1;
	
    // Set Viewport to window dimensions
    glViewport(0, 0, w, h);
	
    // Reset coordinate system
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
	
    // Establish clipping volume (left, right, bottom, top, near, far)
    aspectRatio = (GLfloat)w / (GLfloat)h;
    if (w <= h) 
	{
        windowWidth = 100;
        windowHeight = 100 / aspectRatio;
        gluOrtho2D (-100.0, 100.0, -windowHeight, windowHeight);
	}
    else 
	{
        windowWidth = 100 * aspectRatio;
        windowHeight = 100;
        gluOrtho2D (-windowWidth, windowWidth, -100.0, 100.0);
	}
	
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}