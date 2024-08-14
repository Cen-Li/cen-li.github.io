#ifndef flightMap_h
#define flightMap_h

#include "sortedListClass.h"

#include <fstream>
#include <iostream>
using namespace std;


class flightMap
{
	public:
		//Default Constructor
		flightMap();
		//Copy constructor
		flightMap(const flightMap& rhs);
		//Destructor
		~flightMap();
		
		//Reads in the cities and flight lists from two input files
		void ReadCities(ifstream& CitiesIn, ifstream& FlightsIn);
		//Displays the entire map
		void DisplayMap();
	
	
	private:
		
		int citNum;	//The number of cities
		string *Cities;	//Array that holds the cities
		sortedListClass *Fmap;	//Array of objects
};

#endif
