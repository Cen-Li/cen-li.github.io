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

#include <iostream>
#include <cmath>
using namespace std;

//Represents a 3d point
struct point3D{
	float x;
	float y;
	float z;
};

//Global Variables
//PI to 32 digits
const double PI = 3.1415926535897932384626433832795;

//Window size
const int WIDTH = 800;
const int HEIGHT = 600;

//Camera variables
float cameraDistance = 5.0;
float cameraAngleX = 25;
float cameraAngleY = -45;

//Scene variables
int mode = 0;
int cosine1 = 0;
int cosine2 = 0;

//For drawing the pawn
float v[25][25][3];

//Pawn initial 2d line points for surface of revolution
float pawnPoints[25][3]  = {
	{0, .104, 0.0},
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


//Function prototypes
void Init();
void Display();
void sweepTheLeg();
void bootTheMatrix();
void checkMate();

int main(int argc, char **argv)
{
	bootTheMatrix();
	sweepTheLeg();

	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(WIDTH, HEIGHT);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Surface of Resolution");
	glutDisplayFunc(Display);

	Init();
	glutMainLoop();
}

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
				v[j][i+1][0] = r*cos((i+1.0)*(PI/12.0));
				v[j][i+1][1] = v[j][i][1];
				v[j][i+1][2] = r*sin((i+1.0)*(PI/12.0));
			}
		}    	
	}
}

//Draws a pawn using point matrix v.
void checkMate()
{
	glColor3f(0, 0, 1);
	glLineWidth(3);

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

//Initialization of some OpenGL parameters
void Init()
{
	glClearColor(1, 1, 1, 0); 	 //background is light gray

	//Setup the viewing 
	glMatrixMode( GL_PROJECTION );
	glLoadIdentity();
	glOrtho(-5, 5, -5, 5, 0.001, 100);

	//Setup 
	glMatrixMode( GL_MODELVIEW );
	glLoadIdentity();
}


void Display()
{
	//clear
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); 

	glRotated(-180, 1, 0, 0);
	glScaled(4, 4, 4);
	checkMate();

	glutSwapBuffers();
	glFlush();
}
