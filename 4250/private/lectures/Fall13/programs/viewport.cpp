//
//  viewport.cpp
//

#include <OpenGL/gl.h>		// Header File For The OpenGL32 Library
#include <OpenGL/glu.h>		// Header File For The GLu32 Library
#include <GLUT/glut.h>		// Header File For The GLut Library

#include <cmath>
#include <cstdlib>
using namespace std;

#define screenWidth 400
#define screenHeight 300

#define PI 3.1415926

float R = 1.0*screenWidth/screenHeight;   // aspect ratio

void KeyHandler(unsigned char theKey, int mouseX, int mouseY);
void MyInit();
void MyDisplay();
void setWindow(double left, double right, double bottom, double top);
void setViewport(double left, double right, double bottom, double top);
void DrawCurve();
void myReshape(GLsizei W, GLsizei H);


//<<<<<<<<<<<<<<<<<<<<<<<< main >>>>>>>>>>>>>>>>>>>>>>
int main(int argc, char** argv)
{
	glutInit(&argc, argv);          // initialize the toolkit
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB); // set display mode
	glutInitWindowSize(screenWidth, screenHeight); // set window size
	
	glutInitWindowPosition(100, 150); // set window position on screen
	glutCreateWindow("Viewport and Orthographic 2D"); // open the screen window
	
	glutDisplayFunc(MyDisplay);     // register redraw function
	glutKeyboardFunc(KeyHandler);
	//glutReshapeFunc(myReshape);   // reshape callback function to
									// keep the shape of the image
	MyInit();    
	
	glutMainLoop(); 		     // go into a perpetual loop
	
	return 0;
}


//--------------- setWindow ---------------------
void setWindow(double left, double right, double bottom, double top)
{
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluOrtho2D(left, right, bottom, top); 
}


//---------------- setViewport ------------------
void setViewport(double left, double right, double bottom, double top)
{
	glViewport(left, bottom, right - left, top - bottom);
}


void MyInit()
{
	glClearColor(1, 1, 1, 0);
	
	glColor3f(0, 0.8, 1);
	
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glLineWidth(3.0);
	//setWindow(0, screenWidth, 0, screenHeight);
	//setViewport(0, screenWidth, 0, screenHeight);
	
	setWindow(-5.0, 5, -0.3, 1.0);	// set the window
	setViewport(0, 200, 0, 150);// set the viewport
}

void MyDisplay() // plot the sinc function, using world coordinates
{
	glClear(GL_COLOR_BUFFER_BIT);

	DrawCurve();
}

void DrawCurve()
{
	glBegin(GL_LINE_STRIP);
	for(GLfloat x = -4.0; x < 4.0; x += 0.1)     // draw the plot
		glVertex2f(x, sin(PI * x) / (PI * x)); 
	glEnd();
	glFlush();
}


void myReshape(GLsizei W, GLsizei H)
{
	// compare with (global) window aspect ratio
	if(R > W/H) //  W << H  --> narrow window case
		setViewport(0, W, 0, W/R);   // width no change, height adjust accordingly
	else    // W >> H --> flat window case
		setViewport(0, H * R, 0, H);   // height no change, width adjust accordingly
}


void KeyHandler(unsigned char theKey, int mouseX, int mouseY)
{
	glClear(GL_COLOR_BUFFER_BIT);
	
	if (theKey == 'q')
		exit(0);
	
	else if (theKey == '2')  // 2 image side by side
	{
		for (int i=0; i<2; i++)
		{
			setViewport(i*screenWidth/2.0, (i+1)*screenWidth/2.0, 0, screenHeight);   
			DrawCurve();
		}
		
	}		
	
	else if (theKey == '4')  // 4 image tile + flip image
	{
		for (int i=0; i<2; i++)
			for (int j=0; j<2; j++)
			{
				
				if ((i+j)%2 == 0)
					setWindow(-5, 5, -0.3, 1);
				else
					setWindow(-5, 5, 1, -0.3);
				
				setViewport(i*screenWidth/2.0, (i+1)*screenWidth/2.0, j*screenHeight/2.0, (j+1)*screenHeight/2.0);
				DrawCurve();			
			}
	}
}
