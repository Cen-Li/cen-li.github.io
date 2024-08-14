/**********************************************************************************/
////	PROGRAMMER:		Louae Tyoan
//	Assignment:		ola5B.cc: Flight Map
//	Class:			CSCI 2170
//	Course Instructor:	Dr. Cen Li
//	Due Date:		Wednesday, 4/6/2011
//	Description:	Reads the cities and flightplans from a file and
//					dsplays them in an alphabetical order of origin city
//					along with the available flights
/**********************************************************************************/

#include "sortedListClass.h"
#include "flightMap.h"

#include <cstddef>	//NULL
#include <cassert>	//assert()
#include <iostream>
#include <fstream>
#include <iomanip>
using namespace std;

int main()
{
	//create the object
	flightMap TheMap;
	
	//filestream for the city names
	ifstream CitiesIn;
	//filestream for the flight list
	ifstream FlightsIn;
	
	//open the files
	CitiesIn.open("cities.dat");
	FlightsIn.open("flights.dat");
	
	//check for correct input
	assert(CitiesIn);
	assert(FlightsIn);
	
	//Read the information inside of the files
	TheMap.ReadCities(CitiesIn, FlightsIn);
	
	//Display the map in order of origin city
	TheMap.DisplayMap();
	
	return 0;
}
