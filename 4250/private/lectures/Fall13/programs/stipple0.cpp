// Cen Li
// stipple with user-set features
// This program illustrates: 
// (1) how to use line stippling patterns
// (2) thickness of lines
// (3) color of lines
// (4) 2D plotting of math functions

#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>

#include <cmath>
using namespace std;

// Define a constant for the value of PI
#define GL_PI 3.1415f
#define Width 600
#define Height 400

void MyInit();
void Draw();
void PlotFunctions();
void DrawCoordinates();

int main(int argc, char* argv[])
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB );
	glutInitWindowSize(Width,Height); 
	glutInitWindowPosition(100,200);  
	glutCreateWindow("Stippled Line Example");
	
	glutDisplayFunc(Draw);
	MyInit();
	glutMainLoop();
	
	return 0;
}

// set the background and foreground drawing color
void MyInit()
{
	// Black background
	glClearColor(1.0f, 1.0f, 1.0f, 1.0f );
	
	// Set drawing color 
	glColor3f(1.0f, 0.0f, 0.0f);
	
	glMatrixMode (GL_PROJECTION);    
	glLoadIdentity ();    
	//gluOrtho2D(-100.0, 100.0, -100.0, 100.0);  
	gluOrtho2D(-80.0, 80.0, -100.0, 500.0);    // clipping for math functions 
	
}

// Called to draw scene
void Draw()
{
	GLfloat y;					// Storeage for varying Y coordinate
	GLint factor = 1;			// Stippling factor: each bit in the pattern is used "factor" times
	//GLushort pattern = 0x5555;	// Stipple pattern  5555: 0101 0101 0101 0101 0101 
	GLushort pattern = 0x777;  // 0777: 0000 0111 0111 0111, or:  0x6666
	
	// Clear the window with current clearing color
	glClear(GL_COLOR_BUFFER_BIT);
		
	// Enable Stippling
	glEnable(GL_LINE_STIPPLE);
	
	// set line width, default 1.0f
	glLineWidth(2.0f);
	
	// Step up Y axis 20 units at a time
	/*
	for(y = -90.0f; y < 90.0f; y += 20.0f)
	{
		// Reset the repeat factor and pattern
		glLineStipple(factor, pattern);
		
		
		// Draw the line
		glBegin(GL_LINES);
		glVertex2f(-80.0f, y);
		

		glVertex2f(80.0f, y);	
		glEnd();
		
		factor += 2;
	}  */
	PlotFunctions();
	glDisable(GL_LINE_STIPPLE);
	// Flush drawing commands
	glFlush();
}

// Plot Functions
// f1(x) = x^2 -10* x + 1
// f2(x) = 90*sin(x)+50
// f3(x) = 4x+5
void PlotFunctions()
{
	GLfloat x, y;					// Storeage for varying Y coordinate
	GLint factor = 3;			// Stippling factor: each bit in the pattern is used "factor" times

	GLushort pattern1 = 0x6666;   // 0110 0110 0110 0110 
	GLushort pattern2 = 0x4040;   // 0100 0000 0100 0000
		
	DrawCoordinates();
	
	// some plots need stipples
	glEnable(GL_LINE_STIPPLE);
	
	glColor3f(1.0, 0.0, 0.0);
	// Reset the repeat factor and pattern
	glLineStipple(factor, pattern1);

	glBegin(GL_LINE_STRIP);	//what if use GL_POINTS
	for(x = -80.0f; x < 80.0f; x += 1.0f)
	{
		y = x*x - 10*x + 1;
		
		glVertex2f(x, y);
	}
	glEnd();
	
	// draw the 2nd function
	// Reset the repeat factor and pattern
	glLineStipple(factor, pattern2);
	
	// Set drawing color 
	glColor3f(0.0f, 1.0f, 1.0f);

	glBegin(GL_LINE_STRIP);	//what if use GL_POINTS
	for(x = -80.0f; x < 80.0f; x += 1.0f)
	{
		y = 90*sin(x*GL_PI/180)+50;
		
		glVertex2f(x, y);
	}
	glEnd();
	
	// draw the 3rd function
	// draw with solid line
	glDisable(GL_LINE_STIPPLE); 

	// Set drawing color 
	glColor3f(0.0f, 0.0f, 1.0f);
	
	glBegin(GL_LINE_STRIP);	//what if use GL_POINTS
	for(x = -80.0f; x < 80.0f; x += 1.0f)
	{
		y = 4*x+5;		
		glVertex2f(x, y);
	}
	glEnd();
}

void DrawCoordinates()
{
	// draw x-y coordinate system
	glDisable(GL_LINE_STIPPLE);
	glColor3f(0.0, 0.0, 0.0);

	// x-axis
	glBegin(GL_LINES);
	glVertex2f(-75.0, 0); 
	glVertex2f(75.0, 0);
	glEnd();
	
	// arrow along x
	glBegin(GL_LINE_STRIP);
	glVertex2f(70.0, 10);
	glVertex2f(75, 0); 
	glVertex2f(70.0, -10);
	glEnd();

	// y-axis
	glBegin(GL_LINES);
	glVertex2f(0, -100.0); 
	glVertex2f(0, 480.0);
	glEnd();
	
	// arrow along y
	glBegin(GL_LINE_STRIP);
	glVertex2f(-2.5, 460);
	glVertex2f(0, 480); 
	glVertex2f(2.5, 460);
	glEnd();
	
	// labels
	glRasterPos2f(72.0, 15.0);  // specifies the position of 'X'
	glutBitmapCharacter (GLUT_BITMAP_8_BY_13, 'X');
	
	glRasterPos2f(-10.0, 470.0);  // specifies the position of 'Y'
	glutBitmapCharacter (GLUT_BITMAP_8_BY_13, 'Y');
}

