//Chess Room
//By Bret Hargraves, Matt Kluting, and Tom Richards

#define MAC 

#ifdef WINDOWS
#pragma comment(linker, "/SUBSYSTEM:WINDOWS /ENTRY:mainCRTStartup")
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

#include "mesh.h"
#include "RgbImage.h"
#include <iostream>
#include <fstream>
using namespace std;

//Represents a 3d point
struct point3D{
	float x;
	float y;
	float z;
};

enum animationModes {STOPPED, PLAYER_ONE, PLAYER_TWO, TIME_UP};

//Global Variables
//PI to 32 digits
const double PI = 3.1415926535897932384626433832795;

//Texture helpers
const int TILE=10;
GLuint lightsTexture;
GLuint woodTexture;
GLuint brickTexture;
GLuint plasticTexture;
GLuint smileyTexture;

//Window size
const int WIDTH = 800;
const int HEIGHT = 600;

//Camera variables
float cameraDistance = 5.0;
float cameraAngleX = 25;
float cameraAngleY = -45;

//Scene variables
float mouseX;
float mouseY;
int rotation1 = 0;
int rotation2 = 0;
int translation = 0;
int mode = 0;
int clockMode = 0;
int clockRot1 = 0;
int clockRot2 = 0;
int buttonTrans = 0;
int spring1 = 0;
int spring2 = 0;
int chair1Up = 0;
int chair2Up = 0;
float springGive1 = 0;
float springGive2 = 0;
int cosine1 = 0;
int cosine2 = 0;
int seat1 = 0;
int seat2 = 0;
int sound1 = 0;
int sound2 = 0;

//For camera control
int MOUSE_BUTTON = -1;
int MOUSE_STATE = -1;

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

//Mesh
Mesh base;
Mesh Clock;

//Chair materials
GLfloat mat_chair_amb[]={2, 2, 2, 1.0f};
GLfloat mat_chair_diff[]={1.0f, 1.0f, 1.0f, 1.0f};
GLfloat mat_chair_spec[]={2.0f, 2.0f, 2.0f, 2.0f};
GLfloat mat_chair_shiny[]={50};

//Table materials
GLfloat mat_table_amb[]={-2, 2, -2, 1.0f};
GLfloat mat_table_diff[]={1.0f, 1.0f, 1.0f, 1.0f};
GLfloat mat_table_spec[]={2.0f, 2.0f, 2.0f, 2.0f};
GLfloat mat_table_shiny[]={91};

//Clock materials
GLfloat mat_clockBase_amb[]={-0, -1, -2, 1.0f};
GLfloat mat_clockBase_diff[]={1.0f, 1.0f, 1.0f, 1.0f};
GLfloat mat_clockBase_spec[]={2.0f, 2.0f, 2.0f, 2.0f};
GLfloat mat_clockBase_shiny[]={91};

//Black chess piece materials
GLfloat mat_chessBlack_amb[]={-2, -2, -2, 1.0f};
GLfloat mat_chessBlack_diff[]={1.0f, 1.0f, 1.0f, 1.0f};
GLfloat mat_chessBlack_spec[]={2.0f, 2.0f, 2.0f, 2.0f};
GLfloat mat_chessBlack_shiny[]={50};

//Wall ambient property
GLfloat mat_wall_amb[]={0, 0, 2, 1.0f};

//Function prototypes
void Init();
void DisplaySolid();
void MouseMotion(int, int);
void DrawWall(double);
void DrawChairLeg(double, double);
void DrawChair(double, double, double, double);
void DrawBanner();
void DrawTable(double, double, double, double);
void DrawFilledCylinder(float, float);
void DrawClock();
void DrawCircle(float);
void DrawLine(float, float, float, float);
void DrawHelix(float);
GLuint LoadTextureRAW(const char *, int, int, int);
GLuint LoadTextureBMP(const char *, int);
void sweepTheLeg();
void createBoard();
void drawBoard();
void bootTheMatrix();
void checkMate();
void drawGround();

