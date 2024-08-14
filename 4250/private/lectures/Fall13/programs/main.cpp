//This program demonstrates the an extruded mesh.
//
// Keyboard:
//    Pressing left or right arrow keys rotates the extruded mesh object left or right around Y-axis
//    Pressing up or down arrow keys rotates the object up or down around X-axis
// Menu selction by right mouse click:
//    base of the extruded shape maybe a triangle, a star, or a half circle
//    Pressing 'f' causes culling of the front face 
//    Pressing 'b' causes culling of the back face


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
#define HOLE 3
#define CharF 4

// rotation amount
GLdouble xRot=0; 
GLdouble yRot=0;
GLdouble PI=3.14159;

GLint drawObj=BARN;

void SpecialKeys(int key, int x, int y);
void MyDisplay();
void MyInit();
void MyReshape(int w, int h);
void ProcessMenuEvents(int option);
Point3 * MeshBase_Triangle();
Point3 * MeshBase_Star();
Point3 * MeshBase_HalfCircle();
Point3 * MeshBase_Hole();
Point3* MeshBase_F1();
Point3* MeshBase_F2();
Point3* MeshBase_F3();
void myKeyboard(unsigned char theKey, int x, int y);

int main(int argc, char** argv)
{
	//create the window
	glutInit(&argc, argv);
	glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
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
	glutAddMenuEntry("Base as Square and Hole", HOLE);
	glutAddMenuEntry("Base as F", CharF);
	glutAttachMenu(GLUT_RIGHT_BUTTON);
	
	glutKeyboardFunc(myKeyboard);
	
	//start the main loop
	glutMainLoop();
	
    return 0;             
}

//This is the display function.  Each time it draws a shape
//it is rotated by an angle, spin.
void MyDisplay()
{
	int numVertex;
	float height;
	
    glFrontFace(GL_CCW);   // possible values: GL_CCW and GL_CW

	//set the background to black and clear the buffers
	glClearColor(0.5, 0.5, 0.5, 1.0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	
	Point3 *MeshBase;
	Point3 *MeshBase2, *MeshBase3;
	if (drawObj == BARN)	
	{
        MeshBase = MeshBase_Triangle();
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
	else if (drawObj == HOLE)
	{
		MeshBase = MeshBase_Hole();
		numVertex=10;
		height=2;
	}
	else if (drawObj == CharF)
	{	MeshBase = MeshBase_F1();
		MeshBase2 = MeshBase_F2();
		MeshBase3 = MeshBase_F3();
		numVertex=4;
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
	
	if (drawObj == CharF)
	{
		ExtrudedMesh mymesh2(MeshBase2, numVertex, height);
		ExtrudedMesh mymesh3(MeshBase3, numVertex, height);
		mymesh2.draw();
		mymesh3.draw();
	}
	
	glPopMatrix();   // restore the matrix state
	
	delete [] MeshBase;//release memory
	
        glDisable(GL_CULL_FACE);

	//make it appear on the screen
	glutSwapBuffers();
	glFlush();
}

// first part of character 'F', CCW
Point3* MeshBase_F1()
{
	Point3 *ar=new Point3 [4];
	ar[0].set(0, 0, 0);
	ar[1].set(0, -1, 0);
	ar[2].set(2.5, -1, 0);
	ar[3].set(2.5, 0, 0);
	return ar;
}

// second part of char 'F', CCW
Point3* MeshBase_F2()
{
	Point3 *ar=new Point3 [4];
	ar[0].set(0, -1, 0);
	ar[1].set(0, -4.5, 0);
	ar[2].set(1, -4.5, 0);
	ar[3].set(1, -1, 0);
	return ar;
}

// third part of char 'F', CCW
Point3* MeshBase_F3()
{
	Point3 *ar=new Point3 [4];
	ar[0].set(1, -2, 0);
	ar[1].set(1, -3, 0);
	ar[2].set(2.5, -3, 0);
	ar[3].set(2.5, -2, 0);
	return ar;
}

Point3* MeshBase_Hole()
{
	Point3 *ar=new Point3 [10];
	
	ar[0].set(0, 0, 0);
	ar[1].set(1,1,0);
	ar[2].set(1, 2,0);
	
	ar[3].set(2, 2, 0);
	ar[4].set(2, 1, 0);

	ar[5].set(1, 1, 0);
	ar[6].set(0, 0, 0);
	
	ar[7].set(3, 0, 0);
	ar[8].set(3, 3, 0);
	
	ar[9].set(0, 3, 0);
	//ar[10].set(0, 0, 0);
	return ar;
}

// draws a triangle in the z=0 plane
// CCW order 
Point3 * MeshBase_Triangle()
{
	Point3 *ar=new Point3 [3];
	ar[0].set(0.0,0.0,0.0);
	ar[1].set(2.0,0.0,0.0);
	ar[2].set(0.0,2.0,0.0);
	
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
		case HOLE: drawObj=HOLE;
			break;
		case CharF: drawObj=CharF;
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
	switch (theKey)
	{
	case 'c':
	case 'C':
        	glEnable(GL_CULL_FACE);  // decides whether front or back-facing facet can be culled
		break;

	case 'd':
	case 'D':
        	glDisable(GL_CULL_FACE);  // decides whether front or back-facing facet can be culled
		break;

	case 'f':
	case 'F':
	        glCullFace(GL_FRONT); // possible values: GL_FRONT, GL_BACK, GL_FRONT_AND_BACK
		break;
	case 'b':
	case 'B':
	        glCullFace(GL_BACK); // possible values: GL_FRONT, GL_BACK, GL_FRONT_AND_BACK
		break;
	case 'q':
	case 27: 
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
		glOrtho(-5.0, 5.0, -5.0*(GLfloat)h/(GLfloat)w, 
				5.0*(GLfloat)h/(GLfloat)w, -5.0, 5.0);
	else
		glOrtho(-5.0*(GLfloat)w/(GLfloat)h, 
				5.0*(GLfloat)w/(GLfloat)h, -5.0, 5.0, -5.0, 5.0);
}

