
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
void keyboard(unsigned char key, int x, int y);
void SpecialKeys(int key, int x, int y);

int main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(WIDTH, HEIGHT);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("color blending case 5 ");
	glutDisplayFunc(display);
	glutKeyboardFunc(keyboard);
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
	
	// create display list for a cube to be used later 
	cubeList = glGenLists(1); 
	glNewList(cubeList, GL_COMPILE); 
	glColor4f(0, 1, 1, 0.25); // transparent cube
	glutSolidCube (1);
	glEndList();

	// create display list for a sphere to be used later 
	sphereList = glGenLists(1); 
	glNewList(sphereList, GL_COMPILE);
	glColor4f(.75, .75, 0.25, 1.0); // solid sphere
	glutSolidSphere (.75, 20, 20);
	glEndList();
}	
/*
void display() 
{
	glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	
	// Draw the translucent cube closer to camera 
	glPushMatrix ();
	glTranslatef (0.15, 0.15, transparentZ); 
	
	glEnable (GL_BLEND);
	glBlendFunc (GL_SRC_ALPHA,GL_ONE_MINUS_SRC_ALPHA);	
	glCallList (cubeList);
	glDisable (GL_BLEND); 
	glPopMatrix ();
	
	// Draw the solid sphere farther from camera 
	glPushMatrix ();
	glTranslatef (-0.15, -0.15, solidZ);
	glCallList (sphereList); // draw the solid sphere
	glPopMatrix ();
	
	glutSwapBuffers();
} */

/* version 2 */

void display() 
{
	glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
		
	// Draw the solid sphere farther from camera 
	glPushMatrix ();
	glTranslatef (-0.15, -0.15, solidZ);
	glCallList (sphereList); // draw the solid sphere
	glPopMatrix ();
	
	// Draw the translucent cube closer to camera 
	glPushMatrix ();
	glTranslatef (0.15, 0.15, transparentZ); 
	
	glEnable (GL_BLEND);
	glBlendFunc (GL_SRC_ALPHA,GL_ONE_MINUS_SRC_ALPHA);	
	glCallList (cubeList);
	glDisable (GL_BLEND); 
	glPopMatrix ();
		
	glutSwapBuffers();
}

void ChangeLocation() 
{ 	
	transparentZ -= ZINC;
	glutPostRedisplay();
}


void keyboard(unsigned char key, int x, int y) 
{
 	switch (key) {
		case 'a':
		case 'A':	ChangeLocation(); 			
					glutPostRedisplay(); 
					break;
		case 'r':
		case 'R':	transparentZ = MAXZ;
					glutPostRedisplay();
					break; 
		case 27:	exit(0);
	}
}

// Respond to arrow keys
void SpecialKeys(int key, int x, int y)
{
    if(key == GLUT_KEY_UP)
        cameraY += .1f;
	
    if(key == GLUT_KEY_DOWN)
        cameraY -= .1f;
	
    if(key == GLUT_KEY_LEFT)
        cameraX -= .1f;
	
    if(key == GLUT_KEY_RIGHT)
        cameraX += .1f;
	
    glMatrixMode(GL_MODELVIEW); // position and aim the camera
    glLoadIdentity();
    gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
	
    // Refresh the Window
    glutPostRedisplay();
}