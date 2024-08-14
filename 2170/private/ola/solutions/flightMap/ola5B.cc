////Programmer:			Chris Vogel
//	Assignment:			OLA5B
//	Class:				CSCI 2170-002
//	Course instructor:	Dr. Cen Li
//	Due date:			Tuesday, 04/05/2011
//
//	Descrition: This is the a client file to test flightMap.

#include "sortedListClass.h"
#include "flightMap.h"

#include <iostream>
#include <fstream>
#include <cassert>
#include <iomanip>
using namespace std;

int main()
{	
	// The flight map
	FlightMap flightMap;
	
	// Read the cities from cities.dat
	flightMap.ReadCities();
	
	// Read the flights from flights.dat
	flightMap.ReadFlights();
	
	cout << "                        FLIGHT MAP" << endl;
	// Divider
	for(int i = 0; i < 60; i++)
	{
		cout << "=";
	}
	
	cout << endl;
	
	// Headers for the table
	cout << setw(10) << "Origin"
		<< setw(20) << "Destination"
		<< setw(17) << "Flight No."
		<< setw(10) << "Price" << endl;
	
	// Divider
	for(int i = 0; i < 60; i++)
	{
		cout << "=";
	}
	
	cout << endl;
	
	// Print the flight map
	// Overloaded << operator
	// See flightMap.cpp
	cout << flightMap;
	
	// FOOTER
	
	// Divider
	for(int i = 0; i < 60; i++)
	{
		cout << "=";
	}
	cout << endl << endl;
	return 0;
}
