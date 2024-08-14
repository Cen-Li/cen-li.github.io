//This program draws a spaceship with an alien.  All coordinates are
//in the range from -8 to 8 in x and y.  Display lists are used to
//produce the ship.


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

#include <cstdlib>
#include <cmath>
#include <iostream>
using namespace std;

struct coordinate {
	float x, y;
};
//define diplay list identifiers
#define Circle  1
#define Ship    2
#define Glass   3
#define Body    4
#define Leg     5
#define Base    6
#define Head    7
#define Eye     8
#define Ground	9
#define Sky		10
#define Star	11
#define Mountain 12
#define Planet 13
#define FrontCircles 14
#define BackCircles 15

#define PI 3.1415926535898      //PI
#define WIDTH 800
#define LENGTH 500
#define ButtonTop  8
#define ButtonBottom   7.4
#define ButtonLeft  6.5
#define ButtonRight   8

#define numOfStars 40
float aspectRatio = (float)WIDTH/LENGTH;

// global variables
//Translation, scale, and rotate factors needed for producing
//the spaceship.  Any of these that don't need to be global
//can be moved to the static section of the appropriate
//method.
float sxPos, syPos;                 //translation points for ship
float lx1Pos, ly1Pos;               //translation points for leg1
float lx2Pos, ly2Pos;               //translation points for leg2
float lx3Pos, ly3Pos;               //translation points for leg3
float byScal;                       //scale point for base
float sxScal, syScal;               //scale points for ship
float sRot;                         //degree for ship rotate
float szRot;                        //points for ship rotation
// variables to control how the spaceship animates
float flyY;			// increment to fly up
float raiseAngle;	// increment to raise spaceship legs
float turnAngle;	// increment to turn the ship to the left
float scaleX, scaleY;  // increment to shrink the ship
bool launchAlien=false;
bool resetValues = false;
char mode = 'l';   // start with launch mode
int  flyIterations = 0;
float flyTowardX=0.0;
float flyTowardY=0.0;
float gapY=0.0;

coordinate locations[numOfStars];  // random locations for the 20 stars
/* 
	Function:  reshape()

	Precondition: This function should be registered as the
	reshape callback.

	Postcondition: This function is the reshape callback function 
	and it takes care of a resize event.
*/

// all functions
void make_body();     //makes a display list for the ship's shell
void make_base();     //makes a list for the base of the ship
void make_head();     //makes a list for the alien's head
void make_eye();      //makes a list for an alien's eye
void make_leg();      //makes a list for one leg of the ship
void make_glass();    //makes the ship's glass that surrounds the alien
void make_ship();   
void make_ground_and_sky();
void make_star();
void make_mountain();
void make_planet();    // these 3 function draws the planet set
void make_backcircles();
void make_frontcircles();
void DrawShip();
void draw_button_launch();
void draw_button_reset();
void Display();
void MyInit();
void MouseButton(int button, int state, int x, int y);

// glut handler functions
void reshape (int, int);
void AssignInitValues();
void KeyHandler(unsigned char theKey, int x, int y);
void MyTimerFunc(int value);

int main(int argc, char **argv) 
{
	// Open a window for the application
	glutInit(&argc, argv);
	glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB);
	glutInitWindowSize (WIDTH, LENGTH); 
	glutInitWindowPosition(30, 100);
	glutCreateWindow ("Spaceship with Alien");
	

	//Call procedures to create the display lists
	make_body();     //makes a display list for the ship's shell
	make_base();     //makes a list for the base of the ship
	make_head();     //makes a list for the alien's head
	make_eye();      //makes a list for an alien's eye
	make_leg();      //makes a list for one leg of the ship
	make_glass();    //makes the ship's glass that surrounds the alien
	make_ground_and_sky();
	make_ship();     //makes a list for the ship
	make_star();	// makes a list for the star
	make_mountain();
	make_planet();
	make_backcircles();
	make_frontcircles();
	
	AssignInitValues();
	
	MyInit();
	// Assign reshape() to be the function called whenever 
	// a reshape event occurs
	glutReshapeFunc(reshape);
	glutKeyboardFunc(KeyHandler);
	
	// Assign draw() to be the function called whenever a display
	// event occurs, generally after a resize or expose event
	glutDisplayFunc(Display); 
	//glutIdleFunc(IdleHandle);
	glutMouseFunc(MouseButton);
	glutTimerFunc(50, MyTimerFunc, 1);

	// Pass program control to glut's event handling code
	// In other words, loop forever
	glutMainLoop();
}