//More function prototypes
void reset();
void TimerFunction(int);
void MouseMotion(int, int);
void rotateCamera(int, int);
void zoomCamera(int);
void Mouse(int button, int state, int x, int y);
void Keyboard (unsigned char key, int x, int y);

//Reimplement glutSolidCube with texture coordinates
static void drawBox(float size);

//Main function

int main(int argc, char **argv)
{
	bootTheMatrix();
	sweepTheLeg();
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(WIDTH, HEIGHT);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Chess Room - Bret Hargraves, Matt Kluting, Tom Richards");
	glutDisplayFunc(DisplaySolid);
	glutKeyboardFunc(Keyboard);
	glutMouseFunc(Mouse);
	glutMotionFunc(MouseMotion);
	glutTimerFunc(30, TimerFunction, 1);

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
	glEnable(GL_DEPTH_TEST); // for hidden surface removal
	glEnable(GL_CULL_FACE); // What?
	glEnable(GL_LIGHTING);  //	enable the light source

	//Setup light (one light, at {2,6,3} )
	GLfloat lightIntensity[] = {0.7f, 0.7f, 0.7f, 1.0f};
	GLfloat light_position[] = {2.0f, 6.0f, 3.0f, 0.0f};
	glLightfv(GL_LIGHT0, GL_POSITION, light_position);
	glLightfv(GL_LIGHT0, GL_DIFFUSE, lightIntensity);
	glEnable(GL_LIGHT0);

	glShadeModel(GL_SMOOTH);
	glEnable(GL_NORMALIZE);  // normalize vectors for proper shading

	glClearColor(0.1f, 0.1f, 0.1f, 0.0f); 	 //background is light gray

	//Setup the viewing frustum
	glMatrixMode( GL_PROJECTION );
	glLoadIdentity();
	gluPerspective(60, (float)WIDTH/HEIGHT, 0.001, 1500);

	//Setup 
	glMatrixMode( GL_MODELVIEW );
	glLoadIdentity();

	//Load textures
	//lightsTexture = LoadTextureRAW("ChristmasLights.raw", 500, 200, 0);
	lightsTexture = LoadTextureBMP("ChristmasLights.bmp", 0);
	woodTexture = LoadTextureBMP("Wood.bmp", 1);
	brickTexture = LoadTextureBMP("Brick.bmp", 1);
	plasticTexture = LoadTextureBMP("Plastic.bmp", 0);
	smileyTexture = LoadTextureBMP("Smiley.bmp", 0);
	createBoard(); //Generate the chess board texture
	
	//Read the mesh from the file
	base.readmesh("Base.txt");
	Clock.readmesh("Clock.txt");
	
}

//Draws a large set of gridlines
void drawGround()
{
	GLfloat extent      = 600.0f; // How far on the Z-Axis and X-Axis the ground extends
	GLfloat stepSize    = 20.0f;  // The size of the separation between points
	GLfloat groundLevel = -50.0f;   // Where on the Y-Axis the ground is drawn
 
	// Set colour to white
	glColor3ub(255, 255, 255);
 
	// Draw our ground grid
	glBegin(GL_LINES);
	for (GLint loop = -extent; loop < extent; loop += stepSize)
	{
		// Draw lines along Z-Axis
		glVertex3f(loop, groundLevel,  extent);
		glVertex3f(loop, groundLevel, -extent);
 
		// Draw lines across X-Axis
		glVertex3f(-extent, groundLevel, loop);
		glVertex3f(extent,  groundLevel, loop);
	}
	glEnd();
 
}

