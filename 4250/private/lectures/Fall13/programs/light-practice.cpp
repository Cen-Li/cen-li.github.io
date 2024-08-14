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
using namespace std;

#define WIDTH 640
#define HEIGHT 480

#define Ball 0
#define RedBall 1
#define YellowBall 2
#define Block 3

// starting camera position
GLdouble	cameraX=0.0;
GLdouble	cameraY=2.0;
GLdouble	cameraZ=3.0;

// aspect ratio
GLdouble aspectRatio=WIDTH/HEIGHT;
GLdouble ww_x = 2.*aspectRatio;
GLdouble ww_y = 2.;

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
	glutInitWindowPosition(200, 200);
	glutCreateWindow("lighting testbed");
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
	
	glMatrixMode(GL_MODELVIEW); // position and aim the camera
	glLoadIdentity();
	gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
	
	glClearColor(1.0f, 0.5f, 0.5f, 0.0f);  

	GLfloat model_ambient[] = {0.2, 0.2, 0.2, 1.0 };    // global ambient lighting

	// define object diffuse and ambient light reflecting properties
	GLfloat mat_ambient[] = {0.23, 0.23, 0.23, 1.0 };  // gray ambient
	
	// define object specular light reflecting properties
	GLfloat mat_specular[] = {.5, .5, .5, 1.0 };
	GLfloat mat_shininess[] = {50.0 };
	
	// set global ambient light
	glLightModelfv(GL_LIGHT_MODEL_AMBIENT, model_ambient);
	
	glLightModeli(GL_LIGHT_MODEL_LOCAL_VIEWER, GL_TRUE);

	glClearColor(0.0, 0.0, 0.0, 0.0);  // background black
	
	// switch on electricity
	glEnable(GL_LIGHTING);
	
	// light0 properties
	GLfloat	light_specular[]={1, 1, 1, 1.0};  // specular light component
	GLfloat light_diffuse[] = {.6, .6, .6, 1.0}; // diffuse light component
	GLfloat light_ambient[] = {0.4, 0.4, 0.4, 1.0};   // ambient light component
	GLfloat light_position0[] = {-4.0, 0.0, 0.0, 0.0 };  // light position
	
	// set light0 properties: position, diffuse light component, ambient light component, and specular light component
	glLightfv(GL_LIGHT0, GL_POSITION, light_position0);
	glLightfv(GL_LIGHT0, GL_DIFFUSE, light_diffuse);
	glLightfv(GL_LIGHT0, GL_AMBIENT, light_ambient);
	glLightfv(GL_LIGHT0, GL_SPECULAR, light_specular);
	//glLighti(GL_LIGHT0, GL_SPOT_CUTOFF, 30); // set alpha to 30 -- try to reduce highlight area
	
	// turn on light 0
	glEnable(GL_LIGHT0);
	
	// enable all the OpenGL necessary tools
	glEnable(GL_DEPTH_TEST);  // perform hidden depth removal
	glEnable(GL_NORMALIZE);   // !!! important to get the right shading !!!
	glShadeModel (GL_SMOOTH);
	
	// define object diffuse and ambient light reflecting properties
	GLfloat mat_diffuse_red[] = {1.0, 0.0, 0.0, 1.0 }; // red obj
	GLfloat mat_diffuse_yellow[] = {1.0, 1.0, 0.0, 1.0}; // yellow obj
	
	// set specular light reflecting material for the two objects
	glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, mat_specular);
	glMaterialfv(GL_FRONT_AND_BACK, GL_SHININESS, mat_shininess);
	
	// set ambient light material properties for the two objects
	glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT, mat_ambient);
	
		
	// create display lists	
	// ball with no color	
	glNewList(Ball, GL_COMPILE);
	glPushMatrix();
		glutSolidSphere(1.0, 50, 50);
	glPopMatrix();
	glEndList();
	
	// red ball
	glNewList(RedBall, GL_COMPILE);
	glPushAttrib(GL_LIGHTING_BIT);
	glPushMatrix();
		glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse_red);  // set first ball to red
		glutSolidSphere(1.0, 250, 250);
	glPopMatrix();
	glPopAttrib();
	glEndList();
	
	// yellow ball
	glNewList(YellowBall, GL_COMPILE);
	glPushAttrib(GL_LIGHTING_BIT);
	glPushMatrix();
		glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse_yellow);// set second ball to yellow
		glutSolidSphere(1.0, 100, 100);
	glPopMatrix();
	glPopAttrib();
	glEndList();
	
	// Cube with no color
	glNewList(Block, GL_COMPILE);
	glPushMatrix();
		glutSolidCube(0.75);
	glPopMatrix();
	glEndList();
}	

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< draw scene >>>>>>>>>>>>>>>>>>>>>>
void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // clear the screen

	// define object diffuse and ambient light reflecting properties
	GLfloat mat_ambient[] = {0.23, 0.23, 0.23, 1.0 };  // gray ambient
	
	// define object specular light reflecting properties
	GLfloat mat_specular[] = {0.5, 0.5, 0.5, 1.0 };
	GLfloat mat_shininess[] = {100.0 };
	
	// set specular light reflecting material for the two objects
	glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, mat_specular);
	glMaterialfv(GL_FRONT_AND_BACK, GL_SHININESS, mat_shininess);

	// set ambient light material properties for the two objects
	glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT, mat_ambient);
			
	// reset light location
	glMatrixMode(GL_MODELVIEW); 
	glLoadIdentity();
	glPushMatrix();
		GLfloat light_position0[] = {-4.0, 2.0, 0.0, 1.0 };  // light position	
		glLightfv(GL_LIGHT0, GL_POSITION, light_position0);
	glPopMatrix(); 
	
	glPushMatrix();
	    gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
		// draw first ball
		glPushMatrix();
			glTranslated(1, 0, 0);
			glScaled(.6, .6, 0.6);
			glCallList(RedBall);
		glPopMatrix();
	
		// draw second ball
		glPushMatrix();
			glTranslated(-1, 0, 0);
			glScaled(0.6, 0.6, 0.6);
			glCallList(YellowBall);
		glPopMatrix();
	glPopMatrix();
	// draw cube with no lighting effect
	/*
	glDisable(GL_LIGHTING);
		glTranslated(-2, 0, 0);
		glColor4f(0, 1, 1, 1);
		glCallList(Block);
	glEnable(GL_LIGHTING);
	*/
		
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
        cameraX -= .1f;
	
    if(key == GLUT_KEY_RIGHT)
        cameraX += .1f;
	
	
    glMatrixMode(GL_MODELVIEW); // position and aim the camera
    glLoadIdentity();
			
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