void MyInit()
{
	// Set the clear color to black
	glClearColor(0.0, 0.0, 0.0, 0.0);

	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluOrtho2D(-8.0, 8.0, -8.0, 8);
	glViewport(0, 0, WIDTH, LENGTH);
	glMatrixMode(GL_MODELVIEW);
	// random locations for the stars
	float xRandom, yRandom;
	int   xSign;
	for (int i=0; i<numOfStars; i++)
	{
		xRandom = rand()%90/10.0;  // -8 ... 8
		yRandom = rand()%60/10.0+2.5;  // 2.5..8
		
		xSign = rand()%2;
		if (xSign==0) {
			xRandom = -xRandom;
		}
		locations[i].x = xRandom;
		locations[i].y = yRandom;
	}
}

void AssignInitValues()
{
	sxPos = 1.0;        //ship position x value
	syPos = -5.5;       //ship position y value
	lx1Pos = 2.8;       //leg 1 position x value
	ly1Pos = -5.9;      //leg 1 position y value
	lx2Pos = -1.2;       //leg 2 position x value
	ly2Pos = -5.9;      //leg 2 position y value
	lx3Pos = 1.2;       //leg 3 position x value
	ly3Pos = -6;        //leg 3 position y value
	sRot = 0;           //ship degree for rotation
	szRot = 0;          //ship z value for rotation
	sxScal = 1.0;       //ship x value for scale
	syScal = 1.0;       //ship y value for scale
	byScal = 1.7;       //base y value for scale
	
	// variables to control animation
	flyY=0.0;		// increment spaceship moves up
	raiseAngle=0.0;	 // increment legs raise up
	turnAngle=0.0;   // increment spaceship turns to the left
	scaleX=1.0, scaleY=1.0;  // increment to shrink the spaceship
	
	flyIterations = 0;
	flyTowardX=0.0;
	flyTowardY=0.0;
	gapY = 0.0;

}

void reshape(int width, int height) 
{
	// Choose the projection matrix to be the matrix 
	// manipulated by the following calls
	glMatrixMode(GL_PROJECTION);
	
	// Set the projection matrix to be the identity matrix
	glLoadIdentity();
	
	// Define the dimensions of the world window
	gluOrtho2D(-8.0, 8.0, -8.0, 8.0);
	
	// Set the new viewport size
	glViewport(0, 0, (GLint)width, (GLint)height);
	
	// Choose the modelview matrix to be the matrix
	// manipulated by further calls
	glMatrixMode(GL_MODELVIEW);
	
}//end reshape()

void Display()
{	
	
	glClear(GL_COLOR_BUFFER_BIT);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();

	DrawShip();
	
	//for (int i = 0; i < 20000000; i++);  //lazy man's loop
	
	glutSwapBuffers();
	glFlush();
}	

void MyTimerFunc(int value)
{
	if (launchAlien)
	{
		if (raiseAngle<90) { // raising the legs
			raiseAngle += 5;
		}
		// legs finished raising, start flying up
		else if (flyY < 8.5)
		{
			flyY += 0.2;
		}
		// spaceship finished flying up, ready to turn
		else if (turnAngle<15)
		{
			turnAngle += 1;
		}
		// spaceship shrinks to scale
		else if (flyIterations < 50)
		{
			flyTowardX = flyTowardX - 6.0/50;     // the planet is (-5, 3.3) away from turning point
			flyTowardY = flyTowardY + 3.3/50;
			if (flyIterations < 25)
				gapY = gapY+0.8/50;
			
			scaleX *= 0.9;
			scaleY *= 0.9;
			flyIterations++;
		}
		else {
			launchAlien = false;     // finished launching alien
		}
	}
	if (resetValues)
	{
		AssignInitValues();
		resetValues = false;        // finished resetting values
	}
	glutPostRedisplay();
	glutTimerFunc(50, MyTimerFunc, 1);
}

void MouseButton(int button, int state, int x, int y)
{
	y=LENGTH-y;   // flip y co-ordinate
	//cout << "x=" << x << ", y=" << y << endl;
	if ( x>=725 && y >= 480)  // button pressed
	{
		if ((button == GLUT_LEFT_BUTTON) && (state == GLUT_DOWN))
		{
			if (mode == 'l')    //current button is "launch"
			{
				launchAlien = true;   // start launching alien
				mode = 'r';
			}
			else if (mode == 'r')  // current button is "reset"
			{
				resetValues = true;
				mode = 'l';
			}
		}
	}
	glutPostRedisplay(); // cause an event redraw to screen: to see the effect of the mouse event
	return;
}
	
void KeyHandler(unsigned char theKey, int x, int y)
{
	if (theKey == 'q') {
		exit(0);
	}
}

