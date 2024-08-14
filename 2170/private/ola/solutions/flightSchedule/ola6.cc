//// PROGRAMMER:    Joo Kim
// Assignment:      Open Lab Assignment 6
// Class:           CSCI 2170-003
// Course Instructor: Dr. Cen Li
// Due Date: 		Soft Copy: Midnight, Sunday, 4/17/2011
//                  Hard Copy: Monday, 4/18/2011
// Description:     This program will generate flight itinerary
//					for customer requests to fly from some origin city to
//					some destination city if available.

#include "flightMap.h"
#include "sortedListClass.h"
#include "stackClass.h"
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
	FlightMapClass map;
	string originCity, destinationCity;
	int ocNum, dcNum; 				//numbers of origin and destination city
	
	ifstream myCities("cities.dat");
	ifstream myFlights("flights.dat");
	ifstream myRequests("requests.dat");
	
	//Read cities from a data file
	map.ReadCities(myCities);
	
	//Read flight informations from a data file and build a flight map
	map.BuildMap(myFlights);
	
	//This while loop reads the request information
	//and search for the flight itinerary
	//If the path has been found, flight information will be
	//printed according to the itinerary
	//otherwise, that is, if not found, appropriate message will be displayed
	while(myRequests >> originCity >> destinationCity)
	{
		cout << "Request is to fly from " << originCity
			<< " to " << destinationCity << "." << endl;
		
		//Check if the airline serves originCity
		if(!map.CheckCity(originCity))
		{
			cout << "Sorry, EastWest airline does not serve "
				<< originCity << "." << endl;
		}
		//Check if the airline serves destinationCity
		else if(!map.CheckCity(destinationCity))
		{
			cout << "Sorry, EastWest airline does not serve "
				<< destinationCity << "." << endl;
		}
		else	//airline serves both origin and destination city
		{
			//ocNum holds the city number of origin city
			ocNum = map.GetCityNumber(originCity);
			//dcNum holds the city number of destination city
			dcNum = map.GetCityNumber(destinationCity);
		
			map.FindPath(ocNum, dcNum);
			cout << endl;
		}
	}
	
	return 0;
}
