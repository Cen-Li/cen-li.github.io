/*   Programmer:  Cen Li
	 Date :       Jan 20, 2011
	 Description: This program is written to illustrate a number of concepts:
	              
1.	documentation requirements in program
2.	input : getline, ignore, peek 
3.	array of struct
4.	1D, 2D and parallel arrays
5.	file operations
6.	sorting of array elements

Here are the example data files:
+++++++++++++++++++++++
   Datafile: allMovies.txt
+++++++++++++++++++++++
King Kong 
PG 13 
195
Harry Potter and the Half Blood Prince
PG 13
145
The American
R
115
Black Swan
R
140
Glory Road
PG
118

++++++++++++++++++++++
   Datafile:  allTheaters.txt
++++++++++++++++++++++
Bell Forge 10
615-333-3456
Carmike
Bellevue Cinema 12
615-646-3111
Regal
Thoroughbred 20
615-778-0770
Carmike
Hollywood 27
615-298-3445
Regal
Opry Mills 20 & IMAX
615-514-3461
Regal
Wynnsong 16
615-893-2253
Carmike


+++++++++++++++++++++++++++++++++
Data file: allShowings.txt
+++++++++++++++++++++++++++++++++
0 2 3 4
1 3
3 4
2 3 4
0 1 4
2 4


*/


#include <iostream>
#include<fstream>
#include <string>
#include <cassert>
#include <iomanip>
using namespace std;

struct MovieType
{
	string  title;
	string  genre;
	int     runningTime;
};

struct TheaterType
{
	string name;
	string phone;
	string type;
};

const int MAX_MOVIES=10;
const int MAX_THEATERS=10;

void ReadMovies(ifstream& movieFile, MovieType movies[], int&numOfMovies);
void ReadTheaters(ifstream&  theaterFile, TheaterType theaters[], int&numOfTheaters);
void ReadShowings(ifstream&  showingFile, int showings[][MAX_MOVIES], int, int);
int FindMovieInDatabase(const MovieType movies[], int numOfMovies, string movieTitle);
void SortMovies(MovieType movies[], int numOfMovies);
void DisplayMovies(const MovieType movies[], int numOfMovies);

int main()
{
	MovieType  movies[MAX_MOVIES];  // store a list of movie records currently showing
	TheaterType theaters[MAX_THEATERS];  // store a list of theater records
	int         showings[MAX_THEATERS][MAX_MOVIES];  
	// stores the list of movies showing at each of a list of theaters
	int        numOfMovies;   //actual number of movies currently showing
	int        numOfTheaters; // actual number of theaters

	string     movieTitle; // title of the movie of interest

	ifstream   movieFile;       // movie file input stream
	ifstream   theaterFile;		// theater file input stream
	ifstream   showingFile;		// movie showings file input stream

	int   i, j; // array index
	int   movieIndex;  // array index corresponding to "movieTitle"

	// initialize all elements of showings array to -1.
	for (i=0; i<MAX_THEATERS; i++)
	{
		for (j=0; j<MAX_MOVIES; j++)
			showings[i][j] = -1;
	}


	// open data files and read information on all current movies, all available theaters, and 
	// current showings at each theater.
	movieFile.open("allMovies.dat");
	assert(movieFile);

	theaterFile.open("allTheaters.dat");
	assert(theaterFile);

	showingFile.open("allShowings.dat");
	assert(showingFile);

	ReadMovies(movieFile, movies, numOfMovies);
	ReadTheaters(theaterFile, theaters, numOfTheaters);
	ReadShowings(showingFile, showings, numOfTheaters, numOfMovies);

	// close data files
	movieFile.close();
	theaterFile.close();
	showingFile.close();

	
    DisplayMovies(movies, numOfMovies);

	// Display info on all theaters that are currently showing the movie of interest
	cout << endl<< "Which movie do you want to watch?"<<endl;
	getline(cin, movieTitle);

	// find the index of the movie of interest in array "movies"
	movieIndex=FindMovieInDatabase(movies, numOfMovies, movieTitle);

	// display error message if the movie is not in the array
	if (movieIndex < 0)
		cout << "This movie is not currently showing." << endl;
	else
	{
		
		cout << endl << "The following theaters currently are showing the movie \""
		<< movieTitle << "\":" << endl << endl;
		
		// find all theaters currently showing the movie of interest in 2D array "showings"
		// For each theater that is currently showing the movie, display its name
		// and phone number
		for (i=0; i<numOfTheaters; i++)
		{
			for (j=0; showings[i][j]>=0; j++)
			{
				// theater i is showing the movie, display its info
               	if (showings[i][j] == movieIndex)
				{
					cout << left << setw(30) << theaters[i].name;
					cout << theaters[i].phone << endl;

					break;
				}
			}
		}
	}

	return 0;
}

