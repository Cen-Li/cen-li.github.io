// An example to demonstrate :
//	the position of camera, gluLookAt function
//	3D zoom in and out
//	rotation of 3D objects and animation

#include "Camera.h"

#include <iostream>
using namespace std;

#define WIDTH 640
#define HEIGHT 480
#define GOLDEN_RATIO 1.618

#define startupCameraX 25
#define startupCameraY 6
#define startupCameraZ 10

#define GL_PI 3.1415926

// rotation amount
GLdouble  xRot=0; 

// starting camera position
GLdouble  cameraX=startupCameraX;
GLdouble  cameraY=startupCameraY;
GLdouble  cameraZ=startupCameraZ;

// aspect ratio
GLdouble aspectRatio=WIDTH/HEIGHT;
GLdouble ww_x = 14.0*aspectRatio;
GLdouble ww_y = 14.0;

bool animation=false;

Camera myCamera;  // camera object

// user defined functions
void MyInit();
void Draw();
void SpecialKeys(int key, int x, int y);
void TimerFunction(int value);
void myKeyboard(unsigned char theKey, int x, int y);

int main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(WIDTH, HEIGHT);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("3D viewing with camera");
	glutDisplayFunc(Draw);
	glutSpecialFunc(SpecialKeys);
	glutTimerFunc(40, TimerFunction, 1);
	glutKeyboardFunc(myKeyboard);
	glViewport(0, 0, WIDTH, HEIGHT);  // same as world window
	
	MyInit();
	
	glutMainLoop();
	
	return 0;
}

void MyInit()
{
	// Option 1: use orthographic projection
        // In this case, forward and backward with camera do not have effects
        /*
	glMatrixMode(GL_PROJECTION); // set the view volume shape
	glLoadIdentity();
	glOrtho(-ww_x, ww_x, -ww_y, ww_y, -0.1, 100);
        */
	
        // Option 2: use perspective projection
        // May use forward and backward
        myCamera.setShape(45, 1, 1, 100);

        myCamera.set(cameraX, cameraY, cameraZ,   0, 0, 0,   0, 1, 0);
	
	glClearColor(0.4f, 0.4f, 0.4f, 0.0f);  

	glEnable(GL_DEPTH_TEST);
}	

void DrawTop()
{
	float  x, y;
    	int    iPivot=0;

        glPushMatrix();

        // Begin a triangle fan
        glBegin(GL_TRIANGLE_FAN);

        // Pinnacle of cone is shared vertex for fan, moved up Z axis
        // to produce a cone instead of a circle
        glColor3f(0.5, .7, 0);
        glVertex3f(0.0f, 0.0f, 2.0f);

        // Loop around in a circle and specify even points along the circle
        // as the vertices of the triangle fan
        for(float angle = 0.0f; angle <= (2.5f*GL_PI); angle += (GL_PI/8.0f))
        {
                // Calculate x and y position of the next vertex
                y = 4.0f*sin(angle);
                x = 4.0f*cos(angle);

                // Alternate color between red and green
                if((iPivot %2) == 0)
                        glColor3ub(45, 45, 60);
                else
                        glColor3ub(80, 80, 80);

                // Increment pivot to change color next time
                iPivot++;

                // Specify the next vertex for the triangle fan
                glVertex3f(x, y, 0);
        }

        // Done drawing fan for cone
        glEnd();
	
	glPopMatrix();
}