/* 
	Function: DrawShip()

	Preconditions: This function should be registered as the display
	callback.

	Postconditions: All necessary display lists will be called and all
	images will be displayed on the screen.
*/
void DrawShip() 
{
	// Clear the RGB buffer
	glClear(GL_COLOR_BUFFER_BIT);

	// draw ground
	glLoadIdentity();
	

	glCallList(Ground);

	glPushMatrix();

	// draw stars
	for (int i=0; i<numOfStars; i++)
	{
		glLoadIdentity();
		glTranslatef(locations[i].x, locations[i].y, 0.0);
		glScalef(1.0/12, 1.0/12, 1.0);
		glCallList(Star);
	}
	
	// draw mountains
	glLoadIdentity();
	glTranslatef(5, -2, 0);
	glScalef(2, 1.5, 1);
	glCallList(Mountain);
	
	glLoadIdentity();
	glTranslatef(-5, -1, 0);
	glScalef(2.5, 1.8, 1);
	glCallList(Mountain);
	
	// draw planet
	glLoadIdentity();
	glTranslatef(-4, 6.5, 0);
	glRotatef(75, 0, 0, 1);
	glScalef(.75, .75, 1);
	glCallList(FrontCircles);
	
	glLoadIdentity();
	glTranslatef(-4, 6.5, 0);
	glScalef(.75, .75*aspectRatio, 1);
	glCallList(Planet);

	glLoadIdentity();
	glTranslatef(-4, 6.5, 0);
	glRotatef(75, 0, 0, 1);
	glScalef(.75, .75, 1);
	glCallList(BackCircles);
	
	if (mode == 'r')
	{
		draw_button_reset();
	}
	else 
	{
		draw_button_launch();
	}


	// Display Alien with Spaceship
	//set parameters for right leg
	glLoadIdentity();
	glColor3f(.5,.5,.5);
	glTranslatef(0.8+lx1Pos,ly1Pos+flyY,0.0);
	glScalef(0.7*5*scaleX,0.7*13*scaleY,0);
	glRotatef(0-raiseAngle,0,0,0);
	glRotatef(turnAngle, 0, 1, 0);
	glCallList(Leg);

	//set parameters for left leg
	glLoadIdentity();
	glColor3f(.5,.5,.5);
	glTranslatef(1.6+lx2Pos,ly2Pos+flyY,0.0);
	glScalef(0.7*5*scaleX,0.7*13*scaleY,0);
	glRotatef(180-raiseAngle,0,1,0);
	glRotatef(turnAngle, 0, 0, 0);     //!!!
	glCallList(Leg);

	//set parameters for front leg
	glLoadIdentity();
	glColor3f(.5,.5,.5);
	glTranslatef(1+lx3Pos, ly3Pos+flyY,0.0);
	glScalef(0.7*7*scaleX,0.7*16*scaleY,0);
	glRotatef(0+raiseAngle,0,0,0);
	glRotatef(turnAngle, 0, 1, 0);
	glCallList(Leg);
	
	//set parameters for the space ship, including the alien
	glLoadIdentity();
	glTranslatef(1+sxPos+flyTowardX,syPos+flyY+flyTowardY,0.0);
	glScalef(0.7*sxScal*scaleX,0.7*syScal*scaleY, 1.0);
	glRotatef(sRot,0,0,szRot);
	glRotatef(turnAngle, 1, 0,1);
	glCallList(Ship);

	//set parameters for the base of the ship
	glLoadIdentity();
	glTranslatef(2+flyTowardX,-6+flyY+flyTowardY+gapY,0.0);
	glScalef(0.8*5.1*scaleX, 0.8*byScal*scaleY, 1.0);
	glRotatef(turnAngle*2.2, 1, 0, 1);
	glCallList(Base);
	
	glPopMatrix();

	// write "Forbidden Planet" on the bottom of screen
	glColor3f(1.0, 1.0, 1.0);// set text color to white
	glRasterPos2f(5, -6.5);  // specifies the position of the text 
	char text1[30]="Forbidden Planet ";
	for (int i = 0; i < strlen(text1); i++)
		glutBitmapCharacter (GLUT_BITMAP_9_BY_15, text1[i]);
	
	glRasterPos2f(5, -7);  // specifies the position of the text 
	char text2[30]="By Cen Li ";
	for (int i = 0; i < strlen(text2); i++)
		glutBitmapCharacter (GLUT_BITMAP_9_BY_15, text2[i]);
	
	// force drawing of all objects thus far
	glutSwapBuffers();
}

void draw_button_launch()
{
	glLoadIdentity();
	
	glColor3f(0, 0, 0);
	glBegin(GL_POLYGON);
	glVertex2f(ButtonLeft, ButtonBottom);
	glVertex2f(ButtonRight, ButtonBottom);
	glVertex2f(ButtonRight, ButtonTop);
	glVertex2f(ButtonLeft, ButtonTop);
	glEnd();
	
	glColor3f(1.0, 1.0, 1.0);// set text color to black
	glRasterPos2f(ButtonLeft+0.1, ButtonBottom+0.1);  // specifies the position of the text 
	const char text[10]="Launch";
	for (int i = 0; i < 6; i++)
		glutBitmapCharacter (GLUT_BITMAP_9_BY_15, text[i]);

}

