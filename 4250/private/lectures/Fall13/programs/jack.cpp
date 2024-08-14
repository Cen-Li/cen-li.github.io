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

void DrawWall(double thickness)
{
	// draw thin wall with top = xz-plane, corner at origin
	glPushMatrix();
	glTranslated(0.5, 0.5*thickness, 0.5);
	glScaled(1.0, thickness, 1.0);
	glutSolidCube(1.0);
	glPopMatrix();
}

void DrawTableLeg(double thick, double len)
{
	glPushMatrix();
	glTranslated(0, len/2, 0);
	glScaled(thick, len, thick);
	glutSolidCube(1.0);
	glPopMatrix();
}

void DrawJackPart()
{
	// draw one axis of the unit jack - a stretched sphere
	glPushMatrix();
	glScaled(0.2, 0.2, 1.0);
	glutSolidSphere(1, 15, 15);
	glPopMatrix();
	
	// ball on one end
	glPushMatrix();
	glTranslated(0, 0, 1.2); 
	glutSolidSphere(0.2, 15, 15);
	
	// ball on the other end
	glTranslated(0, 0, -2.4);
	glutSolidSphere(0.2, 15, 15);  
	glPopMatrix();
}

void DrawJack()
{
	// draw a unit jack out of sphereoids
	glPushMatrix();
	DrawJackPart();
	
	glRotated(90.0, 0, 1, 0);
	DrawJackPart();
	
	glRotated(90, 1, 0, 0);
	DrawJackPart();
	
	glPopMatrix();
}

void DrawTable(double topWid, double topThick, double legThick, double legLen)
{
	// draw the table - a top and four legs
	glPushMatrix();  // draw the table top
	glTranslated(0, legLen, 0);
	glScaled(topWid, topThick, topWid);
	glutSolidCube(1.0);
	glPopMatrix();
	
	double dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	glPushMatrix();
	glTranslated(dist, 0, dist);
	DrawTableLeg(legThick, legLen);
	glTranslated(0, 0, -2*dist);
	DrawTableLeg(legThick, legLen);
	glTranslated(-2*dist, 0, 2*dist);
	DrawTableLeg(legThick, legLen);
	glTranslated(0, 0, -2*dist);
	DrawTableLeg(legThick, legLen);
	
	glPopMatrix();
}

void DisplaySolid()
{
	// set properties of the surface material
	GLfloat mat_ambient[]={0.7f, 0.7f, 0.7f, 1.0f}; // gray
	GLfloat mat_diffuse[]={0.6f, 0.6f, 0.6f, 1.0f};
	GLfloat mat_specular[]={1.0f, 1.0f, 1.0f, 1.0f};
	GLfloat mat_shininess[]={50.0f};
	
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_ambient);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular);
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess);
	
	// set the light source properties
	GLfloat lightIntensity[] = {0.7f, 0.7f, 0.7f, 1.0f};
	GLfloat light_position[] = {2.0f, 6.0f, 3.0f, 0.0f};
	glLightfv(GL_LIGHT0, GL_POSITION, light_position);
	glLightfv(GL_LIGHT0, GL_DIFFUSE, lightIntensity);
	
	// set the world window and the camera
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	double winHt = 1.0; // half-height of the window
	//glOrtho(-winHt*64/48.0, winHt*64/48.0, -winHt, winHt, 0.1, 100.0);
	glOrtho(-.45, winHt/2, -winHt/2, winHt/2, 0.1, 100.0);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	//gluLookAt(2.3, 1.3, 2, 0, 0.25, 0, 0.0, 1.0, 0.0);
	gluLookAt(.5, 0.7, 0.6, 0, 0, 0, 0.0, 1.0, 0.0);

	// start drawing
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); 
	
	// draw jack			// what makes the jack teapot and sphere look on the same surface?
	glPushMatrix();
	glTranslated(0.4, 0.4, 0.6);
	glRotated(45, 0, 0, 1);
	glScaled(0.08, 0.08,0.08);
	DrawJack();   
	glPopMatrix();
	
	// draw the teapot
	glPushMatrix();
	glTranslated(0.6, 0.38, 0.5);
	glRotated(30, 0, 1, 0); // try 60 degrees
	glutSolidTeapot(0.1);  // was 0.08
	glPopMatrix();
	
	// draw the sphere
	glPushMatrix();
	glTranslated(0.25, 0.42,0.35);
	glutSolidSphere(0.1, 15, 15);
	glPopMatrix();
	
	
	// draw the table
	glPushMatrix();
	glTranslated(0.4, 0, 0.4);
	DrawTable(0.6, 0.02, 0.02, 0.3);
	glPopMatrix();
	
	// wall # 1: in xz-plane
	DrawWall(0.02); 
	
	// wall #2: in yx-plane
	glPushMatrix();
	glRotated(90.0, 0.0, 0.0, 1.0);
	DrawWall(0.02); 
	glPopMatrix();
	
	// wall #3: in xy-plane
	glPushMatrix();
	glRotated(-90, 1.0, 0.0, 0.0);
	DrawWall(0.02); 
	glPopMatrix();
	
	glFlush();
}

int main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(640, 480);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Shaded example - 3D scene");
	glutDisplayFunc(DisplaySolid);
	
	glEnable(GL_LIGHTING);  //	enable the light source
	glEnable(GL_LIGHT0);
	glShadeModel(GL_SMOOTH);
	glEnable(GL_DEPTH_TEST); // for hidden surface removal
	glEnable(GL_NORMALIZE);  // normalize vectors for proper shading
	glClearColor(0.1f, 0.1f, 0.1f, 0.0f); //background is light gray
	glViewport(0, 0, 640, 480);
	
	glutMainLoop();
}