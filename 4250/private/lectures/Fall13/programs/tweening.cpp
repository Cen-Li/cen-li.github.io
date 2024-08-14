/////////////////////////////////////////////////////////////////
//
//This program morphs a T shape into the shape of a house.
//
//If the program morphs too quickly on your computer, change
//the value of deltat to a smaller value.  If it morps too
//slowly, change the value of deltat to a larger value.
////////////////////////////////////////////////////////////////

#include <GLUT/glut.h>
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include <iostream>
#include <fstream>
#include <assert.h>
using namespace std;

#define RATIO 1.618          //Golden Raito 1:1.618
#define WW    100            //Width of viewport
#define WH    (WW/RATIO)     //Height of viewport
#define HALFX ((int)(WW/2))  //X coordinate  min/max
#define HALFY ((int)(WH/2))  //Y coordinate  min/max

int MAX_POINTS=9;  // the shape is defined by 9 points

struct Point2   // define a 2D point
{
	GLfloat x, y;
};

//Globals
int WindowWidth;             //Window width in pixels
int WindowHeight;            //Window height in pixels 

//Data for the shapes
Point2 StartShape[9];
Point2 EndShape[9];
float deltaT=0.002;	         //increment of T

//Prototypes
void MyInit();
void Display();
void Reshape(int,int);

int main(int argc, char **argv)
{
	
    //initialize glut
    glutInit(&argc,argv);   
    glutInitDisplayMode(GLUT_RGB|GLUT_DOUBLE);
	
    //initialize window width and height using the golden ratio
    WindowWidth  = (int)(glutGet((GLenum)GLUT_SCREEN_WIDTH)*.5); 
    WindowHeight = (int)(WindowWidth/RATIO);
	
    //Create window
    glutInitWindowSize(WindowWidth,WindowHeight); 
    glutInitWindowPosition(50, 50);
    glutCreateWindow("Tween Demo");
	
    //register callback functons
    glutDisplayFunc(Display);               //display a frame
    glutReshapeFunc(Reshape);               //resize the window size
	
    MyInit();								//initialize open gl
	
    glutMainLoop();							//begin event processing
		
}//end main

// compute linear interpolation from A to B at time t
float Tween (float A, float B, float t)  
{     
	return  (A + (B-A)*t); 
}

// draw the tweening figure from figure A to B at time t
// n is the number of points defining figure A/B
void DrawTween(Point2 PolylineA[ ], Point2 PolylineB[ ], int n, float t)
{ 
	glBegin(GL_LINE_LOOP);
	// draw the tween at time t between polylines A and B with n pts
  	for (int i = 0; i < n; i++)
  	{ 
		Point2 P;
		P.x = Tween (PolylineA[i].x, PolylineB[i].x, t);
		P.y = Tween (PolylineA[i].y, PolylineB[i].y, t);
		glVertex2d(P.x, P.y);
		
		cout << i << " " << "P: " << P.x << " " << P.y << endl;
	}
	glEnd();
}

/////////////////////////////////////////////////////////////////////////////
//Display is the callback glut display function.  This
//function causes the starting shape to change into the ending
//shape.
/////////////////////////////////////////////////////////////////////////////
void Display()
{ 	
	static float t=0.0;
	if (t < 1)
		t += deltaT;
	
	//clear the buffer
	glClear(GL_COLOR_BUFFER_BIT);
		
	// Set drawing color 
	glColor3f(1.0f, 0.0f, 0.0f);
		
	// set line width, default 1.0f
	glLineWidth(2.0f);
		
	DrawTween (StartShape, EndShape, MAX_POINTS, t);
	glutSwapBuffers(); //display frame on screen
	
	for (int i = 0; i < 3000000; i++);  //lazy man's loop
	
	glutPostRedisplay(); //request draw next frame
	
}//end Display

/////////////////////////////////////////////////////////////////////
//Reshape is the callback glut reshape function.
//Reshape prevents the user from changing the aspect
//ratio of the window.
//
//w = window width
//h = window height required by glut but unused here
//////////////////////////////////////////////////////////////////
void Reshape(int w,int h)
{
    glutReshapeWindow(w,(int)(w/RATIO));
    WindowWidth=w;
    WindowHeight=(int)(w/RATIO);
    MyInit();   //reinitialize openGL
}

///////////////////////////////////////////////
//MyInit sets open gl to its initial state.
/////////////////////////////////////////////
void MyInit()
{	
    //center view around orgin
    //glMatrixMode(GL_PROJECTION);
	glMatrixMode (GL_MODELVIEW);
    glLoadIdentity();
    gluOrtho2D(-HALFX,HALFX,-HALFY,HALFY);
 	
    //set state variables
    glClearColor(1, 1, 1, 1);
	
	// read in the starting figure and ending figure points
	ifstream myIn("datafile1");   MAX_POINTS=9; // for datafile11
	//ifstream myIn("datafile2"); MAX_POINTS=4; // for datafile2
	//ifstream myIn("datafile3"); MAX_POINTS=4;
	assert(myIn);
	int i=0;
	while (i<MAX_POINTS)
	{
		myIn >> StartShape[i].x >> StartShape[i].y;
		i++;
	}
	i=0;
	while (i<MAX_POINTS)
	{
		myIn >> EndShape[i].x >> EndShape[i].y;
		i++;
	}
	myIn.close();
	for (i=0; i<MAX_POINTS; i++)
		cout << StartShape[i].x << ", " << StartShape[i].y << endl;
	
	for (i=0; i<MAX_POINTS; i++)
		cout << EndShape[i].x << ", " << EndShape[i].y << endl;

    //glViewport(0,0,WindowWidth,WindowHeight);	
}