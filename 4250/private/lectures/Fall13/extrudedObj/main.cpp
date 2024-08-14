//This program demonstrates the an extruded mesh.
//
// Keyboard:
//    Pressing left or right arrow keys rotates the extruded mesh object left or right around Y-axis
//    Pressing up or down arrow keys rotates the object up or down around X-axis
// Menu selction by right mouse click:
//    base of the extruded shape maybe a triangle, a star, or a half circle

// !!!!!!!!
// IN case you have problem creating the extruded capital letter,
// check out the hints given in group discussion in PeerSpace.
//

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

#include "extrudedMesh.h"

#define BARN 0
#define STAR 1
#define HALF_CIRCLE 2

// rotation amount
GLdouble	xRot=0; 
GLdouble	yRot=0;
GLdouble    PI=3.14159;

GLint drawObj=BARN;

void SpecialKeys(int key, int x, int y);
void MyDisplay();
void MyInit();
void MyReshape(int w, int h);
void ProcessMenuEvents(int option);
Point3 * MeshBase_Barn();
Point3 * MeshBase_Star();
Point3 * MeshBase_HalfCircle();
void myKeyboard(unsigned char theKey, int x, int y);

int main(int argc, char** argv)
{
	//create the window
	glutInit(&argc, argv);
	glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize (500, 500); 
	glutInitWindowPosition (100, 100);
	glutCreateWindow (argv[0]);
	glutSpecialFunc(SpecialKeys);
	
	//initialize lighting & material properties
	MyInit();
	
	//set up callbacks
	glutReshapeFunc (MyReshape);
	glutDisplayFunc(MyDisplay);
	
	glutCreateMenu(ProcessMenuEvents);
	glutAddMenuEntry("Base as Triangle", BARN);
	glutAddMenuEntry("Base as Star", STAR);
	glutAddMenuEntry("Base as HALF CIRCLE", HALF_CIRCLE);
	glutAttachMenu(GLUT_RIGHT_BUTTON);
	
	glutKeyboardFunc(myKeyboard);
	
	//start the main loop
	glutMainLoop();
	
    return 0;             
}

//This is the display function.  Each time it draws a barn,
//it is rotated by an angle, spin.
void MyDisplay()
{
	int numVertex;
	float height;
	
	//set the background to black and clear the buffers
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	
	Point3 *MeshBase;
	if (drawObj == BARN)	
	{
	    MeshBase = MeshBase_Barn();
		numVertex=3;
		height=2;
	}
	else if (drawObj == STAR)
	{
		MeshBase = MeshBase_Star();
		numVertex=12;
		height=2;
	}
	else if (drawObj == HALF_CIRCLE)
	{
		MeshBase = MeshBase_HalfCircle();
		numVertex=11;
		height=2;
	}
	
	//rotate the shape by XRot degrees along X-axis, and YRot along Y-axis
	glPushMatrix();  // save current CT setting
	glRotated(xRot, 1.0f, 0.0f, 0.0f);
	glRotated(yRot, 0.0f, 1.0f, 0.0f);
	
	//create a mesh for the barn (3 vertex in base, with height=2)
	//create a mesh for the Star (12 vertex in base, with height=2)
	ExtrudedMesh mymesh(MeshBase, numVertex, height);
	
	//draw the mesh
	mymesh.draw();
	
	glPopMatrix();   // restore the matrix state
	
	delete [] MeshBase;//release memory
	
	//make it appear on the screen
	glFlush();
}

// draws a triangle in the z=0 plane
Point3 * MeshBase_Barn()
{
	Point3 *ar=new Point3 [3];
	ar[0].set(0.0,0.0,0.0);
	ar[1].set(1.0,0.0,0.0);
	ar[2].set(0.0,1.0,0.0);
	
	return ar;
}

