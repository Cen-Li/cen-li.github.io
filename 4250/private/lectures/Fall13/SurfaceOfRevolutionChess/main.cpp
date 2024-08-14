// An example to demonstrate :
//	the position of camera, gluLookAt function
//	3D zoom in and out
//	rotation of 3D objects and animation

#include "Camera.h"

#include <iostream>
using namespace std;

#define WIDTH 640
#define HEIGHT 480
#define GOLDEN_RATIO 1.618

#define startupCameraX 6 
#define startupCameraY 4
#define startupCameraZ 6

#define GL_PI 3.1415926

// rotation amount
GLdouble  xRot=0; 

// starting camera position
GLdouble  cameraX=startupCameraX;
GLdouble  cameraY=startupCameraY;
GLdouble  cameraZ=startupCameraZ;

// aspect ratio
GLdouble aspectRatio=WIDTH/HEIGHT;
GLdouble ww_x = 5.0;
GLdouble ww_y = 5.0;

bool animation=false;

Camera myCamera;  // camera object

// user defined functions
void MyInit();
void Draw();
void SpecialKeys(int key, int x, int y);
void TimerFunction(int value);
void myKeyboard(unsigned char theKey, int x, int y);

//For drawing the pawn
float v[25][25][3];

//Pawn initial 2d line points for surface of revolution
float pawnPoints[25][3]  = {
	{0,    .104, 0.0},
	{.028, .110, 0.0},
	{.052, .126, 0.0},
	{.068, .161, 0.0},
	{.067, .197, 0.0},
	{.055, .219, 0.0},
	{.041, .238, 0.0},
	{.033, .245, 0.0},
	{.031, .246, 0.0},
	{.056, .257, 0.0},
	{.063, .266, 0.0},
	{.059, .287, 0.0},
	{.048, .294, 0.0},
	{.032, .301, 0.0},
	{.027, .328, 0.0},
	{.032, .380, 0.0},
	{.043, .410, 0.0},
	{.058, .425, 0.0},
	{.066, .433, 0.0},
	{.069, .447, 0.0},
	{.093, .465, 0.0},
	{.107, .488, 0.0},
	{.106, .512, 0.0},
	{.115, .526, 0.0},
	{0, .525, 0.0},
};


//Sets up the v matrix so the pawn can be drawn
void bootTheMatrix()
{
	//Setup initial points matrix
	for (int i = 0; i < 25; i++)
	{
		v[i][0][0] = pawnPoints[i][0];
		v[i][0][1] = pawnPoints[i][1];
		v[i][0][2] = pawnPoints[i][2];
	}
}

//Creates the v array by rotating the points.
void sweepTheLeg()
{
	float r;
	for (int j = 0; j < 25; j++)
	{
		r = v[j][0][0];
		for(int i = 0; i < 25 ; i++ )
		{	
			if (i != 24)
			{
				v[j][i+1][0] = r*cos((i+1.0)*(GL_PI/12.0));
				v[j][i+1][1] = v[j][i][1];
				v[j][i+1][2] = r*sin((i+1.0)*(GL_PI/12.0));
			}
		}    	
	}
}

//Draws a pawn using point matrix v.
void checkMate()
{
	glColor3f(0, 0, 1);
	glPushMatrix();	
	glBegin(GL_QUADS);
	for (int i = 0; i < 24; i++)
	{
		for (int j = 0; j < 24; j++)	//Not j<25
		{
			glVertex3f(v[j][i][0], v[j][i][1], v[j][i][2]);
			glVertex3f(v[j][i+1][0], v[j][i+1][1], v[j][i+1][2]);
			glVertex3f(v[j+1][i+1][0], v[j+1][i+1][1], v[j+1][i+1][2]);
			glVertex3f(v[j+1][i][0], v[j+1][i][1], v[j+1][i][2]);									
		}
	}
	glEnd();
	glPopMatrix();
}


int main(int argc, char **argv)
{
        bootTheMatrix();
        sweepTheLeg();

	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(WIDTH, HEIGHT);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("3D viewing with camera");
	glutSpecialFunc(SpecialKeys);
	glutTimerFunc(40, TimerFunction, 1);
	glutKeyboardFunc(myKeyboard);
	glutDisplayFunc(Draw);
	
	MyInit();
	
	glutMainLoop();
	
	return 0;
}

void MyInit()
{
        myCamera.setShape(60, 1, 1, 100);
        myCamera.set(cameraX, cameraY, cameraZ,   0, 0, 0,   0, 1, 0);
	
	glClearColor(1, 1, 1, 0);  

	glEnable(GL_DEPTH_TEST);
}	

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< draw scene >>>>>>>>>>>>>>>>>>>>>>
void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // clear the screen
	
	glColor3f(0, 0, 0);
       
	glRotated(-180, 1, 0, 0);
	glScaled(4, 4, 4);
	checkMate();

	glutSwapBuffers();
	glFlush();
}

// Respond to arrow keys
void SpecialKeys(int key, int x, int y)
{
	if(key == GLUT_KEY_UP)
                myCamera.slide(0, 0.1, 0);
 	else if(key == GLUT_KEY_DOWN)
                myCamera.slide(0, -0.1, 0);
	else if(key == GLUT_KEY_LEFT)
                myCamera.slide(-0.1, 0, 0);
	else if(key == GLUT_KEY_RIGHT)
                myCamera.slide(0.1, 0, 0);
	
	// Refresh the Window
	glutPostRedisplay();
}

void myKeyboard(unsigned char theKey, int x, int y)
{
	switch(theKey)
	{
		case 'f':		// move camera forward, zoom in
                        myCamera.slide(0, 0, -0.1);
			break;
		case 'F':
                        myCamera.slide(0, 0, -0.2);
			break;
			
		case 'b':		// move camera backward, zoom out
                        myCamera.slide(0, 0, 0.1);
			break;
		case 'B':
                        myCamera.slide(0, 0, 0.2);
			break;
			
		case 'r':
			myCamera.roll(1.0);  // Camera roll left
			break;
		case 'R':
			myCamera.roll(-1.0);  // Camera roll right
			break;
			
 		case 'y':
			myCamera.yaw(1.0);   // Camera yaw to left
			break;
		case 'Y': 
			myCamera.yaw(-1.0);  // Camera yaw to right
			break;
		case 'p':
			myCamera.pitch(1.0);  // Camera pitch up
			break;
		case 'P':
			myCamera.pitch(-1.0);  // Camera pitch down
			break;
		case 'i':
		case 'I':
        		myCamera.setShape(45, 1, 1, 100);
 		        myCamera.set(startupCameraX, startupCameraY, startupCameraZ,   0, 0, 0,   0, 1, 0);
			break;
			
		case 'a':		// start animation
		case 'A':
			animation = true;
			glutTimerFunc(50, TimerFunction, 1);
			break;
			
		case 's':		// stop animation
		case 'S':
			animation = false;
			break;

		case 'q':   // end display
			exit (0);
		default:
			if (theKey == 27)   // ASCII for escape character
				exit(0);
	}

	glutPostRedisplay();
}

void TimerFunction(int value)
{
	if (animation)
	{
		xRot -= 15.0;
		xRot = (GLfloat)((const int)xRot % 360);

		// Redraw the scene with new coordinates every 20 milliseconds
		glutPostRedisplay();
	
		// important!! otherwise timer function is not called again
		glutTimerFunc(70, TimerFunction, 1);
	}
}
