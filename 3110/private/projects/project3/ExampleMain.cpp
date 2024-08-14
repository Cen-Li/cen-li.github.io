#include <list>
#include <string>
#include <iostream>
#include <fstream>
#include <cassert>
#include <iomanip>
using namespace std;

#include "type.h"

void BuildFlightList(ifstream& myIn, list<flightRec>& list);
void Display(list<flightRec>& flightList);
void Delete3Times(list<flightRec>& flightList);
void SearchFlight(list<flightRec>& flightList);

int main()
{
	list<flightRec> flightList;			//sortedListClass object
	ifstream myIn;					//for reading a data file
	flightRec temp;					//temporary flightRec

	myIn.open("flights.dat");			//open data file
	assert(myIn);					//check if the data file is available
	
	BuildFlightList(myIn, flightList);		//Function call for reading a data file
	
	flightList.sort(); 				// overloaded < operator for flightRec type

	Display(flightList);

	SearchFlight(flightList);

	Delete3Times(flightList);
		
	Display(flightList);

	return 0;
}

//This function reads in flight records from a file
//and inserts flight records in the list in ascending order
void BuildFlightList(ifstream& myIn, list<flightRec>& aList)
{
	int flightNum, price;		//holds the flightNum and price from a data file
	string origin, destination;	//holds the cities info from a data file
	flightRec temp;				//holds the data temporarily
	
	//Reading info from a data file
	while(myIn >> flightNum >> origin >> destination >> price)
	{
		temp.flightNum = flightNum;
		temp.origin = origin;
		temp.destination = destination;
		temp.price = price;

		//insert data into a list in ascending order
		aList.push_back(temp);

	 	//myIn.ignore(100, '\n');
  	}
}

// This function displays all the flights in a table format
void Display(list<flightRec>& flightList)
{
	//Print the entire list by using overloaded output operator for class
	cout << setw(15) << "Origin" << setw(15) << "Destination"
		<< setw(10) << "Flight#" << setw(7) << "Price" << endl;
	
	cout << "================================================" << endl;
	list<flightRec>::iterator i;
	for (i=flightList.begin(); i!=flightList.end(); i++)  {
    	cout << *i << endl; // *i is of flightRec type, overloaded << operator
  }
}

// This function prompts the user for the origin and destination info
// of a flight. It searches through the flight list for this flight.
// If found, detailed information from "origin" to "dest" flight is displayed
void SearchFlight(list<flightRec>& flightList)
{
	string origin, dest;
	flightRec temp;
	list<flightRec>::iterator i;
	bool firstOne=true;
	bool found=false;
  
  	//Get origin and destination cities info from user
	cout << "Please enter the origin city you want to get information: ";
	cin >> origin;
	cout << "Please enter the destination city you want to get information: ";
	cin >> dest;
	cout << endl;
	
	temp.origin = origin;
	temp.destination = dest;
	
	//Function call to find the record that matches with the info
	//provided by user
  	found = false;
	for (i=flightList.begin(); i!=flightList.end(); i++)  {
    	   if (*i == temp) {  // == operator overloaded
      		found=true;
      		if (firstOne)   {
        		cout << setw(15) << "Origin" << setw(15) << "Destination"
			<< setw(10) << "Flight#" << setw(7) << "Price" << endl;
        		firstOne=false;
      		}
      		cout << *i;   // << operator overloaded
    	   }
  	}
  
	//If found, display the found record
	if(!found)
		cout << "No flight available." << endl;	
}

// This function perform 3 deletion operations
// The updated list is sent back
void Delete3Times(list<flightRec>& flightList)
{
  	int count=0;
  	list<flightRec>::iterator i;
  	bool found;
  	string origin, dest;

  	//while loop to perform 3 deletions
	while(count<3)
	{
		//Get info from user
		cout << endl;
		cout << "Please enter the origin city you want to delete: ";
		cin >> origin;
		cout << "Please enter the destination city you want to delete: ";
		cin >> dest;
	
		temp.origin = origin;
		temp.destination = dest;
	
		//Function call to perform deletion
		//with the info provided by user
    		found = false;
		for (i=flightList.begin(); i!=flightList.end(); i++)  {
      		   if (*i == temp) {  // == operator overloaded
        		i = true;
        		break;   // break out of the loop
      		   }
    		}
    
		if (found)
			flightList.erase(i);  
		else
			cout << "item not found, Deletion failed." << endl;
		
		count++;	//loop count is increased by one
	}
}