void draw_button_reset()
{
	glLoadIdentity();
	
	glColor3f(0, 0, 0);
	glBegin(GL_POLYGON);
	glVertex2f(ButtonLeft, ButtonBottom);
	glVertex2f(ButtonRight, ButtonBottom);
	glVertex2f(ButtonRight, ButtonTop);
	glVertex2f(ButtonLeft, ButtonTop);
	glEnd();
	
	glColor3f(1.0, 1.0, 1.0);// set text color to black
	glRasterPos2f(ButtonLeft+0.1, ButtonBottom+0.1);  
	const char text[10]="Reset";
	for (int i = 0; i < 5; i++)
		glutBitmapCharacter (GLUT_BITMAP_9_BY_15, text[i]);
}

void make_ground_and_sky()
{

	glNewList(Ground, GL_COMPILE);
	glPushAttrib (GL_ALL_ATTRIB_BITS);
	glPushMatrix();
	
	glShadeModel(GL_SMOOTH);
	
	// draw ground
	glBegin(GL_POLYGON);
		glColor3f(85.0/255, 107.0/255, 47.0/255);  // try converting from RGB code for brown
		glVertex3f(-8, -8, 0);
		glVertex3f(8, -8, 0);
	
		glColor3f(34.0/255, 34.0/255, 34.0/255);   // a darker brown
	    //glColor3f(139.0/255, 34.0/255, 83.0/255);
		glVertex3f(8, 0, 0);
		glVertex3f(-8, 0, 0);
	glEnd();
	
	// draw sky
	glBegin(GL_POLYGON);
		glColor3f(135.0/255, 31.0/255, 120.0/255);  // try converting from RGB code for purple
		glVertex3f(-8, 0, 0);
		glVertex3f(8, 0, 0);
	
		glColor3f(37/255, 37.0/255, 49.0/255);   // a darker navy
		glVertex3f(8, 8, 0);
		glVertex3f(-8, 8, 0);
	glEnd();
	
	glPopMatrix();
	glPopAttrib();
	glEndList();
}//end make_ground()

void make_star()
{
	glNewList(Star, GL_COMPILE);
	glPushAttrib (GL_ALL_ATTRIB_BITS);
	glPushMatrix();
	
	//glMatrixMode(GL_MODELVIEW);   !!! can not do this in make_list, otherwise the transformation during
	//glLoadIdentity();			calling of the lists will be ineffective !!!!
	
	glShadeModel(GL_FLAT);
	glColor3f(1.0, 1.0, 0); // yellow star
	// based on two concentric parent circles pp 113
	// outer circle radius=1, inner circle radiue=1/4
	
	/* does not work    GL can not draw concave polygon properly!!!!
	glBegin(GL_POLYGON);
	int n=4;
	for (int i=0; i<n; i++)
	{
		// point from outer circle
		glVertex2f(cos(1.0*i/n*2*PI), sin(1.0*i/n*2*PI));
	    
		// point from inner circle
		glVertex2f(1.0/3*cos(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI), 1.0/3*sin(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI));
	}
	glVertex2f(1.0, 0.0);
	glEnd(); */
	
	// try draw 4 triangles and then draw the center circle
	int n=4;
	for (int i=0; i<n; i++)
	{
		glBegin(GL_TRIANGLES);
		glVertex3f(1.0/3*cos(1.0*i/n*PI*2-1.0/2*1.0/n*2*PI), 1.0/3*sin(1.0*i/n*PI*2-1.0/2*1.0/n*2*PI), 0);
		
		// point from outer circle
		glVertex3f(cos(1.0*i/n*2*PI), sin(1.0*i/n*2*PI), 0);
	    
		// point from inner circle
		glVertex3f(1.0/3*cos(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI), 1.0/3*sin(1.0*i/n*PI*2+1.0/2*1.0/n*2*PI), 0);
		glEnd();
	}

	n=20;
	glBegin(GL_TRIANGLE_FAN);
	glVertex3f(0, 0, 0);
	for (int i=0; i<n; i++)
	{
		glVertex3f(1.0/3*cos(1.0*i/n*2*PI), 1.0/3*sin(1.0*i/n*2*PI), 0);
		//glVertex3f(1.0/3*cos(1.0*(i+1)/n*2*PI), 1.0/3*sin(1.0*(i+1)/n*2*PI), 0);
	}
	glEnd();
	
	glPopMatrix();
	glPopAttrib();
	glEndList();
}