// description: read movies information from file
// pre-condition: moviesFile is ready for read
// post-condition: movies array is filled with movie records
//                 numOfMovies represents the actual number of movies read and
//                 is sent back to the calling function
void ReadMovies(ifstream & movieFile, MovieType movies[], int&numOfMovies)
{
	int index=0;

	// read movie record information line by line
	// assuming each movie record contains 3 fields, one field per line
	while  (getline(movieFile, movies[index].title)&&index<MAX_MOVIES)
	{
		 getline(movieFile, movies[index].genre);
		 
		 movieFile >> movies[index].runningTime;
		 movieFile.ignore(100, '\n');
		 
		 index ++;
	}
	numOfMovies = index;
	
	return;
}

// description: read information about movie theaters
// pre-condition: theaterFile is ready for read
// post-condition: theaters array is filled with movie information
//                 numOfTheaters represents the actual number of movie records
//                 read. It is sent back to the calling function.
void ReadTheaters(ifstream & theaterFile, TheaterType theaters[], int&numOfTheaters)
{
	int index=0;
	// read theater information line by line
	// assuming each theater record containing 3 fields, one line per field
	while  (theaterFile&&index <MAX_THEATERS)
	{
		 getline(theaterFile, theaters[index].name);
		 getline(theaterFile, theaters[index].phone);
		 getline(theaterFile, theaters[index].type);
		 
		 index ++;
	}
	numOfTheaters = index;
	
	return;
}

// description: Read movie showings information from a data file
// pre-condition: the data file is ready for read
//               showings array is initialized with -1
//               numOfTheaters and numOfMovies represent the actual number of theaters
//                and movies for the current program. 
//                They can be used to check for the data input process
// post-condition: the showings array is filled with movie index values corresponding 
//                 to the index of the movies appearing in array "movies"
void ReadShowings(ifstream & showingFile, int showings[][MAX_MOVIES], 
				   int numOfTheaters, int numOfMovies)
{
	int row=0;
	int col=0;

	// read movie showings for each theater line by line
	while (showingFile.peek()!=EOF&&row < numOfTheaters)
	{
		col=0;
		while (col<numOfMovies && showingFile.peek() != '\n')
		{
			showingFile>>showings[row][col];
			col++;
		}
		// !!
		showingFile.ignore(100, '\n');
		row++;
	}

	return;
}

// description: Find the index of a movie in an array. If the movies is not in the array, the function
//              returns 0
// pre-condition: The array is filled with movie records, numOfMovies holds the actual number of 
                  movies in the movies array, moviesTitle contains the movie title to look for in the array
// post-condition: The index of the movie record is returned if the movie is found. Otherwise, -1 is returned.
int FindMovieInDatabase(const MovieType movies[], int numOfMovies, string movieTitle)
{
	int index;
	index =-1;
	for (int i=0; i<numOfMovies; i++)
	{
		if (movieTitle == movies[i].title)
		{
			index=i;
			break;
		}
	}

	return index;
} 

// description: bubble sort on a list of movies in ascending 
//               order based on the title of the movie
// pre-condition: movies array is filled with movie records
//			      numOfMovies represents the actual number of records in "movies"
// post-condition: the records in "movies" are sorted in ascending order based
//                  on movie title
void SortMovies(MovieType movies[], int numOfMovies)
{
	bool sorted=false;    // indicates whether additional comparison passes are needed
	int  last=numOfMovies-1; // the index of the last item in the remaining part of the array

	MovieType tmp;

	while (!sorted)
	{
		// assuming the remaining array is sorted.
		sorted=true;
		for (int i=0; i<last; i++)
		{
			if (movies[i].title > movies[i+1].title)
			{
				// swap the two records
				tmp = movies[i];
				movies[i] = movies[i+1]; 
				movies[i+1] = tmp;

				// the remaining array is not sorted, need at least another pass
				// of pairwise comparison
				sorted = false;
			}

		}
		
		last--;
	}

	return;
}

// description: The function displays the list of movies
// pre-condition: the movies array is filled with movie records
//                numOfMovies represents the actual number of records in "movies"
// post-condition: the movie records are displayed in formatted form

void DisplayMovies(const MovieType movies[], int numOfMovies)
{
	cout << endl << "The list of movies currently showing are:" << endl << endl;
	for (int i=0; i<numOfMovies; i++)
		cout << left<< setw(40)<<movies[i].title 
		     << setw(12) << movies[i].runningTime
			 <<movies[i].genre << endl;

	return;
}

