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
	
	glClearColor(0.0, 0.0, 0.0, 0.0);
	
	glEnable(GL_DEPTH_TEST);
	
	// setup one light
	GLfloat mat_specular[] = { 0.1, 0.1, 0.1, 1 } ; //dark gray specular light 
	GLfloat mat_shininess[] = { 127 }; // concentrated specular spot 
	GLfloat position[] = { 0, 0, 1.0, 0 };   //  toward –Z directional light
	
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular); 
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess); 	//light shining head on 	
	glLightfv(GL_LIGHT0, GL_POSITION, position);
	glEnable(GL_LIGHTING); 
	glEnable(GL_LIGHT0); 	//one light source
	
	// create display list for a cube to be used later 
	cubeList = glGenLists(1); 
	glNewList(cubeList, GL_COMPILE); 
	glColor4f(0, 1, 1, 0.25); // transparent cube
	glutSolidCube (0.6);
	glEndList();
}	

void display() 
{
	glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	
	//GLfloat mat_zero[] = { 0.0, 0.0, 0.0, 1.0 }; //black 
	GLfloat mat_transparent1[] = { 1, 0, 0, 0.6}; // red 0.6 diffuse 
	GLfloat mat_transparent2[] = { 1, 0, 0, 0.8}; // red 0.8 diffuse 
	GLfloat mat_transparent3[] = { 1, 0, 0, 1}; // red 1 diffuse 
	GLfloat mat_emission[] = { 0.0, 0, 1, 1 }; // blue
	
	// Cube on the left: diffuse = red, alpha = 0.6
	glPushMatrix (); 
	glTranslatef (-1, 0, 0);     
	glRotatef (15.0, 1.0, 1.0, 0.0); 	
	glRotatef (30.0, 0.0, 1.0, 0.0); 	
	glMaterialfv(GL_FRONT, GL_EMISSION, mat_emission);//blue
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_transparent1);//red
	glEnable (GL_BLEND); 
	glBlendFunc (GL_SRC_ALPHA, GL_ONE); 
	glCallList (cubeList);    // use  a display list to draw the cubes
	glDisable (GL_BLEND); 
	glPopMatrix ();
	glFlush();
	
	// Cube in the middle: diffuse = red, alpha = 0.8
	glPushMatrix (); 
	glTranslatef (0, 0, 0); 
	glRotatef (15.0, 1.0, 1.0, 0.0); 
	glRotatef (30.0, 0.0, 1.0, 0.0);
	glMaterialfv(GL_FRONT, GL_EMISSION, mat_emission);//blue 
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_transparent2);//red
	glEnable (GL_BLEND); 
	glBlendFunc (GL_SRC_ALPHA, GL_ONE);            
	glCallList (cubeList); 
	glDepthMask (GL_FALSE); 
	glDisable (GL_BLEND);
	glPopMatrix ();
	
	//Cube on the right: diffuse=red, alpha = 1
	glPushMatrix (); 
	glTranslatef (1, 0, 0);
	glRotatef (15.0, 1.0, 1.0, 0.0); 
	glRotatef (30.0, 0.0, 1.0, 0.0); 
	glMaterialfv(GL_FRONT, GL_EMISSION, mat_emission);  //blue
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_transparent3);  //red
	
	glEnable (GL_BLEND); 
	glBlendFunc (GL_SRC_ALPHA, GL_ONE); 
	glCallList (cubeList); 
	glDisable (GL_BLEND); 
	glPopMatrix ();
	
	glFlush(); 
	glutSwapBuffers();
} 


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