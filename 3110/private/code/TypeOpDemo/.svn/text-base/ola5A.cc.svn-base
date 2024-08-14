//// Programmer:		Scott Welsh
// Assignment:			OLA5/Flight Map
// Class:				CSCI 2170-003
// Course Instructor:	Dr. Cen Li
// Due Date:			3/30/2011
// Description: Throughly test the sortedListClass to 
// make sure that all methods work correctly.


// Includes
#include <fstream>
#include "sortedListClass.h"

// Define for debugging messages
#define _DEBUG_
// Namespace
using namespace std;

// Constants
char FLIGHTS_DAT[] = "flights.dat";		// File containing

// Prototypes
void ReadFlights(ifstream & inFile, sortedListClass & fList);

// Entry Point
int main()
{
	// Variables
	sortedListClass fList;		// List to store flight data
	ifstream inFile;			// Input file stream for file reading
	FlightRec tRec;				// Temp record for search and delete
		
	// Open flights data file
	inFile.open(FLIGHTS_DAT);
	
	// Read flights into list
	ReadFlights(inFile, fList);
	
	// Close flights data file
	inFile.close();
	
	cout << "Testing List output" << endl;
	cout << "Flight #              Origin         Destination     Price" << endl;
	cout << "==========================================================" << endl;
	// Print flights data list
	cout << fList;
	
	// TODO
	// Search for a record
	cout << "Testing record search" << endl;
	cout << "Type Origin city: ";
	cin >> tRec.origin;
	cout << "Type Destintation city: ";
	cin >> tRec.dest;
	
	// Try to get match
	if(fList.Get(tRec))
	{
		// Print record
		cout << tRec;
	}
	else
	{
		// Print no match
		cout << "No flight record found." << endl;
	}

	cout << "Testing delete" << endl;
	// Delete three records
	for(int i = 0; i < 3; i++)
	{
		// Prompt and read flight info
		cout << "Type Origin city: ";
		cin >> tRec.origin;
		cout << "Type Destintation city: ";
		cin >> tRec.dest;
		
		// Delete from list
		if(fList.Remove(tRec))
		{
			cout << "Record deleted." << endl;
		}
		else
		{
			cout << "No record to delete." << endl;
		}
	}
	
	// Print final list
	cout << "Final list" << endl;
	cout << "Flight #              Origin         Destination     Price" << endl;
	cout << "==========================================================" << endl;
	cout << fList;
	
	return 0;	// Exit Normally
}

// Name: ReadFlights
// Function: Read flight records from file and insert into list
// Precondition: File stream opened
// Postcondition: Records read into list
void ReadFlights(ifstream & inFile, sortedListClass & fList)
{
	FlightRec fr;			// Flight record for temp storage
	bool result = false;	// Holds result of insertion attempt
	
	// If Input file stream is good for I/O
	if(inFile.good())
	{
		// Loop until EOF reading records
		while(!inFile.eof())
		{
			// Read record and store in tmp variable
			inFile >> fr.fNumber;
			inFile >> fr.origin;
			inFile >> fr.dest;
			inFile >> fr.cost;
			
			// Insert into list
			result = fList.Insert(fr);
			#ifdef _DEBUG_
			cout << "Inserting: " << result << endl;
			#endif
		}
	}
	else
	{
		cout << "ERROR accessing file: " << FLIGHTS_DAT << endl;
	}
	// Done
	return;
}