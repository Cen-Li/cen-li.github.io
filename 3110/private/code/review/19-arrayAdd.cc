/*
 Description: This example illustrates
    1. array insertion 
    2. deletion operations
    3. how to build a sorted array without using the sorting function
	   In this case, items will be inserted into the array one by one maintaining the sorted order
    ** C++ type string is used here

 Fixed the bug in array insertion function
 */

#include <iostream>
#include <fstream>
#include <cassert>
#include <cstdlib>
#include <cstring>
using namespace std;

// function prototypes
void PrintList(string list[], int number);
void AddAtLocation(string list[], int &number, string toAdd, int location);

// global constants
const int MAX_MOVIES=25;   // maximum number of movies to read

int main()
{
    string 		listOfMovies[MAX_MOVIES]; // record the titles of the list of movies read
							// Used a 2D array of Char to illustrate C type string usage
	int        	numberOfMovies;   // number of movies read
	ifstream   	movieFile;    // input file stream for "movies.dat"
	string		title;			// a new movie title
	int			location;		// location of the movie in the list
	
	// opens the movies data file
    movieFile.open("movies.dat");
    assert(movieFile);  // make sure the file is opened correctly
		
	// This loop reads in the list of movie titles.
	// It also counts the number of movie titles read and stores the count in "numberOfMovies"
	numberOfMovies=0;
    while(movieFile.peek() != EOF)
    {
        getline(movieFile, listOfMovies[numberOfMovies]);
		numberOfMovies++;
	}
		
	// debugging statements to check the above file input is done correctly
    PrintList(listOfMovies, numberOfMovies);
 
    cout << endl << "Enter the name of a new movie: ";
    getline(cin, title);
    cout << endl << "Enter the location to insert this movie: ";
    cin >> location; 
    
	// add the movie at specified location
    AddAtLocation(listOfMovies, numberOfMovies, title, location);

    cout << "After insertion" << endl;
    PrintList(listOfMovies, numberOfMovies);

	movieFile.close();
	return 0;
}

// display the list of movies read
void PrintList(string list[], int number)
{
	int i;

	cout << "Number of Movies read: " << number << endl;
	cout << "=======================" << endl;
	for (i=0; i<number; i++)
		cout << list[i] << endl;
}

// insert an item at a specified location in the array
void AddAtLocation(string list[], int &number, string toAdd, int location)
{
	int i;
	// check the location is in the valid index range
    if ((location>=0 && location <= number))
    {    
	    for (i=number; i>location; i--)
        {
			list[i] = list[i-1];
        }
		list[i] = toAdd;
    }
    else
    {
        cerr << "The location is out of boundary" << endl;
        cerr << "new item can not be added" << endl;
    }

    number = number+1;
}

