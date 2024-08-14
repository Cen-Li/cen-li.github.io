#include "flightMap.h"

#include <cstddef>	//NULL
#include <cassert>	//assert()
#include <iomanip>
using namespace std;

//Default constructor
flightMap::flightMap()
{
	citNum = 0;
	Cities = new string[citNum];
}

//Copy constructor
flightMap::flightMap(const flightMap& rhs)
{
	citNum = rhs.citNum;
	
	//Copy all of the cities
	for(int i = 0; i < citNum; i++)
		Cities[i] = rhs.Cities[i];
		
	bool success;
	int tsize;	//hold the size of the DLL
	//Copy all of the lists
	for(int j = 0; j < citNum; j++)
	{
		tsize = rhs.Fmap[j].getLength();
		//deep copy the DLL
		for(int q = 0; q < tsize; q++)
			Fmap[j].ListInsert(rhs.Fmap[j][q], success);
	}
}

//Destructor
flightMap::~flightMap()
{	
	//Delete all information
	delete [] Cities;
	
	delete [] Fmap;

	citNum = 0;
}

//Read cities and flightmap
//Pre-Condition:CitiesIn and FlightsIn
//Post-Condition: Cities[] and Fmap[] and citNum
void flightMap::ReadCities(ifstream& CitiesIn, ifstream& FlightsIn)
{		
	CitiesIn >> citNum;
	//cout << "CitNum: " << citNum << endl;
	
	//Dynamically allocate memory
	Cities = new string[citNum];
	Fmap = new sortedListClass[citNum];
	
	//Read in all the cities
	int count = 0;
	while(CitiesIn >>Cities[count])
		count++;
	
	//BUBBLE SORT THE CITIES
	int i, j;
	string temp;             // holding variable
	int numLength = citNum; 
	//Traverse the entire array
	for(i = 1; (i <= numLength); i++)
	{
		for (j=0; j < (numLength -1); j++)
		{
			//If the current city greater than the next city name
			if (Cities[j+1] < Cities[j])
			{
				// swap elements
				temp = Cities[j];
				Cities[j] = Cities[j+1];
				Cities[j+1] = temp;
			}
		}
	}
	
	bool success;
	listItemType tempInfo;
	//Look through the entire cities array
	for(int index= 0; index < citNum; index++)
	{
		FlightsIn.close();	//Close the file
		FlightsIn.open("flights.dat");	//Reopen the file to traverse again
		assert(FlightsIn);	//Verify success
		
		//While there is still data in the file, read
		while(FlightsIn>>tempInfo.flightNum)
		{
			//Read in parts of flightRec to insert
			FlightsIn >> tempInfo.origCity;
			FlightsIn >> tempInfo.destCity;
			FlightsIn >> tempInfo.cost;
		
			//Insert the new information
			if(tempInfo.origCity == Cities[index])
				Fmap[index].ListInsert(tempInfo ,success);
		}
	}
}

//Display the map in order of origin city and it's destinations
//Pre-Condition:Cities[] and Flights[] and citNum
//Post-Condition:None
void flightMap::DisplayMap()
{
	listItemType tempInfo;	//Holds temporary information
	int tempSize;	//Holds temporary list sizes
	string tempName;
	bool succ;
	
	//Print the table heading
	cout << "     Origin    " << "Destination    "<< "Flight         " << "Price" << endl;
	cout << "==================================================================" << endl;
	
	//Cycle through every city
	for(int i = 0; i < citNum;i++)
	{
		tempSize = Fmap[i].getLength();	//Assign the temporary size
		
		//Traverse the entire list for each city
		for(int j = 0; j < tempSize; j++)
		{
			//Retrieve the info
			tempInfo = Fmap[i][j];
			
			//If the origin city is first used, print it
			if(j == 0)
				cout << left << setw(14) << Cities[i] << ": ";
			else
				cout << setw(16) << " ";
			
			//print the rest of the flight information
			cout << left << setw(16) << tempInfo.destCity
			<< left << setw(15) << tempInfo.flightNum
			<< "$" << tempInfo.cost << endl;;
		}
	}
}
