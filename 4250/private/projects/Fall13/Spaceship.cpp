//This program draws a spaceship with an alien.  All coordinates are
//in the range from -8 to 8 in x and y.  Display lists are used to
//produce the ship.

#include <stdlib.h>
#include <cmath>
#include <GL/glut.h>

//define diplay list identifiers
#define Circle  1
#define Ship    2
#define Glass   3
#define Body    4
#define Leg     5
#define Base    6
#define Head    7
#define Eye     8

#define PI 3.1415926535898      //PI

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
/* 
	Function:  reshape()

	Precondition: This function should be registered as the
	reshape callback.

	Postcondition: This function is the reshape callback function 
	and it takes care of a resize event.
*/
void reshape(int width, int height) {

	// Set the new viewport size
	glViewport(0, 0, (GLint)width, (GLint)height);

	// Choose the projection matrix to be the matrix 
	// manipulated by the following calls
	glMatrixMode(GL_PROJECTION);

	// Set the projection matrix to be the identity matrix
	glLoadIdentity();

	// Define the dimensions of the world window
	gluOrtho2D(-8.0, 8.0, -8.0, 8.0);

	// Choose the modelview matrix to be the matrix
	// manipulated by further calls
	glMatrixMode(GL_MODELVIEW);
}//end reshape()

/* 
	Function: draw()

	Preconditions: This function should be registered as the display
	callback.

	Postconditions: All necessary display lists will be called and all
	images will be displayed on the screen.
*/
void draw(void) 
{
	// Clear the the RGB buffer
	glClear(GL_COLOR_BUFFER_BIT);

	sxPos = 4.0;        //ship position x value
	syPos = -5.5;       //ship position y value
	lx1Pos = 5.8;       //leg 1 position x value
	ly1Pos = -5.9;      //leg 1 position y value
	lx2Pos = 2.2;       //leg 2 position x value
	ly2Pos = -5.9;      //leg 2 position y value
	lx3Pos = 4.2;       //leg 3 position x value
	ly3Pos = -6;        //leg 3 position y value
	sRot = 0;           //ship degree for rotation
	szRot = 0;          //ship z value for rotation
	sxScal = 1.0;       //ship x value for scale
	syScal = 1.0;       //ship y value for scale
	byScal = 1.7;       //base y value for scale


	//set parameters for right back leg
	glLoadIdentity();
	glColor3f(.5,.5,.5);
	glTranslatef(lx1Pos,ly1Pos,0.0);
	glScalef(5,13,0);
	glRotatef(0,0,0,0);
	glCallList(Leg);

	//set parameters for right back leg
	glLoadIdentity();
	glColor3f(.5,.5,.5);
	glTranslatef(lx2Pos,ly2Pos,0.0);
	glScalef(5,13,0);
	glRotatef(180,0,1,0);
	glCallList(Leg);

	//set parameters for the space ship, including the alien
	glLoadIdentity();
	glTranslatef(sxPos,syPos,0.0);
	glScalef(sxScal,syScal, 1.0);
	glRotatef(sRot,0,0,szRot);
	glCallList(Ship);

	//set parameters for the base of the ship
	glLoadIdentity();
	glTranslatef(4,-6,0.0);
	glScalef(5.1, byScal, 1.0);
	glCallList(Base);

	//set parameters for front leg
	glLoadIdentity();
	glColor3f(.5,.5,.5);
	glTranslatef(lx3Pos, ly3Pos,0.0);
	glScalef(7,16,0);
	glRotatef(0,0,0,0);
	glCallList(Leg);

	// Flush the buffer to force drawing of all objects thus far
	glFlush();
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
				glVertex2f(cosine, sine);//plot point
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
			glVertex2f(0,.8);
			glVertex2f(-.5,.75);
			glVertex2f(-.9,.4);
			glColor3f(.93,.93,.93);			
			glVertex2f(-1,0);			
			glVertex2f(1,0);
			glVertex2f(.9,.4);	
			glColor3f(.55,.55,.55);
			glVertex2f(.5,.75);
		glEnd();				//end top half of ship

		//bottom half of ship
		glBegin(GL_POLYGON);
			glColor3f(.55,.55,.55);
			glVertex2f(0,-.8);
			glVertex2f(-.5,-.75);
			glVertex2f(-.9,-.4);			
			glVertex2f(-1,0);
			glColor3f(.75,.75,.75);			
			glVertex2f(1,0);			
			glVertex2f(.9,-.4);	
			glColor3f(.55,.55,-.55);
			glVertex2f(.5,-.75);
		glEnd();				//end bottom half of ship

		//light bar
		glBegin(GL_POLYGON);
			glColor3f(1,0,0);
			glVertex2f(.5,-.7);
			glVertex2f(.0,-.9);
			glColor3f(0,0,1);
			glVertex2f(-.5,-.7);
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
void main(int argc, char **argv) 
{
	// Open a window for the application
	glutInit(&argc, argv);
	glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);
	glutInitWindowSize (800, 500); 
	glutInitWindowPosition (0, 0);
	glutCreateWindow ("Spaceship with Alien");
	
	// Set the clear color to black
	glClearColor(0.0, 0.0, 0.0, 0.0);
		
	//Call procedures to create the display lists
	make_body();     //makes a display list for the ship's shell
	make_base();     //makes a list for the base of the ship
	make_head();     //makes a list for the alien's head
	make_eye();      //makes a list for an alien's eye
	make_leg();      //makes a list for one leg of the ship
	make_glass();    //makes the ship's glass that surrounds the alien
	make_ship();     //makes a list for the ship


	// Assign reshape() to be the function called whenever 
	// a reshape event occurs
	glutReshapeFunc(reshape);

	// Assign draw() to be the function called whenever a display
	// event occurs, generally after a resize or expose event
	glutDisplayFunc(draw); 

	// Pass program control to glut's event handling code
	// In other words, loop forever
	glutMainLoop();
}