void make_mountain()
{
	glNewList(Mountain, GL_COMPILE);
	glPushAttrib (GL_ALL_ATTRIB_BITS);
	glPushMatrix();
	
	glShadeModel(GL_SMOOTH);

	glBegin(GL_TRIANGLE_FAN);
	glColor3f(20.0/255, 40.0/255, 45.0/255);
	glVertex3f(0, 0, 0);
	glColor3f(50.0/255, 30.0/255, 40.0/255);
	glVertex3f(2.6, 0, 0);
	glColor3f(100.0/255, 35.0/255, 24.0/255);
	glVertex3f(2., 2.1, 0);
	glEnd();
	
	glBegin(GL_TRIANGLE_FAN);
	glColor3f(20.0/255, 40.0/255, 45.0/255);
	glVertex3f(0, 0, 0);
	glColor3f(50.0/255, 30.0/255, 40.0/255);
	glVertex3f(1.6, 0, 0);
	glColor3f(100.0/255, 35.0/255, 24.0/255);
	glVertex3f(0.3, 1.95, 0);
	glEnd();
	
	glBegin(GL_TRIANGLE_FAN);
	glColor3f(139.0/255, 45.0/255, 45.0/255);
	glVertex3f(0, 0, 0);
	glColor3f(45.0/255, 24.0/255, 30.0/255);
	glVertex3f(1.5, 0, 0);
	glColor3f(100.0/255, 35.0/255, 24.0/255);
	glVertex3f(1.3, 0.95, 0);
	glEnd();

	glBegin(GL_TRIANGLE_FAN);
	glColor3f(130.0/255, 45.0/255, 45.0/255);
	glVertex3f(-1, 0, 0);
	glColor3f(65.0/255, 24.0/255, 30.0/255);
	glVertex3f(1.0, 0, 0);
	glColor3f(80.0/255, 40.0/255, 24.0/255);
	glVertex3f(-0.7, 2.95, 0);
	glEnd();
	
	glBegin(GL_TRIANGLE_FAN);
	glColor3f(20.0/255, 45.0/255, 45.0/255);
	glVertex3f(0, 0, 0);
	glColor3f(55.0/255, 40.0/255, 30.0/255);
	glVertex3f(-1.5, 0, 0);
	glColor3f(70.0/255, 35.0/255, 24.0/255);
	glVertex3f(-2.0, 1.95, 0);
	glEnd();
	
	glPopMatrix();
	glPopAttrib();
	glEndList();
}

void make_backcircles()
{
	glNewList(BackCircles, GL_COMPILE);
	glPushAttrib (GL_ALL_ATTRIB_BITS);
	glPushMatrix();
	
	glLineWidth(2);
	
	//glLoadIdentity();
	// draw back half of the circles
	glColor3f(0, .6, 0); // green outer circle
	glBegin(GL_LINE_STRIP);
	int n=60;
	for (int i=0; i<=n; i++)
	{
		glVertex2f(3.1*cos(1.0*i/n*PI), .5*sin(1.0*i/n*PI));
	}
	glEnd();

	glColor3f(.6, .6, 0); // yellow circle
	glBegin(GL_LINE_STRIP);
	for (int i=0; i<=n; i++)
	{
		glVertex2f(2.9*cos(1.0*i/n*PI), 0.4*sin(1.0*i/n*PI));
	}
	glEnd();
	
	glColor3f(.6, 0, 0); // red circle
	glBegin(GL_LINE_STRIP);
	for (int i=0; i<=n; i++)
	{
		glVertex2f(2.7*cos(1.0*i/n*PI), .3*sin(1.0*i/n*PI));
	}
	glEnd();
	
	glColor3f(0.5, 0, .6); // cyan circle
	glBegin(GL_LINE_STRIP);
	for (int i=0; i<=n; i++)
	{
		glVertex2f(2.5*cos(1.0*i/n*PI), 0.2*sin(1.0*i/n*PI));
	}
	glEnd();
	
	glPopMatrix();
	glPopAttrib();
	glEndList();
}

