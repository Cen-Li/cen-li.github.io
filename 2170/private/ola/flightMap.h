#ifndef FLIGHTMAP_H
#define FLIGHTMAP_H

#include "type.h"
#include "sortedListClass.h"
#include <iostream>
#include <iomanip>
#include <fstream>

using namespace std;

class FlightMap
{
	public:
		// Constructor FlightMap()
		// Precondition: None
		// Postcondition: number of cities is initialized,
		//	cities.dat and flights.dat are opened.
		FlightMap();
		
		// Copy constructor FlightMap()
		// Precondition: None
		// Postcondition: The VALUES of one FlightMap are copied
		//	to another.
		// Arguments:
		//	const FlightMap& fm: the FlightMap to copy
		FlightMap(const FlightMap& fm);
		
		// Destructor ~FlightMap()
		// Precondition: cities and flightMap still take up memory, and
		//	files are still opened
		// Postcondition: all memory is cleared; all files are closed
		~FlightMap();
		
		// void ReadCities()
		// Description: Reads the cities from cities.dat, dynamically 
		//	allocates memory in a string array for each city, and then
		//	sorts the cities in ascending order.
		// Precondition: None
		// Postcondition: The cities from cities.dat are placed in a 
		//	dynamically allocated string array.
		void ReadCities();
		
		// void ReadFlights()
		// Description: Dynamically allocates a sorted list for each origin
		//	city in flightMap. Flights are read from flights.dat and placed
		//	into the appropriate city's sorted list.
		// Precondition: None
		// Postcondition: The flights from flights.dat are placed into their
		//	origin's cities sorted list.
		void ReadFlights();
		
		// Overloaded << operator
		// Prints the entire fightMap
		friend ostream& operator << (ostream& os,const FlightMap& rhs);
		
	private:
		// The number of cities
		int numberCities;
		
		// Dynamically allocated array of cities
		string* cities;
		
		// Dynamically allocated array of sorted lists
		listClass* flightMap;
		
		// cities.dat: list of cities
		ifstream citiesFile;
		
		// flights.dat: list of flights
		ifstream flightsFile;
		
		// int FindIndex()
		// Description: Return the index of a given city in the flightmap
		// Arguments:
		//	string origin: The city whose index is unknown
		// Precondition: The program does not know the index of a given city
		// Postcondition: The index of a given city is returned
		int FindIndex(string origin);
};


#endif
