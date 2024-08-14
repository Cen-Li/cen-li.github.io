
/////////////////////////////////////////////////////////////////
//PROGRAMMER: Stephen Panek
//This program demonstrates the use of textures in openGL.
//It produces 2 lit spheres and 3 smooth shaded squares
//with different texture mapping  options.
//The texture is a 8x8 grid of black and white tiles.
////////////////////////////////////////////////////////////////

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


//#define RATIO  1.618 //Golden Ratio 1:1.618   
#define RATIO 1
#define SPHERE 1     //display list
#define TILE   1     //texture #

//globals
int WindowWidth=400;                       //Window width in pixels
int WindowHeight=400;                      //Window height in pixels

//vertex data
float Vertex[4][3]={{-1,-1,0},
	                {1,-1,0},
	                {1,1,0},
	                {-1,1,0}};
float Color[4][4]={{1,0,0,1},
	               {0,1,0,1},
	               {0,0,1,1},
				   {1,1,1,1}};

// version 1: 100% texture overlap
// ranger of [s, t] --> [0, 1]
float Texture[4][2]=
	{{0,0},
	{0,1},
	{1,1},
	{1,0}};

// version 2: texture stretched
/*
float Texture[4][2]=
	{{0,0},
	{0.5,0},
	{0.5,0.5},
	{0, 0.5}};
*/

GLubyte Faces[4]={0,1,2,3};

//general prototypes
void InitGL();

//callback prototypes
void Display();
void Reshape(int,int);

///////////////////////////////////////////////////////////////////
//Main initializes glut, initializes global variables,
//creates viewing window and registers glut callback functions.
///////////////////////////////////////////////////////////////////
int main(int argc, char **argv)
{
    //initialize glut
    glutInit(&argc,argv);   
    glutInitDisplayMode(GLUT_RGBA|GLUT_DEPTH|GLUT_ALPHA);
	
    //initialize globals
    WindowWidth  = (int)(glutGet((GLenum)GLUT_SCREEN_WIDTH)*.8); 
    WindowHeight = (int)(WindowWidth/RATIO);
	
    //Create window
    glutInitWindowSize(WindowWidth,WindowHeight); 
    glutInitWindowPosition((int)(glutGet((GLenum)GLUT_SCREEN_WIDTH)*.1),(glutGet((GLenum)GLUT_SCREEN_HEIGHT)/2)-(WindowHeight/2));
    glutCreateWindow("Texture Mapping Demo");
	
    //register callback functons
    glutDisplayFunc(Display);                    //display a frame
    glutReshapeFunc(Reshape);                    //resize the window size
	
    InitGL();//initialize open gl
	
    glutMainLoop();//begin event processing
	
}//end main

/////////////////////////////////////////////////////////////////////////////
//Display is the callback glut display function.
//Display renders the scene.
/////////////////////////////////////////////////////////////////////////////
void Display()
{   
    float LightPosition0[4]={0,0,10,0};    //directional light 0
	
    glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT);
	
    glLoadIdentity();  
	
	//set the camera's position
    gluLookAt(0,0,20,0,0,0,0,1,0);
	
    glLightfv(GL_LIGHT0, GL_POSITION, LightPosition0);  //set light direction
	
    //reset texture matrix
    glMatrixMode(GL_TEXTURE);
    glLoadIdentity();
    glMatrixMode(GL_MODELVIEW);
	
    //clamp texture in s direction and repeat texture in t direction
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP); 
	//glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_REPEAT); 
    //glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP);
	
	//The texture will be modulated with the colors for the object
    glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_MODULATE);
    glTranslatef(-5,0,0);
	
	//draw the vector array using the Faces indices
    glDrawElements(GL_QUADS,4,GL_UNSIGNED_BYTE,Faces);
	
    //texure wrap is not important all texture coords are between 0 and 1
    //texture is  modulated with material properties of the sphere
    glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_MODULATE);
    glEnable(GL_LIGHTING);
    glTranslatef(3,0,0);
    glCallList(SPHERE);	
	
    //draw texture using replace mode (i.e. the texture replaces the
	//material properties of the sphere.
    glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE);
    glTranslatef(3,0,0);
    glPushMatrix();
    glRotatef(45,1,1,1);
    glCallList(SPHERE);	
    glPopMatrix();
	
	//getting ready for a redisplay
    glDisable(GL_LIGHTING);
	
	glFlush();           //display frame on screen
	
}//end Display