void make_planet()
{
	glNewList(Planet, GL_COMPILE);
	glPushAttrib (GL_ALL_ATTRIB_BITS);
	glPushMatrix();
	
	glLineWidth(2);
	// draw center planet circle
	
	glColor3f(0.7, 0.7, 0); 
	float Radius=1.0;
	int numPoints = 80;
	
	glBegin(GL_POLYGON);		// for solid circle
	//glBegin(GL_LINE_STRIP);   // for unfilled circle
	// Generate the points of the circle
	
	for( int i=0; i<=numPoints; i++ )
	{
		float Angle = i * (2.0*PI/numPoints); 
		float X = cos( Angle )*Radius; 
		float Y = sin( Angle )*Radius; 
		glVertex2f( X, Y );
		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
	glEnd();
	
	/*
	int m=80;
	glBegin(GL_TRIANGLE_FAN);
	glVertex2f(0, 0);
	for (int i=0; i<=360; i+=2)
	{
		glVertex2f(radius*cos((float)i/360*2*PI), radius*sin((float)i/360*2*PI));		
	}
	glEnd();
	 */	 
	/*
	glBegin(GL_POLYGON);
	glVertex2f(radius, 0);
	glVertex2f(-radius, 0);
	glVertex2f(0, radius);
	glVertex2f(0, -radius);
	
	float xmod, ymod, step = PI/(4*radius);
	
	for (float theta=0; theta <= 2*PI; theta += step)
	{
		xmod = radius * cos(theta);
		ymod = radius * sin(theta);
		
		glVertex2f(xmod, ymod);
		glVertex2f(xmod, -ymod);
		glVertex2f(-xmod, ymod);
		glVertex2f(-xmod, -ymod);
	}
	glEnd();
	 */
	
	glPopMatrix();
	glPopAttrib();
	glEndList();
}

void make_frontcircles()
{
	int n=60;
	glNewList(FrontCircles, GL_COMPILE);
	glPushAttrib (GL_ALL_ATTRIB_BITS);
	glPushMatrix();
	
	glLineWidth(2);
	
	// draw front half of the circle
	glColor3f(0, .6, 0); // green outer circle
	glBegin(GL_LINE_STRIP);
	for (int i=0; i<=n; i++)
	{
		glVertex2f(3.1*cos(1.0*i/n*PI+PI), .5*sin(1.0*i/n*PI+PI));
	}
	glEnd();
	
	glColor3f(0.6, .6, 0); // yellow circle
	glBegin(GL_LINE_STRIP);
	for (int i=0; i<=n; i++)
	{
		glVertex2f(2.9*cos(1.0*i/n*PI+PI), .4*sin(1.0*i/n*PI+PI));
	}
	glEnd();
	
	glColor3f(0.6, 0, 0); // red circle
	glBegin(GL_LINE_STRIP);
	for (int i=0; i<=n; i++)
	{
		glVertex2f(2.7*cos(1.0*i/n*PI+PI), .3*sin(1.0*i/n*PI+PI));
	}
	glEnd();
	
	glColor3f(0.5, 0, 0.6); // cyan circle
	glBegin(GL_LINE_STRIP);
	for (int i=0; i<=n; i++)
	{
		glVertex2f(2.5*cos(1.0*i/n*PI+PI), 0.2*sin(1.0*i/n*PI+PI));
	}
	glEnd();
	
	glPopMatrix();
	glPopAttrib();
	glEndList();
}
/* 
	Function: make_glass()
	
	Precondition:  OpenGL and GLUT should be initialized, the 
	window to viewport mapping should have been defined, and
	the foreground and background colors should have been 
	selected.
	
	Postconditions: This function creates a half circle and places 
	it in a display list for use at a later time. 
*/
void make_glass() 
{
	GLuint i;             //index for plotting 100 points
	GLfloat	cosine, sine; //cosine & sine of the next angle

	// Create a display list for a circle
	glNewList(Glass, GL_COMPILE);
	glPushAttrib (GL_ALL_ATTRIB_BITS);
	glPushMatrix();

	glBegin(GL_LINE_STRIP);
	// Generate the points of the circle
	for(i = 0; i < 180; i++) 
	{
		cosine = cos(i * PI / 180.0);
		sine = sin(i * PI/180.0);
		glVertex3f(cosine, sine, 0);//plot point
	}//end for
	glEnd();

	glPopMatrix();
	glPopAttrib();
	glEndList();
}//end make_glass()


/* 
	Function: make_body()
	
	Precondition:  OpenGL and GLUT should be initialized, the 
	window to viewport mapping should have been defined, and
	the foreground and background colors should have been 
	selected.
	
	Postconditions: This function creates the body of a space
	ship and places it in a display list for use at a later time. 
*/
void make_body() 
{
	// Create display list for ship body
	glNewList(Body, GL_COMPILE);
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		//top half of ship
		glBegin(GL_POLYGON);
			glColor3f(.55,.55,.55);//shade gray to almost white
			glVertex3f(0,.8, 0);
			glVertex3f(-.5,.75, 0);
			glVertex3f(-.9,.4, 0);
			glColor3f(.93,.93,.93);			
			glVertex3f(-1,0, 0);			
			glVertex3f(1,0, 0);
			glVertex3f(.9,.4, 0);	
			glColor3f(.55,.55,.55);
			glVertex3f(.5,.75, 0);
		glEnd();				//end top half of ship

		//bottom half of ship
		glBegin(GL_POLYGON);
			glColor3f(.55,.55,.55);
			glVertex3f(0,-.8,0);
			glVertex3f(-.5,-.75,0);
			glVertex3f(-.9,-.4,0);			
			glVertex3f(-1,0,0);
			glColor3f(.75,.75,.75);			
			glVertex3f(1,0,0);			
			glVertex3f(.9,-.4, 0);	
			glColor3f(.55,.55,-.55);
			glVertex3f(.5,-.75, 0);
		glEnd();				//end bottom half of ship

		//light bar
		glBegin(GL_POLYGON);
			glColor3f(1,0,0);
			glVertex3f(.5,-.7,0);
			glVertex3f(.0,-.9,0);
			glColor3f(0,0,1);
			glVertex3f(-.5,-.7,0);
		glEnd();				//end light bar
		
		glPopMatrix();
		glPopAttrib();
	glEndList();
}//end make_body()
/* 
	Function: make_leg()
	
	Precondition:  OpenGL and GLUT should be initialized, the 
	window to viewport mapping should have been defined, and
	the foreground and background colors should have been 
	selected.
	
	Postconditions: This function creates a leg for the ship and places 
	it in a display list for use at a later time. 
*/

void make_leg() 
{	
	// Create display list for leg of ship
	glNewList(Leg, GL_COMPILE);
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		//1st polygon for top of leg
		glBegin(GL_POLYGON);
			glColor3f(.4,.4,.4);
			glVertex2f(0,0);
			glVertex2f(.03,0);
			glColor3f(.7,.7,.7);
			glVertex2f(.13,-.05);
			glVertex2f(.1,-.05);			
		glEnd();//end top polygon

		//2nd polygon for mid section of leg
		glBegin(GL_POLYGON);
			glColor3f(.7,.7,.7);
			glVertex2f(.13,-.05);
			glVertex2f(.1,-.05);
			glColor3f(.55,.55,.55);
			glVertex2f(.1,-.08);	
			glVertex2f(.13,-.08);			
		glEnd();//end 2nd polygon

		//3rd polygon for base of leg
		glBegin(GL_POLYGON);
			glColor3f(.5,.5,.5);
			glVertex2f(.13,-.08);
			glVertex2f(.1,-.08);
			glColor3f(.25,.25,.25);
			glVertex2f(.05,-.1);
			glVertex2f(.18,-.1);				
		glEnd();//end base polygon
						
		glPopMatrix();
		glPopAttrib();
	glEndList();
}//end make_leg()

/*	Function: make_ship()
	
	Precondition:  OpenGL and GLUT should be initialized, the 
	window to viewport mapping should have been defined, and
	the foreground and background colors should have been 
	selected. The Body, Head, and Glass display lists
	must be defined.
	
	Postconditions: This function creates a ship and places 
	it in a display list for use at a later time. The function 
	uses other display lists, Glass and Body	to 
	create the ship, and Head to put the alien in.
*/
void make_ship() 
{	
	glNewList(Ship, GL_COMPILE);

		//place glass on top of ship
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		glColor3f(1.0,1.0,1.0);
		glScalef(2.2,2,1);
		glCallList(Glass);

		glPopMatrix();
		glPopAttrib();

		//puts alien head in ship
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		glTranslatef(0,.6,0);
		glScalef(1.2,1.2,1);
		glCallList(Head);

		glPopMatrix();
		glPopAttrib();

		//draw the base of the ship
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		glTranslatef(0,-.1,0);
		glScalef(3.5,.7,1);
		glCallList(Body);

		glPopMatrix();
		glPopAttrib();
	glEndList();
}//end make_ship()

/*	Function: make_base()
	
	Precondition:  OpenGL and GLUT should be initialized, the 
	window to viewport mapping should have been defined, and
	the foreground and background colors should have been 
	selected. The Circle display list must be defined. 
	
	Postconditions: This function creates the base for the ship 
	which reaches down to the planet, and places it in a display 
	list for use at a later time. 
*/
void make_base() 
{
	// Create display list for base of ship
	glNewList(Base, GL_COMPILE);
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();
		
		//draw the white circle for bottom of base
		glColor3f(1,1,1);
		glTranslatef(0,-.67,0);
		glScalef(.1,.08,1);
		glCallList(Circle);          //call Circle display list
		
		//set parameters for top of base
		glScalef(10,12.5,1);
		glTranslatef(-.45,.67,0);		
		glBegin(GL_POLYGON);            //draw polygon for top of base
			glColor3f(0.0,0.0,1.0);     //color blue to red
			glVertex2f(0,0);
			glColor3f(1.0,0.0,0.0);     //red
			glVertex2f(.1,-.15);			
			glVertex2f(.3,-.2);
			glVertex2f(.6,-.2);
			glVertex2f(.8,-.15);
			glColor3f(0.0,0.0,1.0);     //back to blue
			glVertex2f(.9,0);
		glEnd();//end first polygon
		
		//draw second polygon for bottom section of base
		glBegin(GL_POLYGON);
			glColor3f(1.0,0.0,0.0);     //red to yellow
			glVertex2f(.3,-.2);
			glColor3f(1.0,1.0,0.0);     //yellow
			glVertex2f(.4,-.7);
			glVertex2f(.5,-.7);
			glColor3f(1.0,0.0,0.0);     //red
			glVertex2f(.6,-.2);
		glEnd();//end second polygon

		glPopMatrix();
		glPopAttrib();
	glEndList();
}//end make_base

/*	Function: make_head()
	
	Precondition:  OpenGL and GLUT should be initialized, the 
	window to viewport mapping should have been defined, and
	the foreground and background colors should have been 
	selected. My_Eye display list must be defined.
	
	Postconditions: This function creates an alien head and places 
	it in a display list for use at a later time. This function uses
	display list Eye for the eyes.
*/
void make_head() 
{
	// Create display list for alien head
	glNewList(Head, GL_COMPILE);
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();
		
		glColor3f(.3,.67,.28);  //alien green
		glBegin(GL_POLYGON);    //draw a neck
			glVertex2f(-.05,0);
			glVertex2f(-.05,-.3);
			glVertex2f(.05,-.3);
			glVertex2f(.05,0);
		glEnd();                //end neck polygon
		
		glColor3f(.57,.94,.32); //alien green
		glBegin(GL_POLYGON);    //draw a head shape
			glVertex2f(0,-.03);
			glVertex2f(.1,0);
			glVertex2f(.2,.2);
			glVertex2f(.3,.3);
			glVertex2f(.4,.5);
			glVertex2f(.35,.65);
			glVertex2f(.3,.7);
			glVertex2f(.2,.78);
			glVertex2f(.1,.82);
			glVertex2f(0,.84);
			glVertex2f(-.1,.82);
			glVertex2f(-.2,.78);
			glVertex2f(-.3,.7);
			glVertex2f(-.35,.65);
			glVertex2f(-.4,.5);
			glVertex2f(-.3,.3);
			glVertex2f(-.2,.2);
			glVertex2f(-.1,0);
		glEnd();//end head shape polygon

		glColor3f(0,0,0);//color to black
		glBegin(GL_LINES);//line for mouth
			glVertex2f(-.03,.1);
			glVertex2f(.03,.1);
		glEnd();//end mouth polygon

		//set parameters for right eye
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		glTranslatef(.03,.35,0);
		glScalef(.4,.5,1);
		glCallList(Eye); //draw eye

		glPopMatrix();
		glPopAttrib();
		
		//set parameters for left eye
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		glTranslatef(-.03,.35,0);
		glScalef(.4,.5,1);
		glRotatef(180,0,1,0);   //rotate right eye
		glCallList(Eye);     //draw eye

		glPopMatrix();  //pop attributes after eye
		glPopAttrib();
		
		glPopMatrix();  //pop attributes after Head
		glPopAttrib();
	glEndList();
}//end make_head()

/*	Function: make_eye()
	
	Precondition:  OpenGL and GLUT should be initialized, the 
	window to viewport mapping should have been defined, and
	the foreground and background colors should have been 
	selected.
	
	Postconditions: This function creates an alien shaped eye 
	and places it in a display list for use at a later time. 
*/
void make_eye() 
{	
	// Create display list for eye
	glNewList(Eye, GL_COMPILE);
		glPushAttrib (GL_ALL_ATTRIB_BITS);
		glPushMatrix();

		glColor3f(0,0,0);       //start black
		glBegin(GL_POLYGON);    //eye shaped polygon
			glVertex2f(0,0);
			glVertex2f(.35,0);
			glVertex2f(.6,.1);
			glVertex2f(.7,.2);
			glVertex2f(.78,.3);			
			glVertex2f(.8,.4);
			glVertex2f(.7,.42);
			glVertex2f(.6,.43);
			glColor3f(1,1,1);   //shade to white
			glVertex2f(.5,.41);
			glVertex2f(.4,.4);
			glVertex2f(.3,.39);
			glVertex2f(.2,.32);
			glVertex2f(.1,.25);
			glVertex2f(.05,.18);
			glVertex2f(0,.08);			
		glEnd();                //end eye polygon

		glPopMatrix();
		glPopAttrib();
	glEndList();
}//end make_eye



