
#include "flightMap.h"
#include <iostream>
#include <fstream>
#include <cstddef>
#include <cassert>
#include <iomanip>
using namespace std;

FlightMapClass::FlightMapClass()
{
	size = 0;
	cities = NULL;
	visited = NULL;
	map = NULL;
}

FlightMapClass::FlightMapClass(const FlightMapClass& f)
{
	int i;				//loop index
	
	//copy the size
	size = f.size;
	
	//dynamic allocation for 1D array
	cities = new string [size];
	assert(cities != NULL);
	
	//copy the cities
	for(i=0; i<size; i++)
		cities[i] = f.cities[i];
	
	//dynamic allocation for 1D array
	visited = new bool [size];
	assert(visited != NULL);
	
	//copy the visited array
	for(i=0; i<size; i++)
		visited[i] = f.visited[i];
	
	//dynamic allocation
	map = new SortedListClass[size];
	
	//copy the map using overloaded = operator for SortedListClass
	for(i=0; i<size; i++)
		map[i] = f.map[i];
}

FlightMapClass::~FlightMapClass()
{		
	delete [] cities;
	delete [] map;
}

void FlightMapClass::ReadCities(ifstream& myCities)
{	
	string tempCity;		//holds the city name temporarily
	int i,j,k;				//loop index
	
	myCities >> size; 
	
	cities = new string [size];
	visited = new bool [size];
	
	for(i=0; i<size; i++)
	{
		myCities >> tempCity;
		
		//if the list is empty, put tempCity into
		//the first element of the array
		if(i == 0)
			cities[i] = tempCity;

		else
		{
			//finding location
			//i is the current size of the array
			for(j=0; j<i; j++)
			{
				if(tempCity < cities[j])
				{
					//if the location has been found,
					//shift every elements after the locaton by one
					//i is the current size of the array
					for(k=i; k>=j; k--)
						cities[k] = cities[k-1];
					break;
				}
			}
			//put tempCity into the found position
			cities[j] = tempCity;
		}
		
		visited[i] = false;
	}
}

void FlightMapClass::BuildMap(ifstream& myFlights)
{
	int flightNum, price;		//holds the flightNum and price from a data file
	string origin, destination;	//holds the cities info from a data file
	flightRec temp;				//holds the data temporarily
	bool success;				//whether the insertion is successful or not
	
	map = new SortedListClass[size];
	
	//Reading info from a data file
	while(myFlights >> flightNum >> origin >> destination >> price)
	{
		temp.flightNum = flightNum;
		temp.price = price;
		temp.dcNum = GetCityNumber(destination);
		
		//This for loop traverse the cities list
		//and look for the city that matches with the current
		//record's origin city
		for(int i=0; i<size; i++)
		{
			//if found the city that matches,
			if(origin == cities[i])
			{
				//then insert the current record 
				//and link it with the current city
				map[i].Insert(temp, success);
				
				//if the insertion fails, display appropriate message
				if(!success)
				{
				cout << "Flight #" << flightNum 
					<< " insert operation failed." << endl;
				}
			}
		}
	}
}

void FlightMapClass::DisplayMap() const
{
	SortedListClass currList;		//holds the current city's list
	flightRec currFlight;			//holds the current flight info
	
	//Display the heading
	cout << setw(19) << "Origin" << setw(21) << "Destination"
		<< setw(8) << "Flight" << setw(7) << "Price" << endl;
	cout << "========================================================" << endl;
	
	//This for loop is used to display the entire flight map
	for(int i=0; i<size; i++)
	{
		//if the origin city has no flight at all,
		//then skip the city
		if(map[i].GetLength() == 0)
			continue;
		else
		{
		
			//Display origin city
			cout << " From " << setw(13) << cities[i] << " to:";
			
			currList = map[i];
			
			for(int j=0; j<currList.GetLength(); j++)
			{
				//currFlight is the current record in the list
				currFlight = currList[j];
				
				//Using different method to display in a tabular format
				if(j==0)
				{
					cout << setw(17) << GetCityName(currFlight.dcNum)
						<< setw(8) << currFlight.flightNum
						<< setw(4) << "$" << setw(3) << currFlight.price
						<< endl;
				}
				else
				{
					cout << setw(40) << GetCityName(currFlight.dcNum)
						<< setw(8) << currFlight.flightNum
						<< setw(4) << "$" << setw(3) << currFlight.price
						<< endl;
				}
			}
		}
	}
}

bool FlightMapClass::CheckCity(string cityName) const
{
	bool found = false;
	
	for(int i=0; i<size; i++)
	{
		if(cityName == cities[i])
			found = true;
	}
	
	return found;
}
		
void FlightMapClass::DisplayAllCities() const
{
	//This for loop prints every cities in cities array
	for(int i=0; i<size; i++)
		cout << cities[i] << endl;
}

void FlightMapClass::MarkVisited(int city)
{
	visited[city] = true;
}