//Generates the chess board texture
void createBoard()
{
	int TexColor;
	GLubyte Tile[64][64][4]; //texture array

	//create texture
	for(int s=0;s<64;s++)
	{
		for(int t=0;t<64;t++)
		{
			//sets every other 8 pixels to black and 8 to white using bitwise XOR
			TexColor=( ((s&0x8)==0) ^ ((t&0x8)==0) )*255; 
			Tile[s][t][0]=TexColor;                   //red
			Tile[s][t][1]=TexColor;                   //green
			Tile[s][t][2]=TexColor;                   //blue
			Tile[s][t][3]=255;                        //alpha
		}
	}
	
	//GL_TEXTURE_2D is now associated with the name TILE
	glBindTexture(GL_TEXTURE_2D,TILE);        
	
	//Specify what happens for magnification and minification
	glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST);
	glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);
	
	//Specify that Tile is the texture array to use with GL_TEXTURE_2D
	glTexImage2D(GL_TEXTURE_2D, 0, 4, 64, 64, 0, GL_RGBA, GL_UNSIGNED_BYTE, Tile);
}

//Draws a chess board
void drawBoard()
{
	//glEnable(GL_LIGHTING);	

	glEnable( GL_TEXTURE_2D );
	glBindTexture(GL_TEXTURE_2D, TILE);
	glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);

	glBegin(GL_QUADS);
		glTexCoord2f(0.0, 0.0); glVertex3f(-1.0, -1.0, 0.0);
		glTexCoord2f(0.0, 1.0); glVertex3f(-1.0, 1.0, 0.0);
		glTexCoord2f(1.0, 1.0); glVertex3f(1.0, 1.0, 0.0);
		glTexCoord2f(1.0, 0.0); glVertex3f(1.0, -1.0, 0.0);
	glEnd();

	glDisable(GL_TEXTURE_2D);
}

