/*
 File : 21-array-add.cc
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
    string 	listOfMovies[MAX_MOVIES]; // record the titles of the list of movies read
				// Used a 2D array of Char to illustrate C type string usage
    int        	numberOfMovies;   // number of movies read
    ifstream   	movieFile;    // input file stream for "movies.dat"
    string	title;			// a new movie title
    int		location;		// location of the movie in the list
	
	// opens the movies data file
    movieFile.open("movies.dat");
    assert(movieFile);  // make sure the file is opened correctly
		
    // This loop reads in the list of movie titles.
    // It also counts the number of movie titles read and stores the count in "numberOfMovies"
    numberOfMovies=0;
    while(movieFile.peek() != EOF) {
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
    AddAtLocation(listOfMovies, numberOfMovies, title, location-1);

    cout << endl << endl;
    cout << "After the insertion" << endl;
    PrintList(listOfMovies, numberOfMovies);

    movieFile.close();

    return 0;
}

// display the list of movies read
// list (IN): a list of movie titles 
// number (IN): the number of movies in the list
void PrintList(string list[], int number)
{
    int i;

    cout << "Number of Movies: " << number << endl;
    cout << "=====================" << endl;
    for (i=0; i<number; i++)
	    cout << i+1 << ": " <<  list[i] << endl;
}

// insert an item at a specified location in the array
// list (IN/OUT) : the list of movies is updated by adding a new movie at location "location"
// number (IN/OUT): the number is increased by 1 after a successful insertion. If the location of insertion is not valid, no value is inserted, number remains the same as before
// toAdd (IN): the new movie title to be added in the list
// location (IN): The location in the list where the new movie title is to be inserted
void AddAtLocation(string list[], int &number, string toAdd, int location)
{
    int i;

    // check the location is in the valid index range
    if ((location>=0 && location <= number)) {    
        // shift all the values to accomodate the new item
        for (i=number; i>location; i--) {
	        list[i] = list[i-1];
        }
        // add the new item
	    list[i] = toAdd;
        number = number+1;
    }
    else
    {
        cerr << "The location is out of boundary" << endl;
        cerr << "new item can not be added" << endl;
    }
}

