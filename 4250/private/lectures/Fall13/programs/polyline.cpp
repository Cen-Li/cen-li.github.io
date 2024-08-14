/*
 *  polylineclass.cpp
 *  PolylineEditor
 *
 *  Created by Cen Li on 8/22/11.
 *  Copyright 2011 __MyCompanyName__. All rights reserved.
 *
 */

#include "polyline.h"
#include <iostream>
#include <cmath>
using namespace std;

PolylineClass::PolylineClass()
{
	numOfPoints=0;
	red=0;
	green=0;
	blue=0;
}

void PolylineClass::Reset()
{
	numOfPoints=0;
	red=0;
	green=0;
	blue=0;
}

void PolylineClass::GetColor(GLdouble &r, GLdouble & g, GLdouble & b)
{
	r=red;
	g=green;
	b=blue;
}

void PolylineClass::PutColor(GLdouble r, GLdouble g, GLdouble b)
{
	red=r;
	green=g;
	blue=b;
}

int PolylineClass::GetSize()
{
	return numOfPoints;
}

void PolylineClass::Add(int x, int y, bool flag)
{
	if (!flag)
	{
		if (numOfPoints < MAX_Points)
		{
			points[numOfPoints].x=x;
			points[numOfPoints].y=y;
			numOfPoints ++;
		}
		else
		{
			cout << "Can not add more points to this polyline" << endl;
		}
	}
	else 
	{  // add the first point to the end of the list
		points[numOfPoints].x = points[0].x;
		points[numOfPoints].y = points[0].y;
		numOfPoints ++;
	}

}

void PolylineClass::GetPoint(int& x, int& y, int index)
{
	x = points[index].x;
	y = points[index].y;
}

void PolylineClass::LocatePoint(int x, int y, int &closestIndex, GLdouble& closestDistance)
{
	GLdouble distance;
	closestDistance = 0;
	
	for (int i=0; i<numOfPoints-1; i++)
	{
		distance = pow(double(points[i].x - x), 2.0) + pow(double(points[i].y - y), 2.0);
		//cout << "i=" << i << " distance = " << distance << endl;
		if ((i==0) || (distance < closestDistance))
		{
			closestDistance = distance;
			closestIndex=i;
		}
	}
	cout << "located point" << closestIndex <<  endl;
	//cout << "x=" << points[closestIndex].x << "  y=" << points[closestIndex].y << endl;

}

void PolylineClass::Delete(int index)
{
	for (int i=index; i<numOfPoints-1; i++)
	{
		points[i]= points[i+1];
	}
	if (index==0)
	{
		points[numOfPoints-2]=points[0];
	}
	numOfPoints --;
}

void PolylineClass::Move(int index, int x, int y)
{
	points[index].x = x;
	points[index].y = y;
	if (index == 0 )
	{
		points[numOfPoints-1] = points[index];
	}
	else if (index == numOfPoints-1)
	{
		points[0] =  points[numOfPoints-1];
	}
		
}
