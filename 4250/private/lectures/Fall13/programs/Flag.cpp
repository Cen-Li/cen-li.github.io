#include <windows.h>
#include <glut.h>
#include <math.h>
#include "TextureLoader.h"

////////////
#define NUMBER_TEXTURES	1
#define TEXTUER_FLAG	texture_Ids[0]
// texture ids
GLuint texture_Ids[NUMBER_TEXTURES];

float flag_points[ 100 ][ 100 ][3];
int flag_w =45;
int flag_h =45;
int flag_wiggle=0;

GLUquadricObj *qquadric;


void Reshape(int w, int h)
{
	glViewport(0, 0, w, h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
 	gluPerspective(45.0, (float)w/(float)h, 1.0, 400.0);
	//gluLookAt(0,3,0.1,0,3,0,0,1,0);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
}
void pole()
{
	glPushMatrix();
	glColor3f(0.0,0.0,1.0);
		glTranslated(-4,4,2);
		glRotatef(90, 1, 0, 0);
		gluCylinder(qquadric, 0.4, 0.4, 15, 10,5);
	glColor3f(1.0,1.0,1.0);
		glPopMatrix();
}
void flag_mesh()
{
	glPushMatrix();
	glTranslated(0,-2,15);
	pole();
	glBegin(GL_QUADS);
	int x, y;
	// Start Drawing Our flag
	// draw start with bottom lift corner
	for (x = 0; x < flag_w-1; x++) {
		for (y = 0; y < flag_h-1; y++) {
			glColor3f(1,0,0);
			// Bottom Left
			glVertex3f(flag_points[x][y][0], flag_points[x][y][1], flag_points[x][y][2]);
			// Top Left
			glVertex3f(flag_points[x][y+1][0], flag_points[x][y+1][1], flag_points[x][y+1][2]);
			// Top Right
			glVertex3f(flag_points[x+1][y+1][0], flag_points[x+1][y+1][1], flag_points[x+1][y+1][2]);
			// Bottom Right
			glVertex3f(flag_points[x+1][y][0], flag_points[x+1][y][1], flag_points[x+1][y][2]);
		}
	}
	glEnd();
	glPopMatrix();
}
void Draw_texture_of_Flag()
{
	glPushMatrix();
	glTranslated(0,-2,15);
	pole();
	glRotated(180, 1, 0,0);
	 // Select a image Texture
	glBindTexture(GL_TEXTURE_2D, texture_Ids[0]);

	glBegin(GL_QUADS);// Start Drawing A Textured Quad
	int x, y;
	float float_x, float_y, float_xb, float_yb;
	// Start Drawing Our flag
	// draw start with bottom lift corner
	for (x = 0; x < flag_w-1; x++) {
		for (y = 0; y < flag_h-1; y++) {
			float_x = float(x)/flag_w-1.0f;
			float_y = float(y)/flag_h-1.0f;
			float_xb = float(x+1)/flag_w-1.0f;
			float_yb = float(y+1)/flag_h-1.0f;
			//specify a texture coordinate before each vertex.
			// The bottom left of the texture is mapped to the bottom left of the quad
			// Bottom Left
			glTexCoord2f(float_x, float_y);
			glVertex3f(flag_points[x][y][0], flag_points[x][y][1], flag_points[x][y][2]);
			// Top Left
			glTexCoord2f(float_x, float_yb);
			glVertex3f(flag_points[x][y+1][0], flag_points[x][y+1][1], flag_points[x][y+1][2]);
			// Top Right
			glTexCoord2f(float_xb, float_yb);
			glVertex3f(flag_points[x+1][y+1][0], flag_points[x+1][y+1][1], flag_points[x+1][y+1][2]);
			// Bottom Right
			glTexCoord2f(float_xb, float_y);
			glVertex3f(flag_points[x+1][y][0], flag_points[x+1][y][1], flag_points[x+1][y][2]);
		}
	}
	// Done Drawing The Quad
	glEnd();
	glPopMatrix();
}

void wave()
{
	float tmp;
	// animate the flag by moving Z value 
	if (flag_wiggle == 70) {
		for (int y = 0; y < flag_h; y++) {
			// first value for each line
			 tmp = flag_points[0][y][2];
			for (int x = 0; x < flag_w; x++) {
			flag_points[x][y][2] = flag_points[x+1][y][2];
			// last value for each line becomes first one
			flag_points[flag_w][y][2] = tmp;
			}
		}
		flag_wiggle = 0;
	}
	flag_wiggle++;
}

void Display(void) 
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glLoadIdentity();
	glTranslatef(0, 4, -35);
	
	//flag_mesh();

	Draw_texture_of_Flag();

	wave();
	
 	glutSwapBuffers();
}

void Key(unsigned char key, int x, int y )
{
	if(key ==  27 )	
		exit(0);
}

void action(void)
{
 Display();
}
//In our Initialize function
bool init(void)
{
	qquadric = gluNewQuadric();

	// Create the flag
		for (int x = 0; x < flag_w; x++) {
		for(int y = 0; y < flag_h; y++) {
			//define the box y |___ x
		
	/*	 ||      ||
		  ||    ||
		   ||  ||
		    ||||      */
			//setting the X and Y values around the origin
			flag_points[x][y][0]=float((x/5.0f)-4.5f);
			flag_points[x][y][1]=float((y/5.0f)-4.5f);
			//the sine function sets the Z value for each point.
			flag_points[x][y][2]=float(sin(((x * 14.0f)/300.0f)*6.0f)); 
		}
	}

	// enable texture coordinate and vertex evaluators
	glEnable(GL_MAP2_TEXTURE_COORD_2);
	glEnable(GL_MAP2_VERTEX_3);
	//Enable 2D Texture Mapping
	glEnable(GL_TEXTURE_2D);


	// load textures from files
	glGenTextures(NUMBER_TEXTURES, texture_Ids);// Create the Texture
	//Load the image And Convert To Texture
	LoadTexture("flag_1.ppm", TEXTUER_FLAG);

	return TRUE;
}


void main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_DEPTH);
	glutInitWindowSize(800, 500);
	glutInitWindowPosition (0,0);
	glutCreateWindow("Drawing a flag");
	if(!init())
	{
		MessageBox(NULL, "Initializing Error", "Error", 0);
		exit(1);
	}
	glutDisplayFunc(Display);
	glutReshapeFunc(Reshape);
	glutKeyboardFunc(Key);
	//it will call repeatedly
	glutIdleFunc(action);
	glutMainLoop();
}