//Display the entire scene
void DisplaySolid()
{
	//clear
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); 

	//setup camera
	glPushMatrix();
		glTranslatef(0, 0, -cameraDistance);
		glRotatef(cameraAngleX, 1, 0, 0); // pitch
		glRotatef(cameraAngleY, 0, 1, 0); // heading

		glPushMatrix();
			drawGround();
			glPushMatrix();
				glTranslatef(0, 200, 0);
				drawGround();
			glPopMatrix();
		glPopMatrix();

		// set properties of the surface material
		GLfloat mat_ambient[]={0.7f, 0.7f, 0.7f, 1.0f}; // gray
		GLfloat mat_diffuse[]={0.6f, 0.6f, 0.6f, 1.0f};
		GLfloat mat_specular[]={1.0f, 1.0f, 1.0f, 1.0f};
		GLfloat mat_shininess[]={50.0f};
	
		glMaterialfv(GL_FRONT, GL_AMBIENT, mat_ambient);
		glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
		glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular);
		glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess);
	
		// draw the chair
		glPushMatrix();
			glTranslated(0.4, .01 + spring2/25.0 + chair2Up/25.0, -.2);
			glRotated(rotation2, 0.0, 1.0, 0.0);	

			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
			DrawChair(0.3, 0.02, 0.02, 0.3);
		glPopMatrix();

		glPushMatrix();
			glTranslated(0.4, .01 + spring1/25.0 + chair1Up/25.0, 1.0);
			glRotated(rotation1+180, 0.0, 1.0, 0.0);	

			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
			DrawChair(0.3, 0.02, 0.02, 0.3);
		glPopMatrix();
	
		glEnable( GL_TEXTURE_2D );
		glBindTexture(GL_TEXTURE_2D, brickTexture);
		glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);

		// Wall #1: XZ Plane
		glMaterialfv(GL_FRONT, GL_AMBIENT, mat_wall_amb);
		glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
		DrawWall(0.02); 

	
		// Wall #2: YX Plane
		glPushMatrix();
			glRotated(90.0, 1.0, 0.0, 0.0);
			glRotated(90.0, 0.0, 0.0, 1.0);
			glTranslated(0.0, 0.5, -1.5);
			DrawWall(0.02); 
		glPopMatrix();
	
		// Wall #3: XY Plane
		glPushMatrix();
			glRotated(-90, 1.0, 0.0, 0.0);
			glTranslated(0, .5, .5);
			DrawWall(0.02); 
		glPopMatrix();
		
		glDisable(GL_TEXTURE_2D);

		//Banners on right wall
		glPushMatrix();
			glTranslated(-.5, 1.3, -.495);
			glScaled(.2, .2, 0);
			DrawBanner();
			glTranslated(5, 0, 0);
			DrawBanner();
		glPopMatrix();
		
		//Banners on left wall
		glPushMatrix();
			glRotated(90, 0, 1, 0);
			glTranslated(-.48, 1.3, -.495);
			glScaled(.2, .2, 0);
			DrawBanner();
			glTranslated(-5, 0, 0);
			DrawBanner();
		glPopMatrix();

		glEnable( GL_TEXTURE_2D );
		glBindTexture(GL_TEXTURE_2D, plasticTexture);
		glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);

		//Table
		glPushMatrix();
			glTranslated(.4, .01, .4);
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_table_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_table_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_table_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_table_shiny);
			DrawTable(.75, .02, .02, .45);
		glPopMatrix();

		glDisable(GL_TEXTURE_2D);

		//Clock
		glPushMatrix();
			DrawClock();
		glPopMatrix();

		//Chess board
		glPushMatrix();
			glRotated(90, 1, 0, 0);
			glTranslated(.4, .4, -.475);
			glScaled(.2, .2, .2);
			glRotated(90, 0, 0, 1);
			drawBoard();
		glPopMatrix();

		glEnable( GL_TEXTURE_2D );
		glBindTexture(GL_TEXTURE_2D, smileyTexture);
		glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);

		//Spring board 1
		glTranslated(.4, 0, 0);
		glPushMatrix();
			glTranslated(0, spring2/25.0 + springGive2/25.0, -.2);
			glScaled(.3, .02, .3);
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_wall_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
			drawBox(1.0);
		glPopMatrix();

		glDisable(GL_TEXTURE_2D);

		//Spring 1
		glPushMatrix();
			glScaled(.1, .1, .1);
			glRotated(90, 1, 0, 0);		
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
			glTranslated(0, -2, -spring2/2.5 - springGive2/2.5);
			DrawHelix(5.0 + springGive2);	
		glPopMatrix();
		
		glEnable( GL_TEXTURE_2D );
		glBindTexture(GL_TEXTURE_2D, smileyTexture);
		glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);

		//Spring board 2
		glTranslated(0, 0,.8);
		glPushMatrix();
			glTranslated(0, spring1/25.0 + springGive1/25.0, .2);
			glScaled(.3, .02, .3);
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_wall_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
			drawBox(1.0);
		glPopMatrix();

		glDisable(GL_TEXTURE_2D);

		//Spring 2
		glPushMatrix();
			glScaled(.1, .1, .1);
			glRotated(90, 1, 0, 0);
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
			glTranslated(0, 2.0, -spring1/2.5 - springGive1/2.5);
			DrawHelix(5.0 + springGive1);	
		glPopMatrix();	

		//White pawn back row
	float morechess = -1.75;
	for (int i = 0; i < 8; i++)
	{	
		glPushMatrix(); 
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
			glRotated(180, 1, 0, 0);
			glScaled(.1, .1, .1);
			glTranslated(morechess, -5.3, 2.25);
			checkMate();
		glPopMatrix();
		morechess = morechess + .5;
	}


	//White pawn front row
	float morepiece = -1.75;
	for (int i = 0; i < 8; i++)
	{	
		glPushMatrix(); 
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
			glRotated(180, 1, 0, 0);
			glScaled(.1, .1, .1);
			glTranslated(morepiece, -5.3, 2.75);
			checkMate();
		glPopMatrix();
		morepiece = morepiece + .5;
	}



		//Black pawn back row
	float startpiece = -1.75;
	for (int i = 0; i < 8; i++)
	{
		glPushMatrix();  
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chessBlack_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chessBlack_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chessBlack_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chessBlack_shiny);
			glRotated(180, 1, 0, 0);
			glScaled(.1, .1, .1);
			glTranslated(startpiece, -5.3, 5.75);
			checkMate();
		glPopMatrix();
		startpiece= startpiece + .5;
	}

	//Black pawn front row
	float blackpiece = -1.75;
	for (int i = 0; i < 8; i++)
	{
		glPushMatrix();  
			glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chessBlack_amb);
			glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chessBlack_diff);
			glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chessBlack_spec);
			glMaterialfv(GL_FRONT, GL_SHININESS, mat_chessBlack_shiny);
			glRotated(180, 1, 0, 0);
			glScaled(.1, .1, .1);
			glTranslated(blackpiece, -5.3, 5.25);
			checkMate();
		glPopMatrix();
		blackpiece= blackpiece + .5;
	}

	glPopMatrix();

	glutSwapBuffers();
	glFlush();
}