// draws a star in the z=0 plane
Point3 * MeshBase_Star()
{
	GLfloat R=2.0, r=0.8;
	GLint n=6;
	GLint k=0;
	
	GLfloat alpha=2*PI/(2*n);
	
	Point3 *ar=new Point3 [2*n];
	
	for (GLint i=0; i<2*n; i+=2)
	{
		// point from inner circle
		ar[k++].set(r*cos(i*alpha), r*sin(i*alpha), 0);
		
		// point from outer circle
		ar[k++].set(R*cos((i+1)*alpha), R*sin((i+1)*alpha), 0);
	}
	
	return ar;
}

// draws a half circle in the z=0 circle
Point3 * MeshBase_HalfCircle()
{	
	int n=10;
	GLfloat R=2.0;
	
	Point3 *ar=new Point3 [n+1];
	
	GLfloat alpha=PI/n;
	for (GLint i=0; i<n+1; i++)
	{
		ar[i].set(R*cos(i*alpha), R*sin(i*alpha), 0);
	}
	
	return ar;
}

void ProcessMenuEvents(int option)
{
	switch (option)
	{
		case BARN:  drawObj=BARN;
			break;
		case STAR:  drawObj=STAR;
			break;
		case HALF_CIRCLE: drawObj=HALF_CIRCLE;
			break;
	}
	
	glutSwapBuffers();
	glutPostRedisplay();
}

//This function initializes the lighting and material properties.
//There is one positional light in the scene.
void MyInit()
{
	//set up material and lighting arrays
	GLfloat ambient[] = {1.0, 1.0, 1.0, 1.0};
	GLfloat position[] = {2.0, 2.0, 2.0, 1.0};
	GLfloat mat_diffuse[] = {0.6, 0.6, 0.6, 1.0};
	GLfloat mat_specular[] = {1.0, 1.0, 1.0, 1.0};
	GLfloat mat_shininess[] = {128.0};
	
	//enable lighting
	glEnable(GL_LIGHTING);
	glEnable(GL_LIGHT0);
	
	//set the light properties
	glLightfv(GL_LIGHT0, GL_AMBIENT, ambient);
	glLightfv (GL_LIGHT0, GL_DIFFUSE, mat_diffuse);
	glLightfv(GL_LIGHT0, GL_POSITION, position);
	glLightf(GL_LIGHT0,GL_SPOT_EXPONENT,128);
	
	//set the material properties
	mat_diffuse[2]=0.0; mat_diffuse[1] = 0.0;
	glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, mat_diffuse);
	glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, mat_specular);
	glMaterialfv(GL_FRONT_AND_BACK, GL_SHININESS, mat_shininess);
	
	//enable hidden surface removals, etc.
	glEnable(GL_DEPTH_TEST);
	//glEnable(GL_NORMALIZE);
	glShadeModel(GL_SMOOTH);
}

// Respond to arrow keys
void SpecialKeys(int key, int x, int y)
{
	if(key == GLUT_KEY_UP)
		xRot -= 5.0f;
	
	if(key == GLUT_KEY_DOWN)
		xRot += 5.0f;
	
	if(key == GLUT_KEY_LEFT)
		yRot -= 5.0f;
	
	if(key == GLUT_KEY_RIGHT)
		yRot += 5.0f;
	
	xRot = (GLfloat)((const int)xRot % 360);
	yRot = (GLfloat)((const int)yRot % 360);
	
	// Refresh the Window
	glutPostRedisplay();
}

void myKeyboard(unsigned char theKey, int x, int y)
{
	if (theKey == 'q' || theKey == 27) {
		exit(0);
	}
	glutPostRedisplay();  
}

//This is the reshape callback.
void MyReshape(int w, int h)
{
	//set the viewport to the entire window
	glViewport(0, 0, w, h);
	
	//use an orthographic view volume of a cube
	//centered about the origin
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	if (w <= h)
		glOrtho(-3.0, 3.0, -3.0*(GLfloat)h/(GLfloat)w, 
				3.0*(GLfloat)h/(GLfloat)w, -3.0, 3.0);
	else
		glOrtho(-3.0*(GLfloat)w/(GLfloat)h, 
				3.0*(GLfloat)w/(GLfloat)h, -3.0, 3.0, -3.0, 3.0);
}