void DrawLeg()
{
	glPushMatrix();
        GLUquadricObj * qobj;
        qobj = gluNewQuadric();
        gluQuadricDrawStyle(qobj, GLU_FILL);

	glRotated(90, 1, 0, 0);
        gluCylinder(qobj, 0.4, 0.4, 5, 8,8);
	glPopMatrix();
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< draw scene >>>>>>>>>>>>>>>>>>>>>>
void Draw()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // clear the screen
	
	glPushMatrix();  // A1
  

    // draw top
    glColor3f(0, 0.5, 0.4);
	glPushMatrix();	// all the translations starting from (0, 0, 0)
	glTranslated(0, 4.8, 0);  
  	glRotated(-90, 1, 0, 0);
    DrawTop();
	glPopMatrix();		

	// draw base level 1
	glColor3f(.5, .5, .5);
	glPushMatrix();	
    glScaled(1, 0.15, 1);
	glTranslated(0, -1, 0);
	glRotated(45, 0, 1, 0);
    glutSolidCube(7);
	glPopMatrix();		

	// draw base level 2
	glColor3f(.7, .7, .7);
	glPushMatrix();	
    glTranslated(0, -1, 0);
    glScaled(1, 0.1, 1);
	glRotated(45, 0, 1, 0);
    glutSolidCube(9);
	glPopMatrix();		

        // draw 4 posts
	glPushMatrix();   // B1
	glRotated(xRot, 0, 1, 0);
  
	// post 1
    glPushMatrix(); // C1
    glColor3f(.2, .2, .35);
    glTranslated(2.5, 5, 0);
	DrawLeg();

	// post 2
    glTranslated(-5, 0, 0);
	DrawLeg();

	// post 3
    glTranslated(2.5, 0, -2.5);
	DrawLeg();

	// post 4
    glTranslated(0, 0, 5);
	DrawLeg();

	glPopMatrix();   // C2
	glPopMatrix();   // B2
	glPopMatrix();   // A2

	glutSwapBuffers();
}


// Respond to arrow keys
void SpecialKeys(int key, int x, int y)
{
	if(key == GLUT_KEY_UP)
                myCamera.slide(0, 0.1, 0);
 	else if(key == GLUT_KEY_DOWN)
                myCamera.slide(0, -0.1, 0);
	else if(key == GLUT_KEY_LEFT)
                myCamera.slide(-0.1, 0, 0);
	else if(key == GLUT_KEY_RIGHT)
                myCamera.slide(0.1, 0, 0);
	
	// Refresh the Window
	glutPostRedisplay();
}

void myKeyboard(unsigned char theKey, int x, int y)
{
	switch(theKey)
	{
		case 'f':		// move camera forward, zoom in
                        myCamera.slide(0, 0, -0.1);
			break;
		case 'F':
                        myCamera.slide(0, 0, -0.2);
			break;
			
		case 'b':		// move camera backward, zoom out
                        myCamera.slide(0, 0, 0.1);
			break;
		case 'B':
                        myCamera.slide(0, 0, 0.2);
			break;
			
		case 'r':
			myCamera.roll(1.0);  // Camera roll left
			break;
		case 'R':
			myCamera.roll(-1.0);  // Camera roll right
			break;
			
 		case 'y':
			myCamera.yaw(1.0);   // Camera yaw to left
			break;
		case 'Y': 
			myCamera.yaw(-1.0);  // Camera yaw to right
			break;
		case 'p':
			myCamera.pitch(1.0);  // Camera pitch up
			break;
		case 'P':
			myCamera.pitch(-1.0);  // Camera pitch down
			break;
		case 'i':
		case 'I':
			// option 1: orthographics projection
			/*  
			glMatrixMode(GL_PROJECTION); // set the view volume shape
			glLoadIdentity();
			glOrtho(-ww_x, ww_x, -ww_y, ww_y, -0.1, 100);
			*/

			// option 2: perspective projection
        		myCamera.setShape(45, 1, 1, 100);

 		        myCamera.set(startupCameraX, startupCameraY, startupCameraZ,   0, 0, 0,   0, 1, 0);
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

	glutPostRedisplay();
}

void TimerFunction(int value)
{
	if (animation)
	{
		xRot -= 15.0;
		xRot = (GLfloat)((const int)xRot % 360);

		// Redraw the scene with new coordinates every 20 milliseconds
		glutPostRedisplay();
	
		// important!! otherwise timer function is not called again
		glutTimerFunc(70, TimerFunction, 1);
	}
}
