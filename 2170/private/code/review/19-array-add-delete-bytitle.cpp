/*
 Description: This example illustrates
    1. array insertion 
    2. deletion operations
    3. how to build a sorted array without using the sorting function
	   In this case, items will be inserted into the array one by one maintaining the sorted order
    ** C++ type string is used here
 
 ** Array Addition and Deletion without specifying location
 ** build sorted array with incremental array addition
*/

#include <iostream>
#include <fstream>
#include <cassert>
#include <cstdlib>
#include <cstring>
using namespace std;

// function prototypes
void PrintList(string list[], int number);
void Add(string list[], int &number, string title);
void Delete(string list[], int &number, string title);

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
        getline(movieFile, title);
        Add(listOfMovies, numberOfMovies, title);
	}
		
	// debugging statements to check the above file input is done correctly
    PrintList(listOfMovies, numberOfMovies);
 
    cout << endl << "Enter the name of a new movie: ";
	getline(cin, title);

    Add(listOfMovies, numberOfMovies, title);

    cout << "After addition" << endl;
    PrintList(listOfMovies, numberOfMovies);

    // get user input on which movie to delete
    cout << endl << "Which movie to delete? ";
    getline(cin, title); 
    
	// add the movie at specified location
    Delete(listOfMovies, numberOfMovies, title);

    cout << "After deletion" << endl;
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
		cout << i << ":" << list[i] << endl;
}

// insert an item into the array, maintaining the ascending order in the array
void Add(string list[], int &number, string title)
{
	int i;

    // compare array items with the new "title" from bottom up 
    // shift items as one moves up the array, 
    // add the new "title" once the correction position is located
	for (i=number-1; (i>=0&&(title<list[i])); i--)
 	{
	   	list[i+1] = list[i];
   	}
    list[i+1] = title;

    number = number+1;
}

// deletean item from the array, maintaining the ascending order in the array
void Delete(string list[], int &number, string title)
{
  	int location; // location index of the title to be removed
	int i;  // array index

	// find where the match is located
    for (i=0; i<number; i++)
 	{
		if (title == list[i])
			break;
    }

	location = i;

	// if a match is found in the list, delete it
	if (location < number)
    {
		// shift all the items from location to number-1 up one position
		for (i=location ;i<number-1; i++)
			list[i] = list[i+1];
    	
		number = number-1;
	}
	else  // if no match is found, send error message
    { 
		cerr << "There is no " << title << " in the list." << endl;
		cerr << "Deletion can not be done." << endl;
	}
}
