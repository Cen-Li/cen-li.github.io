/////////////////////////////////////////////////////////////////
// File:        hexswirl.cpp
//
// The purpose of this program is to demonstrate a ZoomIn effect and to
// further illustrate the glOrtho2D function
//
// The program draws a hexigon "swirl" and then when the user
// presses key 'a','z', 's', it zooms in on a portion of the beginning picture 
// by resetting the window 10 times. 
// When the user press a key other than 'a', 'z', 's' or'q',
// the image is  zoomed-in one step. A user may continuously press the key to gradually
// zoom in on the image. After some point, the zooming direction will be reversed. When
// the user continues to press the key, the zoom out effect will start.
//
// Input to the program includes pressing 'a', 'z', and 's' to cause the zoom
// in effect to start; pressing 'q' to terminate the program, pressing other key to zoom
// in or out, one step at a time. 
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
void Zoom(unsigned char key, int x, int y);

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
	
	//register the ZoomIn() function as the function to
	//activate when any key on the keyboard is pressed.
	glutKeyboardFunc(Zoom);
	
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
	gluOrtho2D(-5.0, 5.0, -5.0, 5.0);
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
void Zoom(unsigned char key, int x, int y)
{
	GLfloat cx = 0.0, cy = 0.0;//each world window is centered about (cx, cy)
	GLfloat h=1.2, w = 1.2;	//the width and height of the window
	GLint NumFrames = 10;		//the number of frames in the animation
	
	if (key == 'q')  // press 'q' to quit the window
	{
		exit(0);
	}
	else if (key == 'a')  // press key 'a' for animation
	{
		//this loop controls the animation, drawing a hexagon swirl
		//on each successive frame.
		for (GLint frame = 0; frame < NumFrames; frame++)
		{
			// draw the hexagon swirl
			gluOrtho2D (cx - w, cx + w, cy - h, cy + h);
			HexSwirl();
			
			//shrink the world window
			w *= 0.9;
			h *= 0.9; 
			
			//the lazy man's time delay
			for (GLint i = 0; i <= 300000000; i++);
		}
	}  // end if
	else if (key == 'z') // a second version of the animation for the zooming effect
	{
		//this loop controls the animation, drawing a hexagon swirl
		//on each successive frame.
		for (GLint frame = 0; frame < NumFrames; frame++)
		{
			//change the width and height of the window each time
			w *= 0.9;
			h *= 0.9; 
			
			glPushMatrix();
			glMatrixMode (GL_PROJECTION);
			glLoadIdentity();
			
			gluOrtho2D (cx - w, cx + w, cy - h, cy + h);
			
			HexSwirl();
			glPopMatrix();
			
			//the lazy man's time delay
			for (int i = 0; i <= 300000000; i++);
		}
	}
	else if (key == 's') // third version, "special version" to illustrate 
	// the underpinning of matrix multiplication involved in opengl
	{
		//this loop controls the animation, drawing a hexagon swirl
		//on each successive frame.
		for (GLint frame = 0; frame < NumFrames; frame++)
		{
			gluOrtho2D (-0.5, 0.5, -0.5, 0.5);
			HexSwirl();
			
			//the lazy man's time delay
			for (GLint i = 0; i <= 300000000; i++);
		
		}
	}
	else // for all other keys, stepwise zooming effect is provided
		// first zooming in when deltaX >0 and deltaY> 0
		// then, zooming out when deltaX < 0 and deltaY < 0
	{
		static GLfloat deltaX=1.2, deltaY=1.2;
		
		glPushMatrix();
		glMatrixMode (GL_PROJECTION);
		glLoadIdentity();

		gluOrtho2D(cx-deltaX, cx+deltaX, cy-deltaY, cy+deltaY);
		
		HexSwirl();
		glPopMatrix();
		
		deltaX -= 0.05;
		deltaY -= 0.05;
	}
}
