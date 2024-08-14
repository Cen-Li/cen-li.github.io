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

#define startupCameraX 0.2
#define startupCameraY 0.0
#define startupCameraZ 5.0

// rotation amount
GLdouble	xRot=0; 

// starting camera position
GLdouble	cameraX=startupCameraX;
GLdouble	cameraY=startupCameraY;
GLdouble	cameraZ=startupCameraZ;

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
void TimerFunction(int value);
void myKeyboard(unsigned char theKey, int x, int y);

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
	glutTimerFunc(20, TimerFunction, 1);
	glutKeyboardFunc(myKeyboard);
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
	
	glClearColor(0.0f, 0.5f, 0.5f, 0.0f);  

	GLfloat mat_ambient[] = {0.0, 0.5, 0.8, 1.0 };   // object material settings
	GLfloat mat_specular[] = {1.0, 1.0, 1.0, 1.0 };
	GLfloat mat_shininess[] = {80.0 };
	GLfloat light_position0[] = {-1.0, 0.0, 0.0, 0.0 };  // light position
	GLfloat light_position1[] = {0.0, 1, -1.0, 0.0 };  // light position

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
	
	glEnable(GL_DEPTH_TEST);
}	


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< draw scene >>>>>>>>>>>>>>>>>>>>>>
void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // clear the screen
	
	glPushMatrix();
	glRotated(xRot, 0, 1, 0);
	
	glPushMatrix();	// all the translations starting from (0, 0, 0)
	// draw sphere at (1,1,0)
	glTranslated(-0.5, 0, 0);
	glutSolidSphere(0.5, 15, 10);
	glPopMatrix();		

	// draw cone at (1.5, 0, 0)
	glPushMatrix();	
	glTranslated(1.5, 0,0.0);	
	glRotated(-90, 0, 1, 0);   // rotate cone so the top points to -x
	glutSolidCone(0.5, 1.5, 10, 8);  // height of the cone = translation amount along x
	glPopMatrix();		

	glPopMatrix();
	glutSwapBuffers();
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

void myKeyboard(unsigned char theKey, int x, int y)
{
	switch(theKey)
	{
		case 'd':       // change camera position, always looking at (0, 0, 0)
		case 'D':
			cout << "Enter camera position in y=0 plane in terms of x, y, z coordinates\n" ;
			cin >> cameraX >> cameraY >> cameraZ;
			glMatrixMode(GL_MODELVIEW); // position and aim the camera
			glLoadIdentity();
			gluLookAt(cameraX, 0, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); 
			// since y-axis is used as (fixed) normal, all user input should have y==0
			break;
			
		case 'f':		// move camera forward, zoom in
		case 'F':
			delta += 0.1;
			glMatrixMode(GL_PROJECTION);
			glLoadIdentity();
			glOrtho (-ww_x+delta, ww_x-delta, -ww_y+delta, ww_y-delta, 0.1, 100 );
			
			glMatrixMode(GL_MODELVIEW); // position and aim the camera
			glLoadIdentity();
			gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
			break;
			
		case 'b':		// move camera backward, zoom out
		case 'B':
			delta -= 0.1;
			glMatrixMode(GL_PROJECTION);
			glLoadIdentity();
			glOrtho (-ww_x+delta, ww_x-delta, -ww_y+delta, ww_y-delta, 0.1, 100 );
			
			glMatrixMode(GL_MODELVIEW); // position and aim the camera
			glLoadIdentity();
			gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
			break;
			
		case 'i':
		case 'I':
			glMatrixMode(GL_PROJECTION); // set the view volume shape
			glLoadIdentity();
			glOrtho(-2.0*64/48.0, 2.0*64/48.0, -2.0, 2.0, 0.1, 100);
			glOrtho(-ww_x, ww_x, -ww_y, ww_y, 0.1, 100);

			
			glMatrixMode(GL_MODELVIEW); // position and aim the camera
			glLoadIdentity();
			cameraX=startupCameraX;
			cameraY=startupCameraY;
			cameraZ=startupCameraZ;
			
			gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
			break;
			
		case 'r':    // CCW rotation
			xRot += 10;
			xRot = (GLfloat)((const int)xRot % 360);
			break;
			
		case 'R': 
			xRot -= 10;  // CW rotation
			xRot = (GLfloat)((const int)xRot % 360);
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
	//glutSwapBuffers();
	glutPostRedisplay();     // invoke the "Draw" function to actually display the new image
}

void TimerFunction(int value)
{
	if (animation)
	{
		xRot -= 15.0;
		xRot = (GLfloat)((const int)xRot % 360);

		glMatrixMode(GL_MODELVIEW); // position and aim the camera
		glLoadIdentity();
		glRotated(xRot, 0, 1, 0);
				
		// Redraw the scene with new coordinates every 20 milliseconds
		glutPostRedisplay();
	
		// important!! otherwise timer function is not called again
		glutTimerFunc(50, TimerFunction, 1);
	}
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
		//glOrtho (-w, w, -w*h/w, w*h/w, 0.1, 100 );
        glOrtho (-nRange, nRange, -nRange*h/w, nRange*h/w, 0.01, 100.0);
    else 
		//glOrtho (-y*w/h, y*w/h, -h, h, 0.1, 100 );
        glOrtho (-nRange*w/h, nRange*w/h, -nRange, nRange, 0.01, 100.0);
	
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
	//gluLookAt(cameraX, cameraY, cameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point

}