//Draws a helix
void DrawHelix(float i)
{
	float x, y, z;
	glBegin(GL_LINES) ;
		float du = PI/32 ;
		for(float u = 0 ; u < 8*PI ; u += du) 
		{
			x = cos(u);
			y = sin(u);
			z = u/i;
			glVertex3f(x,y,z);

			x = cos(u+du);
			y = sin(u+du);
			z = (u+du)/i;
			glVertex3f(x,y,z);
		}
	glEnd();
}

//Draws a line
void DrawLine(float x1, float y1, float x2, float y2)
{
	glBegin(GL_LINE_STRIP);
		glVertex3f(x1, y1, 0);
		glVertex3f(x2, y2, 0);
	glEnd();
}

//Draws a table
void DrawTable(double topWid, double topThick, double legThick, double legLen)
{
	// draw the table - a top and four legs
	glPushMatrix();  // draw the table top
	glTranslated(0, legLen, 0);
	glScaled(topWid, topThick, topWid);
	drawBox(1.0);
	glPopMatrix();
	
	double dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	glPushMatrix();
	glTranslated(dist, 0, dist);
	DrawChairLeg(legThick, legLen);
	glTranslated(0, 0, -2*dist);
	DrawChairLeg(legThick, legLen);
	glTranslated(-2*dist, 0, 2*dist);
	DrawChairLeg(legThick, legLen);
	glTranslated(0, 0, -2*dist);
	DrawChairLeg(legThick, legLen);
	
	glPopMatrix();
}

//Draws a filled cylinder
void DrawFilledCylinder(float radius, float height)
{
	GLUquadricObj * qobj = gluNewQuadric();
	gluQuadricDrawStyle(qobj, GLU_FILL);
	gluCylinder(qobj, radius, radius, height, 16, 16);
	glTranslated(0, 0, height);
	DrawCircle(radius);
}

//Draws a circle
void DrawCircle(float radius)
{
	glBegin(GL_POLYGON);
	for(float i = 0; i <= 2*PI; i+= PI/16)
	{
		glVertex3f(radius * cos(i), radius * sin(i), 0);
	}
	glEnd();
}

