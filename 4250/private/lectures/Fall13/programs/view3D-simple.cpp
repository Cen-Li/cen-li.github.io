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

// rotation amount
GLdouble	xRot=0; 
GLdouble	yRot=0;

// starting camera position
GLdouble	cameraX=0.2;
GLdouble	cameraY=0.0;
GLdouble	cameraZ=2.0;

// aspect ratio
GLdouble aspectRatio=WIDTH/HEIGHT;
GLdouble ww_x = 2.0*aspectRatio;
GLdouble ww_y = 2.0;

GLfloat delta = 0.0;

bool animation=false;

// user defined functions
void MyInit();
void Draw();
void ChangeSize(GLsizei w, GLsizei h);
void SpecialKeys(int key, int x, int y);

int main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(WIDTH, 480);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("3D viewing testbed ");
	glutDisplayFunc(Draw);
	glutReshapeFunc(ChangeSize);
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
	glOrtho(-ww_x, ww_x, -ww_y, ww_y, 0.1, 100);
	
	glMatrixMode(GL_MODELVIEW); // position and aim the camera
	glLoadIdentity();
	gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
	
	glClearColor(1.0f, 0.5f, 0.5f, 0.0f);  

	GLfloat mat_ambient[] = {0.0, 0.5, 0.8, 1.0 };   // object material settings
	GLfloat mat_specular[] = {1.0, 1.0, 1.0, 1.0 };
	GLfloat mat_shininess[] = {50.0 };
	GLfloat light_position0[] = {-1.0, 1.0, -2.0, 0.0 };  // light position
	GLfloat light_position1[] = {1.0, -1, -2.0, 0.0 };
	GLfloat light_position2[] = {1.0, -1.0, 2.0, 0.0 };
	GLfloat light_position3[] = {-1.0, -1.0, 2.0, 0.0 };

	GLfloat model_ambient[] = {0.5, 0.5, 0.5, 1.0 };    // lighting

	glClearColor(0.0, 0.0, 0.0, 0.0);
	
	// set lighting and material of the objects
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_ambient);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular);
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess);
	glLightModelfv(GL_LIGHT_MODEL_AMBIENT, model_ambient);

	// set light 0
	glEnable(GL_LIGHTING);

	glLightfv(GL_LIGHT0, GL_POSITION, light_position0);
	glEnable(GL_LIGHT0);
	
	// set light 1
	glLightfv(GL_LIGHT1, GL_POSITION, light_position1);
	glEnable(GL_LIGHT1);
	
	// set light 2
	glLightfv(GL_LIGHT2, GL_POSITION, light_position2);
	glEnable(GL_LIGHT2);
	

	// set light 3
	glLightfv(GL_LIGHT3, GL_POSITION, light_position3);
	glEnable(GL_LIGHT3);
	
	
	glEnable(GL_DEPTH_TEST);
}	


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< draw scene >>>>>>>>>>>>>>>>>>>>>>
void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // clear the screen
	
	glPushMatrix();  // save current CT setting
	glRotated(xRot, 1.0f, 0.0f, 0.0f);
	glRotated(yRot, 0.0f, 1.0f, 0.0f);
	
	glPushMatrix();	// all the translations starting from (0, 0, 0)
	// draw sphere at (-0.5,0,0)
	glTranslated(-0.5, 0, 0);
	glutSolidSphere(0.5, 15, 10);
	glPopMatrix();		

	// draw cone at (1.5, 0, 0)
	glPushMatrix();	
	glTranslated(1.5, 0,0.0);	
	glRotated(-90, 0, 1, 0);   // rotate cone so the top points to -x
	glutSolidCone(0.5, 1.5, 10, 8);  // height of the cone = translation amount along x
	glPopMatrix();		

	glPopMatrix();   // restore the matrix state
	glutSwapBuffers();
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

// Change viewing volume and viewport.  Called when window is resized

void ChangeSize(GLsizei w, GLsizei h)
{
	float nRange=2.0;
	
    // Prevent a divide by zero
    if(h == 0)
        h = 1;
	
    // Set Viewport to window dimensions
    glViewport(0, 0, w, h);
	
    // Reset coordinate system
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
	
    // Establish clipping volume (left, right, bottom, top, near, far)
    if (w <= h) 
        glOrtho (-nRange, nRange, -nRange*h/w, nRange*h/w, 0.01, 100.0);
    else 
        glOrtho (-nRange*w/h, nRange*w/h, -nRange, nRange, 0.01, 100.0);
	
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}