void FlightMapClass::UnvisitAll()
{
	//This for loop changes all of the boolean values
	//to false in visited array
	for(int i=0; i<size; i++)
		visited[i] = false;
}

bool FlightMapClass::IsVisited(int city) const
{
	return visited[city];
}

bool FlightMapClass::GetNextCity(int fromCity, int & nextCity)
{
	SortedListClass currList;	//holds the current city's adj. list
	flightRec currFlight;		//holds the current flight info
	int cityNum;				//holds the destination city number to check
	bool success = false;
	
	//currList holds the adj. list of fromCity
	currList = map[fromCity];
	
	//This for loop searches the unvisited adjacent city
	for(int i=0; i<currList.GetLength(); i++)
	{
		//currFlight holds the ith flight info in currList
		currFlight = currList[i];
		
		//cityNum holds the currFlight's destination city number
		cityNum = currFlight.dcNum;
		
		//Check if the adjacent city is visited
		//if not visited, success is true and get out of the loop
		if(!visited[cityNum])
		{
			success = true;
			break;
		}
	}
	
	//if the unvisted adjacent city has been found,
	//return nextCity setted to found city number by reference
	if(success)
		nextCity = cityNum;
	
	return success;
}

int FlightMapClass::GetCityNumber(string cityName) const
{
	int i;					//loop index
	
	//This for loop searches the corresponding cityName
	for(i=0; i<size; i++)
	{
		if(cities[i] == cityName)
			break;
	}
	
	//return the corresponding number
	return i;
}

string FlightMapClass::GetCityName(int cityNumber) const
{
	//return the actual name of the cityNumber
	return cities[cityNumber];
}

void FlightMapClass::FindPath(int originCity, int destinationCity)
{
	StackClass aStack;			//Stack to hold itinerary
	StackClass auxStack;		//used to store the itinerary in reverse order
	int topCity, nextCity;		//holds the city numbers
	int ocNum;					//holds the origin city's number in currFlight
	int temp;
	bool success;
	int total=0;				//holds the total price
	
	UnvisitAll(); 			//clear marks on all cities
	
	//push origin city onto aStack, mark it visited
	aStack.Push(originCity);
	MarkVisited(originCity);
	
	//Get the origin city
	aStack.GetTop(topCity);
	
	//Loop invariant: the stack contains a directed path
	//from the origin city at the bottom of the stack to the city
	//at the top of the stack
	//find and unvisited city adjacent to the city on the top of the stack
	while(!aStack.IsEmpty() && (topCity != destinationCity))
	{
		success = GetNextCity(topCity, nextCity);
		
		if(!success)
			aStack.Pop(); //no city found, backtrack
		
		else	//visit city
		{
			aStack.Push(nextCity);
			MarkVisited(nextCity);
		}
		
		aStack.GetTop(topCity);
	}
	
	if(aStack.IsEmpty())
	{	//no path exists
		cout << "Sorry, EastWest airline does not fly from "
			<< GetCityName(originCity) << " to "
			<< GetCityName(destinationCity) << "." << endl;
	}
	else
	{
		SortedListClass currList;	//holds the current city's adj. list
		flightRec currFlight;		//holds the current flight info
		
		//Print the heading
		cout << "EastWest airline serves between these two cities. " << endl;
		cout << "The flight itinerary is:" << endl;
		cout << "Flight #" << setw(15) << "From"
			<< setw(15) << "To" << setw(7) << "Cost" << endl;
		
		cout << "---------------------------------------------" << endl;
		
		//Put itinerary in reverse order
		while(!aStack.IsEmpty())
		{
			aStack.Pop(temp);
			auxStack.Push(temp);
		}
		
		//Get the origin city
		auxStack.Pop(temp);
		ocNum = temp;
		while(!auxStack.IsEmpty())
		{
			//currList changes through a while loop
			//as the temp(city) changes
			currList = map[temp];
			
			//Pull the next destination city's number
			auxStack.Pop(temp);
			for(int i=0; i<currList.GetLength(); i++)
			{
				//currFlight holds the ith flight of currList
				currFlight = currList[i];
				
				//if the ith currFlight's destination city number
				//matches with the next destination city's number
				//print the flight info
				if(currFlight.dcNum == temp)
				{
					cout << setw(8) << currFlight.flightNum
						<< setw(15) << GetCityName(ocNum)
						<< setw(15) << GetCityName(currFlight.dcNum)
						<< setw(3) << "$" <<  setw(4) << currFlight.price
						<< endl;
					
					//Calculate the total price
					total = total+currFlight.price;
					
					//Set the origin city's number to
					//current destination city's number
					ocNum = currFlight.dcNum;
					break;
				}
			}
		}
		
		//Print the total
		cout << "---------------------------------------------" << endl;
		cout << setw(38) << "Total:"
			<< setw(3) << "$" <<  setw(4) << total << endl;
	}
}