//Draws a clock
void DrawClock()
{
	GLfloat mat_ambient[]={0.7f, 0.7f, 0.7f, 1.0f}; // gray
	GLfloat mat_diffuse[]={0.6f, 0.6f, 0.6f, 1.0f};
	GLfloat mat_specular[]={1.0f, 1.0f, 1.0f, 1.0f};
	GLfloat mat_shininess[]={50.0f};

	glRotated(90, 0, 1, 0);
	glTranslated(-.5 , .47, .15);

	//base of clock
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_clockBase_amb);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_clockBase_diff);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_clockBase_spec);
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_clockBase_shiny);
	base.draw();

	//top of clock
	glTranslated(.025, .01, -.01); 
	Clock.draw();
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);

	//face 1
	glTranslated(.05, .045 , .001);
	DrawCircle(.03);

	//hands 1
	glLineWidth(3);
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_wall_amb);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
	glPushMatrix();
		glRotated(clockRot1, 0, 0, 1);
		DrawLine(0,0,0,.03);
	glPopMatrix();
	glPushMatrix();
		glRotated(clockRot1/12.0, 0, 0, 1);
		DrawLine(0,0,.02*sin(5*PI/6.0), .02*cos(5*PI/6.0));
	glPopMatrix();

	//face 2
	glTranslated(.1, 0, 0);
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
	DrawCircle(.03);

	//hands 2
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_wall_amb);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
	glPushMatrix();
		glRotated(clockRot2, 0, 0, 1);
		DrawLine(0,0,0,.03);
	glPopMatrix();
	glPushMatrix();
		glRotated(clockRot2/12.0, 0, 0, 1);
		DrawLine(0,0,.02*sin(5*PI/6.0), .02*cos(5*PI/6.0));
	glPopMatrix();

	//button 1 & 2
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_chair_amb);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_chair_diff);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_chair_spec);
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_chair_shiny);
	glPushMatrix();
		glRotated(-90, 1, 0, 0);
		glPushMatrix();
		glTranslated(0, .04, .037 - buttonTrans/1000.0);
		DrawFilledCylinder(.01, .01);
		glPopMatrix();
		glTranslated(-.1, .04, .037 - .01 + buttonTrans/1000.0);
		DrawFilledCylinder(.01, .01);
	glPopMatrix();
}

//Draws a chair
void DrawChair(double topWid, double topThick, double legThick, double legLen)
{
	glEnable( GL_TEXTURE_2D );
	glBindTexture(GL_TEXTURE_2D, woodTexture);
	glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);

	// draw the chair - a top and four legs
	glPushMatrix();  // draw the chair top
	glTranslated(0, legLen, 0);
	glScaled(topWid, topThick, topWid);
	drawBox(1.0);
	glPopMatrix();
	
	double dist = 0.95 * topWid / 2.0 - legThick / 2.0;

	glPushMatrix();

	glTranslated(dist, 0, dist);
	DrawChairLeg(legThick, legLen);

	glTranslated(0, 0, -2*dist);
	DrawChairLeg(legThick, legLen);

	glTranslated(0, topWid, 0);
	DrawChairLeg(legThick, legLen);

	glTranslated(-2*dist, -topWid, 2*dist);
	DrawChairLeg(legThick, legLen);

	glTranslated(0, 0, -2*dist);
	DrawChairLeg(legThick, legLen);

	glTranslated(0, topWid, 0);
	DrawChairLeg(legThick, legLen);

	//Top bar of the back of the chair
	glTranslated(legLen-legThick, topWid, 0);
	glRotatef(90, 0, 0, 1);
	DrawChairLeg(legThick, legLen);

	//Go back
	glTranslated(-legLen, topWid, 0);
	glRotatef(-90, 0, 0, 1);

	for(int i = 0; i < 5; i++)
	{
		glTranslated((1/6.0)*topWid, 0, 0);
		DrawChairLeg(legThick, legLen);
	}
	
	glPopMatrix();

	glDisable(GL_TEXTURE_2D);
}

//Draws a chair leg
void DrawChairLeg(double thick, double len)
{
	glPushMatrix();
	glTranslated(0, len/2, 0);
	glScaled(thick, len, thick);
	drawBox(1.0);
	glPopMatrix();
}

//Function definitions
void DrawWall(double thickness)
{
	// draw thin wall with top = xz-plane, corner at origin
	glPushMatrix();
	glTranslated(0.5, 0.5*thickness, 0.5);
	glScaled(2.0, thickness, 2.0);
	drawBox(1.0);
	glPopMatrix();
}