///////////////////////////////////////////////
//InitGl sets open gl to its initial state.
/////////////////////////////////////////////
void InitGL()
{   
	
    int s,t;                 //texture coords
    GLubyte Tile[64][64][4]; //texture array
    int TexColor;            //color element value
	
    //light properties
    float LightAmbient[4]  = {0.1f, 0.1f, 0.1f, 1.0f};
    float LightDiffuse[4]  = {1.0f, 1.0f, 1.0f, 1.0f};
    float LightSpecular[4] = {1.0f, 1.0f, 1.0f, 1.0f};
    float ModelAmbient[4]  = {0.6f, 0.6f, 0.6f, 1.0f};
	
    //gold material properties for the sphere   
    float MatAmbient[4]={0.24725f, 0.1995f, 0.0745f,1};
    float MatDiffuse[4]={0.75164f, 0.60648f, 0.22648f,1};
    float MatSpecular[4]= {0.628281f,0.555802f, 0.366065f,1};
	
    //set up perspective projection
    glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective (45, WindowWidth/WindowHeight, 10, 100);
    glMatrixMode(GL_MODELVIEW);
    glViewport(0,0,WindowWidth,WindowHeight);
	
    //set state variables
    glClearColor(0,0,0,0);
    glEnable(GL_DEPTH_TEST);
	
    //set client state -- this program uses
	//a vertex array, color array, and texture array.
    glEnableClientState (GL_VERTEX_ARRAY);
    glEnableClientState (GL_COLOR_ARRAY);
    glEnableClientState (GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,Vertex);
    glColorPointer(4,GL_FLOAT,0,Color);
    glTexCoordPointer(2,GL_FLOAT,0,Texture);
	
    //set lighting properties
    glLightfv(GL_LIGHT0,GL_AMBIENT,LightAmbient);
    glLightfv(GL_LIGHT0,GL_DIFFUSE,LightDiffuse);
    glLightfv(GL_LIGHT0,GL_SPECULAR,LightSpecular);
    glLightModelfv(GL_LIGHT_MODEL_AMBIENT,ModelAmbient);
    glLightModelf(GL_LIGHT_MODEL_LOCAL_VIEWER,0);
    glEnable(GL_LIGHT0);
	
    //set material properties to gold
    glMaterialfv(GL_FRONT,GL_AMBIENT,MatAmbient);
    glMaterialfv(GL_FRONT,GL_DIFFUSE,MatDiffuse);
    glMaterialfv(GL_FRONT,GL_SPECULAR,MatSpecular);
    glMaterialf(GL_FRONT,GL_SHININESS,0.2f*128.0);
	
    //create a sphere display list
    GLUquadricObj * Quadric;
    Quadric=gluNewQuadric();
	
	//We want a filled, Gourad shaded, textured sphere.
    gluQuadricDrawStyle(Quadric,(GLenum) GLU_FILL);
    gluQuadricNormals(Quadric,(GLenum) GLU_SMOOTH);
    gluQuadricTexture(Quadric,GL_TRUE);
    glNewList(SPHERE,GL_COMPILE);
	glMatrixMode(GL_TEXTURE);
	glLoadIdentity();
	glMatrixMode(GL_MODELVIEW);    
	gluSphere(Quadric,1,64,64);
    glEndList();    
    gluDeleteQuadric(Quadric);
	
    //create texture
    for(s=0;s<64;s++)
    {
        for(t=0;t<64;t++)
        {
			//sets every other 8 pixels to black and 8 to white using bitwise XOR
            TexColor=( ((s&0x8)==0) ^ ((t&0x8)==0) )*255; 
            Tile[s][t][0]=TexColor;                   //red
            Tile[s][t][1]=TexColor;                   //green
            Tile[s][t][2]=TexColor;                   //blue
            Tile[s][t][3]=255;                        //alpha
        }
    }
	
	//GL_TEXTURE_2D is now associated with the name TILE
    glBindTexture(GL_TEXTURE_2D,TILE);        
	
	//Specify what happens for magnification and minification
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);
	
	//Specify that Tile is the texture array to use with GL_TEXTURE_2D
	glTexImage2D(GL_TEXTURE_2D, 0, 4, 64, 64, 0, GL_RGBA, GL_UNSIGNED_BYTE, Tile);
	
	
	//Alternately, we could let OpenGL build textures at 4 detail levels for mipmapping
    //gluBuild2DMipmaps(GL_TEXTURE_2D, 4, 64, 64,GL_RGBA, GL_UNSIGNED_BYTE,Tile); 
	//glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);
	
	
	//enable texture mapping
    glEnable(GL_TEXTURE_2D);     
	
}//end InitGl

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
    glViewport(0,0,WindowWidth,WindowHeight);
	
}//end Reshape
