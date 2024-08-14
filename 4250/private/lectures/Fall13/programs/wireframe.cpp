//
//  WiredFrame GLU objects
//
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

void DisplayWire();
void DrawAxis(double length);

int main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB );
	glutInitWindowSize(640,480);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Transformation testbed - wireframes");
	glutDisplayFunc(DisplayWire);
	glClearColor(1.0f, 1.0f, 1.0f,0.0f);  // background is white
	glViewport(0, 0, 640, 480);  // same as world window
	
	glutMainLoop();
	
	return 0;
}

//<<<<<<<<<<<<<<<<<<< axis >>>>>>>>>>>>>>
void DrawAxis(double length)     // the entire axis --> if of length "length"
                             // "length-0.2" is the length of the line to arrow
                             // the arrow's length is 0.2 (height of the cone)
{	// draw a z-axis, with cone at end
	glPushMatrix();
	
	glBegin(GL_LINES);
	glVertex3d(0, 0, 0); glVertex3d(0,0,length); // along the z-axis
	glEnd();
	
	glTranslated(0, 0,length-0.2); 
	glutWireCone(0.04, 0.2, 12, 9);
	
	glPopMatrix();
}	

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< displayWire >>>>>>>>>>>>>>>>>>>>>>
void DisplayWire()
{
	glMatrixMode(GL_PROJECTION); // set the view volume shape
	glLoadIdentity();
	glOrtho(-2.0*64/48.0, 2.0*64/48.0, -2.0, 2.0, 0.1, 100);
	glMatrixMode(GL_MODELVIEW); // position and aim the camera
	glLoadIdentity();
	gluLookAt(2.0, 2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // original view point
	//gluLookAt(2.0, 2.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);  // second view point for checking
	
	glClear(GL_COLOR_BUFFER_BIT); // clear the screen
	glColor3d(0,0,0); // draw black lines
	DrawAxis(0.5);	// z-axis
	glPushMatrix(); 
	glRotated(90, 0, 1, 0);
	DrawAxis(0.5);	// x-axis
	glRotated(-90.0, 1, 0, 0);
	DrawAxis(0.5);					// y-axis
	glPopMatrix();	
	
	glPushMatrix();
	glTranslated(0.5, 0.5, 0.5); // big cube at (0.5, 0.5, 0.5)
	glutWireCube(2.0);
	
	glPopMatrix();
	
	glPushMatrix();	// all the translations starting from (0, 0, 0)
	//glTranslated(1.0,1.0,0);	// sphere at (1,1,0)
	glTranslated(0, 1, 0);
	glutWireSphere(0.5, 15, 10);
	 
	
	glPopMatrix();		
	glPushMatrix();	
	glTranslated(1.0,0,1.0);	// cone at (1,0,1)
	glutWireCone(0.2, 0.5, 10, 8);
	
	glPopMatrix();
	glPushMatrix();
	glTranslated(1.5,1.5,1);
	glutWireTeapot(0.2); // teapot at (1,1,1)

	glPopMatrix();
	glPushMatrix();
	glTranslated(1.0, 0 ,0); // dodecahedron at (1,0,0)
	glScaled(0.15, 0.15, 0.15); //This function draws a regular, wireframe 12-sided polyhedron centered at the origin. 
								// The distance from the origin to the vertices is sqrt(3)
	glutWireDodecahedron();
	glPopMatrix();
	
	glPopMatrix();
	glPushMatrix();
	glTranslated(0, 1.0 ,0); // torus at (0,1,0)
	glRotated(90.0, 1,0,0);
	glutWireTorus(0.1, 0.3, 10,10);
	
	
	glPushMatrix();
	glTranslated(0, 1.0 ,1.0); // small cube at (0,1,1)
	glutWireCube(0.25);
	glPopMatrix();
	
	glPushMatrix();
	glTranslated(0, 0 ,1.0); // cylinder at (0,0,1)
	GLUquadricObj * qobj;
	qobj = gluNewQuadric();
	gluQuadricDrawStyle(qobj,GLU_LINE);
	gluCylinder(qobj, 0.2, 0.2, 0.4, 8,8);
	glPopMatrix();
	glFlush();
}