//Draws a single banner (2d polygon with texture)
void DrawBanner()
{
	//glDisable(GL_LIGHTING);

	glEnable( GL_TEXTURE_2D );
	glBindTexture(GL_TEXTURE_2D, lightsTexture);
	glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);

	glColor3f(1.0, 1.0, 1.0);
	glBegin( GL_QUADS );
		glTexCoord2d(0,0); glVertex2d(0,0);
		glTexCoord2d(1,0); glVertex2d(5,0);
		glTexCoord2d(1,1); glVertex2d(5,2);
		glTexCoord2d(0,1); glVertex2d(0,2);
	glEnd();
	glDisable(GL_TEXTURE_2D);

	//glEnable(GL_LIGHTING);
}

//Loads a texture from a windows-style BMP file
GLuint LoadTextureBMP(const char * filename, int wrap)
{
	GLuint texture;

	// allocate a texture name
	glGenTextures( 1, &texture );

	// select our current texture
	glBindTexture( GL_TEXTURE_2D, texture );

	RgbImage theTexMap( filename );

	// Pixel alignment: each row is word aligned (aligned to a 4 byte boundary)
	//    Therefore, no need to call glPixelStore( GL_UNPACK_ALIGNMENT, ... );

	glPixelStorei(GL_UNPACK_ALIGNMENT, 4);

	//Repeat based on function parameter
	glTexParameterf( GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, wrap ? GL_REPEAT : GL_CLAMP );
	glTexParameterf( GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, wrap ? GL_REPEAT : GL_CLAMP );

	//Nice looking texture
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);

	gluBuild2DMipmaps(GL_TEXTURE_2D, 3,theTexMap.GetNumCols(), theTexMap.GetNumRows(),
					 GL_RGB, GL_UNSIGNED_BYTE, theTexMap.ImageData() );

	return texture;

}

//Resets all values to defaults.
void reset()
{
	//Reset camera
	cameraDistance = 5.0;
	cameraAngleX = 25;
	cameraAngleY = -45;

	//Reset scene
	rotation1 = 0;
	rotation2 = 0;
	translation = 0;
	mode = 0;
	clockMode = 0;
	clockRot1 = 0;
	clockRot2 = 0;
	buttonTrans = 0;
	spring1 = 0;
	spring2 = 0;
	chair1Up = 0;
	chair2Up = 0;
	springGive1 = 0.0;
	springGive2 = 0.0;
	cosine1 = 0;
	cosine2 = 0;
	seat1 = 0;
	seat2 = 0;
	sound1 = 0;
	sound2 = 0;
}

//User for animation
void TimerFunction(int value)
{	
	if (clockMode == PLAYER_ONE)
	{
		if (clockRot1 < 1800)
		{
			clockRot1++;
		}
		else
		{
			if (spring1 < 10)
			{
				spring1++;
			}
			else
			{
				seat1 = TIME_UP;
				sound1++;
			}
		}

		if (buttonTrans < 10)
		{
			buttonTrans++;
		}
		//clockRot1 = clockRot1 % 360;
	}
	else if (clockMode == PLAYER_TWO)
	{
		if (clockRot2 < 1800)
		{
			clockRot2++;
		}
		else
		{
			if (spring2 < 10)
			{
				spring2++;
			}
			else
			{
				seat2 = TIME_UP;		
				sound2++;
			}
		}		

		if (buttonTrans > 0)
		{
			buttonTrans--;
		}
		//clockRot2 = clockRot2 % 360;
	}

	if (seat1 == TIME_UP)
	{
		chair1Up++;
		rotation1 = rotation1 + 10;
		cosine1++;
		springGive1 = cos((PI/16.0)*cosine1) ;
		if (sound1 == 1)
		{
			sound1++;
			//PlaySound("boing.wav", NULL, SND_LOOP | SND_ASYNC);
		}
		
		if (sound1 == 30)
		{
			//PlaySound(NULL, NULL, SND_LOOP | SND_ASYNC);
		}
	}

	if (seat2 == TIME_UP)
	{
		chair2Up++;
		rotation2 = rotation2 + 10;
		cosine2++;
		springGive2 = cos((PI/16.0)*cosine2) ;
		if (sound2 == 1)
		{
			sound2++;
			//PlaySound("boing.wav", NULL, SND_LOOP | SND_ASYNC);
		}

		if (sound2 == 30)
		{
			//PlaySound(NULL, NULL, SND_LOOP | SND_ASYNC);
		}
	}
	// Redraw the scene with new coordinates every 20 milliseconds
	glutPostRedisplay();
	
	// important!! otherwise timer function is not called again
	glutTimerFunc(20,TimerFunction, 1);
}

