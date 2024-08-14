////Programmer:			Chris Vogel
//	Assignment:			OLA5B
//	Class:				CSCI 2170-002
//	Course instructor:	Dr. Cen Li
//	Due date:			Tuesday, 04/05/2011
//
//	Descrition: This is the a implementation file of FlightMap.

#include "type.h"
#include "sortedListClass.h"
#include "flightMap.h"
#include <iostream>
#include <iomanip>
#include <fstream>

using namespace std;

// Constructor FlightMap()
// Precondition: None
// Postcondition: number of cities is initialized,
//	cities.dat and flights.dat are opened.
FlightMap::FlightMap()
{
	// The number of cities
	numberCities = 0;
	
	citiesFile.open("cities.dat");
	flightsFile.open("flights.dat");
}

// Copy constructor FlightMap()
// Precondition: None
// Postcondition: The VALUES of one FlightMap are copied
//	to another.
// Arguments:
//	const FlightMap& fm: the FlightMap to copy
FlightMap::FlightMap(const FlightMap& fm)
{
	numberCities = fm.numberCities;
	flightMap = new listClass [numberCities];
	
	// For every city
	for(int i = 0; i < numberCities; i++)
	{
		flightMap[i] = fm.flightMap[i];
	}
	
	cities = new string [numberCities];
	
	// For every city
	for(int i = 0; i < numberCities; i++)
	{
		cities[i] = fm.cities[i];
	}
	
}
	
// Destructor ~FlightMap()
// Precondition: cities and flightMap still take up memory, and
//	files are still opened
// Postcondition: all memory is cleared; all files are closed
FlightMap::~FlightMap()
{
	delete [] cities;
	delete [] flightMap;
	citiesFile.close();
	flightsFile.close();
}

// void ReadCities()
// Description: Reads the cities from cities.dat, dynamically 
//	allocates memory in a string array for each city, and then
//	sorts the cities in ascending order.
// Precondition: None
// Postcondition: The cities from cities.dat are placed in a 
//	dynamically allocated string array.
void FlightMap::ReadCities()
{
	citiesFile >> numberCities;
	cities = new string [numberCities];
	
	// For every city
	for(int i = 0; i < numberCities; i++)
	{
		citiesFile >> cities[i];
	}
	
		
	bool sorted = false; // Are the cities sorted?
	int i;
	
	// While the cities are not sorted,
	// do a bubble sort.
	while(!sorted)
	{
		int last = numberCities - 1;
		sorted = true;
		for (i = 0; i < last; i++)
		{
			if(cities[i] > cities[i + 1])
			{
				string city1 = cities[i];
				cities[i] = cities[i + 1];
				cities[i + 1] = city1;
				sorted = false;
			}
		}
		last--;
	}
}

// void ReadFlights()
// Description: Dynamically allocates a sorted list for each origin
//	city in flightMap. Flights are read from flights.dat and placed
//	into the appropriate city's sorted list.
// Precondition: None
// Postcondition: The flights from flights.dat are placed into their
//	origin's cities sorted list.
void FlightMap::ReadFlights()
{
	flightMap = new listClass [numberCities];
	
	// pieces of FlightStruct
	int flightNumber;
	string origin;
	string destination;
	int price;
	
	// Flight to be inserted into list
	FlightStruct tempFlight;
	
	// While there is flight information to read from flights.dat
	while(flightsFile >> flightNumber >> origin >> destination >> price)
	{
		tempFlight.flightNumber = flightNumber;
		tempFlight.origin = origin;
		tempFlight.destination = destination;
		tempFlight.price = price;
		
		bool success = false;
		
		flightMap[FindIndex(origin)].ListInsert(tempFlight, success);
	}
}


// int FindIndex()
// Description: Return the index of a given city in the flightmap
// Arguments:
//	string origin: The city whose index is unknown
// Precondition: The program does not know the index of a given city
// Postcondition: The index of a given city is returned
int FlightMap::FindIndex(string origin)
{
	int i = 0;
	// While less passes than the number of cities
	// &&
	// While the origin city doesn't match the current city
	while(i < numberCities && origin != cities[i])
	{
		i++;
	}
	
	return i;
}

// Overloaded << operator
// Prints the entire fightMap
ostream & operator << (ostream& os, const FlightMap& rhs)
{
	// for every city
	for(int i = 0; i < rhs.numberCities; i++)
	{
		// if the city has outgoing flights
		if(!rhs.flightMap[i].ListIsEmpty())
			os << "From " << rhs.cities[i] << " to: "
				<< endl << rhs.flightMap[i];
	}
	return os;
}
