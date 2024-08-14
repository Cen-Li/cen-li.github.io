//
//  spiral.cpp
//  Spiral curves
//
//  Created by Cen Li on 9/3/12.
//
//
// Spiral is drawn with the parametric curve
//         x = K * theta * cos(theta) and 
//         y = K * theta * sin(theta)
//
// There is no user input.
//
// The expected output is a drawing of the parametric curves.
//
// To exit the program, the user must close the window in which
// the function was drawn.
// 
///////////////////////////////////////////////////////////////////////

//Global variables
#include <OpenGL/gl.h>		// Header File For The OpenGL32 Library
#include <OpenGL/glu.h>		// Header File For The GLu32 Library
#include <GLUT/glut.h>		// Header File For The GLut Library
#include <ctime>
#include <cmath>
#include <iostream>
#include <cstdlib>
using namespace std;

GLint n;                    //2n is number of petals on the rose


///////////////////////////////////////////////////////////////////////
//
// The purpose of myinit() is to set up the colors for the background
// and foreground and to initialize appropriate matrices.
//
///////////////////////////////////////////////////////////////////////
void myinit()
{
	glClearColor (1.0, 1.0, 1.0, 1.0);			//set the background color to white	
	glColor3f (0.0, 0.0, 0.0); 					//set the foreground color to black
	
	//set up a world window to screen transformation
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity();
	gluOrtho2D(-10.0, 10.0, -10.0, 10.0);
	glMatrixMode (GL_MODELVIEW);
}

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////
void drawSpiral()
{
	const double PI = 3.14159;      //PI in radians
	GLdouble radians;               //theta in radians
	
	//Clear the background
	glClear (GL_COLOR_BUFFER_BIT);
	
	//set the foreground color
	glColor3ub (200, 55, 134);
	glLineWidth(3.0);
	
	//(x, y) is a point on the parametric curve
	GLdouble x, y;
	
	//plot points from the parametric curve
	glBegin (GL_LINE_STRIP);
	glVertex2d(0.0, 0.0);
	for (GLdouble theta = 0; theta < 800.0; theta += 1.0)
	{
		radians = theta * PI/180.0;            //convert PI to radians
		x = 0.5 * radians * cos(radians);   
		y = 0.5 * radians * sin(radians);
		 
		glVertex2d (x, y);
	}
	glEnd();
	
	//send all output to the display
	glFlush();
}

///////////////////////////////////////////////////////////////////////
//
// The main program creates a new window and draws the selected 
// mathematical function in the window. 
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
	glutInitWindowSize(500, 500);
	
	//specify the window position 
	glutInitWindowPosition(0,0);
	
	//open and display the window putting "Mathematical Function" on
	//the title bar
	glutCreateWindow("Parametric Curve");
	
	//register the drawCurve() function as the function to
	//activate when a redraw event occurs.
	glutDisplayFunc(drawSpiral);
	
	//set up the initial state of some of OpenGL's variables
	myinit();
	
	//enter an unending loop waiting from events to occur
	glutMainLoop();
	return 0;
}