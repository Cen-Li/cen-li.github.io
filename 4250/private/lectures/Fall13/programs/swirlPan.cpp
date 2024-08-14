/////////////////////////////////////////////////////////////////
// File:        hexswirl.cpp
//
// The purpose of this program is to demonstrate a Panning effect 
//
// The program draws a hexigon "swirl" and then when the user
// presses key <-, ->, ^, v keys, pan camera to left, right, up and down
//
// Output includes the hexigon "swirl".
//
// Tips: To exit the program, the user must press key 'q'.
//
/////////////////////////////////////////////////////////////////
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

#include <cstdlib>
#include <cmath>
#include <iostream>
using namespace std;

#define PI 3.1415926f

void HexSwirl();
void MyInit();
void SpecialKeyHandle(int key, int x, int y);
void NormalKeyHandle(unsigned char key, int x, int y);

//set the width and height of the screen window
#define screenWidth 500
#define screenHeight 500

int main(int argc, char** argv)
{
	//initialize the OpenGL Utility Toolkit
	glutInit(&argc, argv);	
	
	//set the display mode--a double display buffer and colors
	//specified using amounts of red, green, & blue
	glutInitDisplayMode( GLUT_DOUBLE | GLUT_RGB);
	
	//request a screen window 500 pixels wide by 500 pixels high
	glutInitWindowSize(screenWidth, screenHeight);
	
	//specify the window position 
	glutInitWindowPosition(0,0);
	
	//open and display the window putting "Hexagon Swirl" on
	//the title bar
	glutCreateWindow("Hexagon Swirl");
	
	//register the HexSwirl() function as the function to
	//activate when a redraw event occurs.
	glutDisplayFunc(HexSwirl);
	
	glutKeyboardFunc(NormalKeyHandle);
	//register the SpecialKeyHandle() function as the function to
	//activate when any function key on the keyboard is pressed.
	glutSpecialFunc(SpecialKeyHandle);
	
	
	//set up the initial state of some of OpenGL's variables
	MyInit();
	
	//enter an unending loop waiting from events to occur
	glutMainLoop();
	
	return 0;
}

/////////////////////////////////////////////////////////////////
// Function:  MyInit()
// This function handles all initialization of OpenGL.
/////////////////////////////////////////////////////////////////
void MyInit()
{
	glClearColor (1.0, 1.0, 0.0, 1.0);//set the background color to yellow	
	glColor3f (0.0, 0.0, 1.0); 	//set the foreground color to blue
	glLineWidth(1.0);		//set the width of the lines to 1 pixels

	//set up a world window to screen transformation
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity();
	gluOrtho2D(-4.0, 4.0, -5.0, 5.0);
}

/////////////////////////////////////////////////////////////////
// Function: HexSwirl()
// This draws a hexagon on the screen many times.  Each new
// hexagon is slightly bigger than the previous one and rotated
// slightly so that a hexagon "swirl" is drawn.
/////////////////////////////////////////////////////////////////
void HexSwirl()
{
	double angle;			//the angle of rotation
	double angleInc = 2*PI/6;	//the angle increment
	double inc = 5.0/100;		//the radius increment
	double radius = 5.0/100;	//the starting radius to be used
	
	//clear the background
	glClear (GL_COLOR_BUFFER_BIT);
	
	//draw the hexagon swirl
	for (int j = 0; j <= 100; j++)
	{
		//the angle of rotation depends on which hexagon is being drawn.
		angle = j * (PI/180);
		
		//draw one hexagon
		glBegin (GL_LINE_LOOP);
		for (int k=0; k < 6; k++)
		{
			angle += angleInc;
			glVertex2d(radius * cos(angle), radius *sin(angle));
		}
		glEnd();
		
		//determine the radius of the next hexagon
		radius += inc;
	}
	
	//swap buffers for a smooth change from one frame to another
	glutSwapBuffers();
}

/////////////////////////////////////////////////////////////////
// Function: Zoom()
// This function draws several frames.  Each frame draws the
// same hexagon swirl but before drawing it, the world
// window is changed so that a new portion of the swirl is viewed.
/////////////////////////////////////////////////////////////////
void SpecialKeyHandle(int key, int x, int y)
{
	GLfloat deltaX=0.05, deltaY=0.05;
	static GLfloat left=-4, right=4, top=5, bottom=-5; 

	switch (key)
	{
		case GLUT_KEY_LEFT:
			left -= deltaX;
			right -= deltaX;
			break;
			
		case GLUT_KEY_RIGHT:
			left += deltaX;
			right += deltaX;
			break;
			
		case GLUT_KEY_UP:
			top += deltaY;
			bottom += deltaY;
			break;
			
		case GLUT_KEY_DOWN:
			top -= deltaY;
			bottom -= deltaY;
			break;
	}
	
	glPushMatrix();
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity();

	gluOrtho2D(left, right, bottom, top);
	
	HexSwirl();
	glPopMatrix();
}

void NormalKeyHandle(unsigned char key, int x, int y)
{
	if (key =='q')
		// press 'q' to quit the window
		exit(0);
}