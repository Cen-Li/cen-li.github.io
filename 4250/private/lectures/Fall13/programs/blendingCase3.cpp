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


#include <iostream>
using namespace std;

#define WIDTH 640
#define HEIGHT 480

GLint cubeList, sphereList; // display lists

// rotation amount
GLdouble	xRot=0; 
GLdouble	yRot=0;

// starting camera position
GLdouble	cameraX=2;
GLdouble	cameraY=2;
GLdouble	cameraZ=20;

#define ZINC 1
#define MAXZ 8.0 
#define MINZ -8.0 
GLfloat solidZ = MINZ; 	
GLfloat transparentZ = MAXZ;	

// user defined functions
void MyInit();
void display();
void ChangeLocation(); 
void SpecialKeys(int key, int x, int y);

int main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(WIDTH, HEIGHT);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("color blending case 4 ");
	glutDisplayFunc(display);
	glutSpecialFunc(SpecialKeys);
	glViewport(0, 0, 640, 480);  // same as world window
	
	MyInit();
	
	glutMainLoop();
	return 0;
}

void MyInit()
{
	glMatrixMode(GL_PROJECTION); // set the view volume shape
	glLoadIdentity();
	glOrtho(-2.0*WIDTH/HEIGHT, 2.0*WIDTH/HEIGHT, -2.0, 2.0, 0.1, 100);
	
	glMatrixMode(GL_MODELVIEW); // position and aim the camera
	glLoadIdentity();
	gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
	
	glClearColor(1.0, 1.0, 1.0, 0.0);
	
	glEnable(GL_DEPTH_TEST);
	
	// setup one light
	GLfloat position[] = { 0, 0, 1.0, 0 }; //light shining headon, directioanl light
	glLightfv(GL_LIGHT0, GL_POSITION, position);
	glEnable(GL_LIGHTING); 
	glEnable(GL_LIGHT0);
	
	// create display list for a cube to be used later 
	cubeList = glGenLists(1); 
	glNewList(cubeList, GL_COMPILE); 
	glColor4f(0, 1, 1, 0.25); // transparent cube
	glutSolidCube (0.6);
	glEndList();
}	

// case 3A

void display() 
{
 	glClearColor(1.0, 1.0, 1.0, 1.0);  // background white 
 	//glClearColor(0.0, 0.0, 0.0, 1.0);  // background black
	glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	
	//GLfloat mat_zero[] = { 0.0, 0.0, 0.0, 1.0 }; //black 
	GLfloat mat_transparent[] = { 1, 0, 0, 0.6}; //red 0.6 diffuse 
	GLfloat mat_emission[] = { 0.0, 0, 1, 1 }; // blue
	
	glRotatef (15.0, 1.0, 1.0, 0.0); 
	glRotatef (30.0, 0.0, 1.0, 0.0); 
	glMaterialfv(GL_FRONT, GL_EMISSION, mat_emission);//blue 
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_transparent);//red 0.6 diffuse 
	glEnable (GL_BLEND); 
	glDepthMask (GL_FALSE);// make the depth buffer read only
						// while drawing the translucent objects 
	//glBlendFunc (GL_SRC_ALPHA, GL_ONE);
	
	// Case 3A-2: a different blending method
	glBlendFunc (GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA); 
	glCallList (cubeList); 
	glDepthMask (GL_TRUE);
	glDisable (GL_BLEND);
	
	glFlush();
	glutSwapBuffers();
} 


// case 3B
/*
void display() 
{
	glClearColor(0.0, 0.0, 0.0, 1.0);  // background black !!!!
	glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
 
	//GLfloat mat_zero[] = { 0.0, 0.0, 0.0, 1.0 }; //black 
	GLfloat mat_transparent[] = { 1, 0, 0, 0.6}; //red 0.6 diffuse 
	GLfloat mat_emission[] = { 0.0, 0, 1, 1 }; // blue
 
	glRotatef (15.0, 1.0, 1.0, 0.0); 
	glRotatef (30.0, 0.0, 1.0, 0.0); 
	glMaterialfv(GL_FRONT, GL_EMISSION, mat_emission);//blue 
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_transparent);//red 0.6 diffuse 
	glEnable (GL_BLEND); 
	glDepthMask (GL_FALSE);// make the depth buffer read only
							// while drawing the translucent objects 
	// glDepthMask (GL_TRUE);     // case 3B-2    make the depth buffer writable 
	glBlendFunc (GL_SRC_ALPHA, GL_ONE);
	glCallList (cubeList); 
	glDepthMask (GL_TRUE);    
	glDisable (GL_BLEND);
 
	glFlush();
	glutSwapBuffers();
 } */


// Respond to arrow keys
void SpecialKeys(int key, int x, int y)
{
    if(key == GLUT_KEY_UP)
        cameraY += .2f;
	
    if(key == GLUT_KEY_DOWN)
        cameraY -= .2f;
	
    if(key == GLUT_KEY_LEFT)
        cameraX -= .2f;
	
    if(key == GLUT_KEY_RIGHT)
        cameraX += .2f;
	
    glMatrixMode(GL_MODELVIEW); // position and aim the camera
    glLoadIdentity();
    gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
	
    // Refresh the Window
    glutPostRedisplay();
}
