/*
 *  polyline.h
 *  PolylineEditor
 *
 *  Created by Cen Li on 8/22/11.
 *  Copyright 2011 __MyCompanyName__. All rights reserved.
 *
 */

#ifndef PolyLineClass_H
#define PolyLineClass_H
#include <Windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <gl/glut.h>
const GLint MAX_Points = 10;  // max 10 input points. 
					// Since the last point has to be the same as the first point,
					// a maximum of 11 point will be stored in each polyline shape
struct PointType 
{
	int x, y;
};

class PolylineClass
{
public:
	PolylineClass();
	
	void Reset();
	void Add(int x, int y, bool flag);
	
	void Delete(int index);
	void Move(int index, int x, int y);
	//void Restart();
	
	void LocatePoint(int x, int y, int& position, GLdouble &distance); // return the index of the point in the shape closest to (x, y)
	void GetColor(GLdouble & r, GLdouble & g, GLdouble & b);
	void PutColor(GLdouble r, GLdouble g, GLdouble b);
	int  GetSize();
	void GetPoint(int& x, int& y, int index);
private:
	PointType points[MAX_Points+1];
	GLdouble red, green, blue;
	int numOfPoints;
};

#endif