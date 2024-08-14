#include<windows.h>
#include<gl/glut.h>

//sound settings
bool    sound = true;             //true if there is sound capability
void drawScene()
{
	//clear the screeen
	glClear(GL_COLOR_BUFFER_BIT);
    	//if sound is on, play it
	if (sound)
	{
		PlaySound("bzzz.wav", NULL, SND_LOOP | SND_ASYNC);
	}
	else 
	{
		PlaySound(NULL, NULL, SND_LOOP | SND_ASYNC);
	}
	glFlush();

}
void InitGL()
{
	glClearColor (1.0, 0.0, 0.0, 0.0);          //set the background color to white	
	glColor3f (0.0, 0.0, 0.0);                  //set the foreground color to black
}

void keyboard(unsigned char key, int x, int y)
{
	if (key == 's')
	{
		sound = true;
		glClearColor(1.0, 0.0, 0.0, 1.0);
	}
	else if (key == 'o')
	{
		sound = false;
		glClearColor(0.0, 0.0, 1.0, 1.0);
	}
	glutPostRedisplay();
}
int main()
{
	//initialization
	int argc = 1;
	char* argv = "";  //there are no command line parameters
	glutInit(&argc, &argv);
	glutInitDisplayMode(GLUT_SINGLE);
	glutInitWindowSize(500, 500);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Sound!");
	glutKeyboardFunc(keyboard);

	InitGL();
	glutDisplayFunc(drawScene);



	//start event handler
	glutMainLoop();

	return 0;
}