//Used to handle keyboard events
void Keyboard (unsigned char key, int x, int y)
{
	if(key == 'b')
	{
		reset();
	}
	else if(key == 27)
	{
		exit(0);
	}
	else if(key == 'a')
	{
		if (clockMode == STOPPED)
		{
			clockMode = PLAYER_ONE;			
		}
		else if (clockMode == PLAYER_ONE)
		{			
			clockMode = PLAYER_TWO;
		}
		else
		{
			clockMode = PLAYER_ONE;
		}
	}

	// Refresh the Window
	glutPostRedisplay();
}

//Used to handle mouse events
void Mouse(int button, int state, int x, int y)
{
	mouseX = x;
	mouseY = y;
	MOUSE_BUTTON = button;
	MOUSE_STATE = state;
}

//Handles the mouse moving. Very useful for mouse-controlled camera.
void MouseMotion(int x, int y)
{
	if(MOUSE_BUTTON == GLUT_LEFT_BUTTON)
	{
		rotateCamera(x, y);
	}
	else if(MOUSE_BUTTON == GLUT_RIGHT_BUTTON)
	{
		zoomCamera(y);
	}
}

//Rotates the camera.
void rotateCamera(int x, int y)
{
	if(MOUSE_STATE == GLUT_DOWN)
	{
		cameraAngleY += x-mouseX;
		cameraAngleX += y-mouseY;
		mouseX = x;
		mouseY = y;
		glutPostRedisplay();
	}
}

//Zooms the camera.
void zoomCamera(int delta)
{
	if(MOUSE_STATE == GLUT_DOWN)
	{
		cameraDistance += (delta - mouseY) * 0.05f;
		mouseY = delta;
		glutPostRedisplay();
	}
}

//Re-implementation of openGL drawBox function
static void drawBox(float size)
{
	static GLfloat n[6][3] =
	{
		{-1.0, 0.0, 0.0},
		{0.0, 1.0, 0.0},
		{1.0, 0.0, 0.0},
		{0.0, -1.0, 0.0},
		{0.0, 0.0, 1.0},
		{0.0, 0.0, -1.0}
	};
	static GLint faces[6][4] =
	{
		{0, 1, 2, 3},
		{3, 2, 6, 7},
		{7, 6, 5, 4},
		{4, 5, 1, 0},
		{5, 6, 2, 1},
		{7, 4, 0, 3}
	};
	GLfloat v[8][3];
	GLint i;

	v[0][0] = v[1][0] = v[2][0] = v[3][0] = -size / 2;
	v[4][0] = v[5][0] = v[6][0] = v[7][0] = size / 2;
	v[0][1] = v[1][1] = v[4][1] = v[5][1] = -size / 2;
	v[2][1] = v[3][1] = v[6][1] = v[7][1] = size / 2;
	v[0][2] = v[3][2] = v[4][2] = v[7][2] = -size / 2;
	v[1][2] = v[2][2] = v[5][2] = v[6][2] = size / 2;

	for (i = 5; i >= 0; i--)
	{
		glBegin(GL_QUADS);
		glNormal3fv(&n[i][0]);
		glTexCoord2d(0,0); glVertex3fv(&v[faces[i][0]][0]); //Add texture mapping
		glTexCoord2d(0,1); glVertex3fv(&v[faces[i][1]][0]);
		glTexCoord2d(1,1); glVertex3fv(&v[faces[i][2]][0]);
		glTexCoord2d(1,0); glVertex3fv(&v[faces[i][3]][0]);
		glEnd();
	}
}
