//
//  main.cpp
//  polyline editor
//
//  Created by cen on 8/23/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//
#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

#include <cmath>
#include <cstdlib>
#include <iostream>
using namespace std;

#include "polyline.h"

const int MAX_NUM_SHAPES=50;
#define SIZE 500  /* the size, in pixels, of the square window to open */

#define Red 1
#define Green 2
#define Blue 3
#define Yellow 4
#define Magenta 5
#define Cyan 6
#define Black 7

// global variables
PolylineClass   AllShapes[MAX_NUM_SHAPES];
int numOfShapes = 0;
char modeFlag;  // user action mode
PointType nextPoint;
bool selected=false;
int shapeIndex, pointIndex;  // the shape whose point is being moved or deleted
							// the point in the shape being moved or being deleted
GLdouble red, green, blue;  // color for the current shape

// Functions
void Display();
void Initialize();
void MouseButton(int button, int state, int x, int y);
void KeyHandler(unsigned char theKey, int mouseX, int mouseY);
void MyPassiveMotion(int x, int y);
void ProcessMenuEvents(int option);

int main (int argc, char **argv)
{
	glutInit (&argc, argv);
	glutInitWindowSize (SIZE, SIZE);
	glutInitWindowPosition (50, 100);
	glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB);
	glutCreateWindow ("Polyline editor");

	glutMouseFunc(MouseButton);
	glutKeyboardFunc(KeyHandler);
	glutDisplayFunc (Display);
	glutPassiveMotionFunc(MyPassiveMotion);

	// color menu
	glutCreateMenu(ProcessMenuEvents);
	glutAddMenuEntry("Red", Red);
	glutAddMenuEntry("Blue", Blue);
	glutAddMenuEntry("Green", Green);
	glutAddMenuEntry("Yellow", Yellow);
	glutAddMenuEntry("Magenta", Magenta);
	glutAddMenuEntry("Cyan", Cyan);
	glutAddMenuEntry("Black", Black);
	glutAttachMenu(GLUT_RIGHT_BUTTON);  //attach to the right button
	
    Initialize ();
	
    glutMainLoop ();
   
    return 0;
}

void ProcessMenuEvents(int Option)
{
	switch (Option) {
		case Red : red=1.0; green=0.0; blue=0.0;			
			break;
		case Green : red=0.0; green=1.0; blue=0.0;			
			break;
		case Blue  : red=0.0; green=0.0; blue=1.0;			
			break;
		case Cyan  : red=0.0; green=0.5; blue=0.5;			
			break;
		case Yellow : red=0.5; green=0.5; blue=0.0;			
			break;
		case Magenta: red=0.5; green=0.0; blue=0.5;			
			break;
		default:   red=0.0; green=0.0; blue=0.0;
			break;
	}
	
}

void Display ()
{
	int xVal, yVal;
	int i, j;
	GLdouble r, g, b;
	//int newShapeSize;
	
	glClear(GL_COLOR_BUFFER_BIT);     // clear the screen 
	glColor3f(1.0, 0.0, 0.0);
	
	for (i=0; i<numOfShapes+1; i++)
	{
		glBegin(GL_LINE_STRIP);
		AllShapes[i].GetColor(r, g, b);
		glColor3f(r, g, b);
		int numOfPoints=AllShapes[i].GetSize();
		for (j=0; j<numOfPoints; j++)   // a shape 
		{
			AllShapes[i].GetPoint(xVal, yVal, j);
			//cout << "print: x=" << xVal << ", y=" << yVal << endl;
			glVertex2d(xVal, yVal);
		}
		glEnd();
	} // end for
	glutSwapBuffers ();
}

void Initialize ()
{
    glClearColor (1.0, 1.0, 1.0, 1.0);			//set the background color to white
    glColor3f (0.0, 0.0, 0.0); 					//set the foreground color to black
    glLineWidth(2);
	
    glMatrixMode (GL_PROJECTION);
    glLoadIdentity ();
    gluOrtho2D (0, SIZE-1, 0, SIZE-1);   
}

void KeyHandler(unsigned char theKey, int mouseX, int mouseY)
{
	// Should change to a switch statement, cleaner code
	
	if (theKey == 'b')  // start a new polyline shape
	{
		modeFlag='a';
		AllShapes[numOfShapes].PutColor(red, green, blue);
	}
	else if (theKey == 'c') // end the current polyline shape with a closed loop
		// add points to the current polyline shape
	{
		modeFlag='e';    // end drawing the current shape
	
		// add the first point of the shape to the end of the point list for this shape
		AllShapes[numOfShapes].Add(0, 0, true);
		numOfShapes++;
	}
	else if (theKey == 'e') // simply end the current polyline shape
	{
		modeFlag = 'e';
		numOfShapes++;
	}
	else if (theKey == 'd')   // delete a point
	{
		modeFlag = 'd';
	}
	else if (theKey == 'm')   // move a point
	{
		modeFlag = 'm';
	}
	else if (theKey == 'r')
	{
		for (int i=0; i<numOfShapes; i++)
			AllShapes[i].Reset();
		numOfShapes=0;
	}
	else if (theKey == 'q')   // quit the editor
		exit(0);
	
	glutPostRedisplay();
	return;
}

// display the line to the current position of the mouse as the next point is being determined
void MyPassiveMotion(int x, int y)
{
	nextPoint.x = x;
	nextPoint.y = SIZE-y;
	glutPostRedisplay();
}

void MouseButton(int button, int state, int x, int y)
{
	int i, k;
	GLdouble  distance, bestDistance;
	
	y=SIZE-y;   // flip y co-ordinate
	if ((button == GLUT_LEFT_BUTTON) && (state == GLUT_DOWN))
	{
		if (modeFlag == 'a')
		{
			//cout << "Add a point" << endl;
			//cout << "x=" << x << ", y=" << y << endl;
			AllShapes[numOfShapes].Add(x, y, false);
			// add a point, not to add the last point			
		}
		else if ((modeFlag == 'm')||(modeFlag == 'd')) // locate the point to move or delete
		{
			// locate the point to delete or move
			for (i=0; i<numOfShapes; i++)
			{
				AllShapes[i].LocatePoint(x, y, k, distance);
				if ((i==0) ||  (distance < bestDistance))
				{
					bestDistance = distance;
					shapeIndex = i;
					pointIndex = k;
				}
			}
			
			// perform "delete" action
			if (modeFlag == 'd')
			{
				AllShapes[shapeIndex].Delete(pointIndex);
				modeFlag = 'e';   // end "deletion"
			}
			else if (modeFlag == 'm')  // perform "move" action
			{
				modeFlag = 'r';  // signal ready to move 
			}
		}
	}
	else if ((button==GLUT_LEFT_BUTTON) && (state == GLUT_UP))
	{
		if (modeFlag == 'r') // perform move
		{
			AllShapes[shapeIndex].Move(pointIndex, x, y);
			modeFlag = 'e';
		}
	}

	glutPostRedisplay(); // cause an event redraw to screen: to see the effect of the mouse event
	return;
}

