/*
 *  quadric.cpp
 *  This program demonstrates the use of some of the gluQuadric*
 *  routines. Quadric objects are created with some quadric
 *  properties and the callback routine to handle errors.
 *  Note that the cylinder has no top or bottom and the circle
 *  has a hole in it.
 *
 *  This program also demonstrates the use of display lists
 */
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

#include <cstdio>
#include <cstdlib>
using namespace std;

/* Win32 calling conventions. */
#ifndef CALLBACK
#define CALLBACK
#endif

GLuint startList;


void init() 
{
	GLUquadricObj *qobj;   // qobj pointer is needed to create GLUquadraic objects
	GLfloat mat_ambient[] = { 0.5, 0.5, 0.5, 1.0 };   // object material settings
	GLfloat mat_specular[] = { 1.0, 1.0, 1.0, 1.0 };
	GLfloat mat_shininess[] = { 50.0 };
	GLfloat light_position[] = { 1.0, 1.0, 1.0, 0.0 };  // light position
	GLfloat model_ambient[] = { 0.5, 0.5, 0.5, 1.0 };    // lighting
	
	glClearColor(0.0, 0.0, 0.0, 0.0);
	
	// set lighting and material of the objects
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_ambient);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular);
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess);
	glLightfv(GL_LIGHT0, GL_POSITION, light_position);
	glLightModelfv(GL_LIGHT_MODEL_AMBIENT, model_ambient);
	
	glEnable(GL_LIGHTING);
	glEnable(GL_LIGHT0);
	glEnable(GL_DEPTH_TEST);
	
	/*  Create 4 display lists, each with a different quadric object.
	 *  Different drawing styles and surface normal specifications
	 *  are demonstrated.
	 */
	startList = glGenLists(4);
	qobj = gluNewQuadric();
	
	// create a sphere
	gluQuadricDrawStyle(qobj, GLU_FILL); // set draw style to solid object
	gluQuadricNormals(qobj, GLU_SMOOTH); // smooth shading 
	glNewList(startList, GL_COMPILE);   // sphere is saved as display list item #0
	gluSphere(qobj, 0.75, 15, 10);  // create a sphere with R=0.75, 15 slices, 10 stacks
	glEndList();
	
	// create a cylinder
	gluQuadricDrawStyle(qobj, GLU_FILL); 
	gluQuadricNormals(qobj, GLU_FLAT);  // flat shading
	glNewList(startList+1, GL_COMPILE);  // cylinder is saved as display list item # 1
	gluCylinder(qobj, 0.5, 0.3, 1.0, 15, 5);  // create a cylinder with base radius=0.5, 
	                                         // top radius=0.3, 15 slices and 5 stacks
	glEndList();
	
	// create a disk
	gluQuadricDrawStyle(qobj, GLU_LINE); // set draw style to wireframe 
	gluQuadricNormals(qobj, GLU_NONE);   // no shading, blank
	glNewList(startList+2, GL_COMPILE);    // disk obj is display list item # 2
	gluDisk(qobj, 0.25, 1.0, 20, 4);   // inner radius=0.25, outer radius=1.0, 20 slices, 4 loops
	glEndList();
	
	// create a 
	gluQuadricDrawStyle(qobj, GLU_SILHOUETTE); // set draw style to boundary only
	gluQuadricNormals(qobj, GLU_NONE);  // no shading
	glNewList(startList+3, GL_COMPILE);  // partial disk
	gluPartialDisk(qobj, 0.0, 1.0, 20, 4, 0.0, 225.0);// disk inner radius=0, outer radius=1.0, 
	                          // 4 slices, 0 stacks, start from 0 degree (y-axis) to 225 degrees (CW)
	glEndList();
}

void display()
{
	glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glPushMatrix();
	
	glEnable(GL_LIGHTING);
	glShadeModel (GL_SMOOTH);
	
	// draw sphere centered at (-1, -1, 0)
	glTranslatef(-1.0, -1.0, 0.0);
	glCallList(startList);
	
	glShadeModel (GL_FLAT);
	glTranslatef(0.0, 2.0, 0.0);
	glPushMatrix();
	glRotatef(300.0, 1.0, 0.0, 0.0); // rotate cylinder 300 deg around x-axis,
	                                  // centered at (-1, 1, 0)
	glCallList(startList+1);
	glPopMatrix();
	
	glDisable(GL_LIGHTING);
	glColor3f(0.0, 1.0, 1.0);
	glTranslatef(2.0, -2.0, 0.0);    // centered at ??
	glCallList(startList+2);
	
	glColor3f(1.0, 1.0, 0.0);
	glTranslatef(0.0, 2.0, 0.0);    // centered at ??
	glCallList(startList+3);
	
	glPopMatrix();
	glFlush();
}

void reshape (int w, int h)
{
	glViewport(0, 0, (GLsizei) w, (GLsizei) h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	if (w <= h)
		glOrtho(-2.5, 2.5, -2.5*(GLfloat)h/(GLfloat)w,
				2.5*(GLfloat)h/(GLfloat)w, -10.0, 10.0);
	else
		glOrtho(-2.5*(GLfloat)w/(GLfloat)h,
				2.5*(GLfloat)w/(GLfloat)h, -2.5, 2.5, -10.0, 10.0);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
}

void keyboard(unsigned char key, int x, int y)
{
	switch (key) {
		case 27:
			exit(0);
			break;
	}
}

int main(int argc, char** argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowSize(500, 500); 
	glutInitWindowPosition(100, 100);
	glutCreateWindow(argv[0]);
	init();
	glutDisplayFunc(display); 
	glutReshapeFunc(reshape);
	glutKeyboardFunc(keyboard);
	glutMainLoop();
	return 0;
}
