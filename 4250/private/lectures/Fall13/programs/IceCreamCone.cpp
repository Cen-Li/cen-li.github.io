// Illustrating OpenGL lighting
// This program will draw an ice cream cone.
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

#include <stdlib.h>
using namespace std;

void MyInit();
void Draw();
void myKeyboard(unsigned char theKey, int x, int y);

int main(int argc, char **argv) 
{
	
	//initialize glut
	glutInit (&argc, argv);
	
        //request a depth buffer
	glutInitDisplayMode (GLUT_DEPTH |GLUT_RGB|GLUT_SINGLE);
	
	// Set top left corner of window to be at location (0, 0)
	// Set the window size to be 500x500 pixels
	glutInitWindowSize(500, 500);
	glutInitWindowPosition (0,0);
	
	glutCreateWindow ("Ice Cream Cone");
	
	MyInit();
	
	//register callback functions
	glutDisplayFunc (Draw);
	glutKeyboardFunc(myKeyboard);
	
	//enter the main loop
	glutMainLoop();
	
}

//This function initializes lighting and the orthographic
//projection.  It enables several items.
void MyInit() 
{
	//set the light source properties
	float lightIntensity[] = {1.0f, 1.0f, 1.0f, 1.0f};
	float light_position[] = {2.0f, 6.0f, 3.0f, 0.0f};
	glLightfv (GL_LIGHT0, GL_POSITION, light_position);
	glLightfv (GL_LIGHT0, GL_DIFFUSE, lightIntensity);
	glLightfv (GL_LIGHT0, GL_SPECULAR, lightIntensity);
	
        //set the background color to white
    	glClearColor(1.0, 1.0, 1.0, 1.0);
	
    	//set the bounding box for an orthographic projection
	glMatrixMode(GL_PROJECTION);
	
	// Set the projection matrix to be the identity matrix
	glLoadIdentity();
	
	// Define the dimensions of the Orthographic Viewing Volume
	glOrtho(-8.0, 8.0, -8.0, 8.0, -8.0, 8.0);
	
	// Choose the modelview matrix to be the matrix
	// manipulated by further calls
	glMatrixMode(GL_MODELVIEW);
	
	//Enable lighting
	glEnable (GL_LIGHTING);
	glEnable (GL_LIGHT0);
	
    	//Request smooth shading
	glShadeModel (GL_SMOOTH);
	
    	//request hidden surface removal
	glEnable (GL_DEPTH_TEST);
	
    	//request normalization of all normals
	glEnable (GL_NORMALIZE);
}

//
// This is the display callback.  An ice cream cone consisting of
// a cone and a sphere (for the ice cream) is drawn.
void Draw() 
{
    	//set up the material properties
    	float mat_ambient[] = {0.8f, .7f, 0.0f, 1.0f};  //yellowish
	float mat_diffuse[] = {.8f, .8f, .0f, 1.0f};    //yellow
	float mat_specular[] = {1.0f, 1.0f, 1.0f, 1.0f};//white
	float mat_shininess[] = {50.0f};                
	
	// Clear the RGB buffer and the depth buffer
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	
	//Draw a solid Cone in Yellow. First request the material 
    	//properties
    	glMaterialfv (GL_FRONT, GL_AMBIENT, mat_ambient);
	glMaterialfv (GL_FRONT, GL_DIFFUSE, mat_diffuse);
	glMaterialfv (GL_FRONT, GL_SPECULAR, mat_specular);
	glMaterialfv (GL_FRONT, GL_SHININESS, mat_shininess);
	glLoadIdentity();
	
    	//The cone is centered about the z-axis with the 
    	//circular part in the xy plane.  Thus rotate
    	//about the x-axis so it will be centered about
    	//the y-axis with the circular part in the xz plane.
	glRotatef (90, 1.0, 0.0, 0.0);
	
    	//draw a cone with a radius of 2 and a height of 6
	glutSolidCone(2.0, 6.0, 10, 10);
	
	//Draw a sphere for the ice cream.  The ice cream color
    	//should be red.
   	mat_ambient[0] = .8; mat_ambient[1] = 0.; mat_ambient[2] = 0.;
    	mat_diffuse[0] = .8; mat_diffuse[1] = 0.; mat_diffuse[2] = 0.;
   	glMaterialfv (GL_FRONT, GL_DIFFUSE, mat_diffuse);
    	glMaterialfv (GL_FRONT, GL_AMBIENT, mat_ambient);
	
    	//Translate the ice cream by a small amount up in
    	//x so it will fit properly in the cone.
	glLoadIdentity();
	
	/*glTranslatef(0.0, .6, 0.0);
	 glRotatef (45, 1.0, 0.0, 0.0);*/
	glutSolidSphere (2.0, 30, 30);
	
	// Flush the buffer to force drawing of all objects thus far
	glFlush();
}


void myKeyboard(unsigned char theKey, int x, int y)
{
	switch(theKey)
	{
		case 'q':   // end display
			exit (0);
		default:
			if (theKey == 27)   // ASCII for escape character
				exit(0);
	}

	glutPostRedisplay();     // invoke the "Draw" function to actually display the new image
}
