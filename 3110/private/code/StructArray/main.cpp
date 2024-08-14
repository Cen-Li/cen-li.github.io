/*   Programmer:  Cen Li
Description: This program is written to review a number of concepts:

*  documentation requirements in program
*  input : getline, ignore, peek
*  array of struct
*  1D, 2D and parallel arrays
*  file operations
*  sorting in 1D array 
*/

#include <cassert>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <string>
using namespace std;

#include "type.h"

// global constants
const int MAX_MOVIES = 100;  // maximum number of movies
const int MAX_THEATERS = 10; // maximum number of theaters

// function prototype declarations
int ReadMovies(ifstream &movieFile, MovieType movies[]);
int ReadTheaters(ifstream &theaterFile, TheaterType theaters[]);
void ReadShowings(ifstream &showingFile, int showings[][MAX_MOVIES], int, int);
void DisplayMovies(MovieType movies[], int);
int LinearSearch(MovieType items[], int numOfItems, string itemToLookfor);
void SortMovies(MovieType movies[], int);

int main() {
  MovieType
      movies[MAX_MOVIES]; // store a list of movie records currently showing
  TheaterType theaters[MAX_THEATERS];     // store a list of theaters records
  int showings[MAX_THEATERS][MAX_MOVIES]; // stores the list of movies showing
                                          // at each of a list of theaters
  int numOfMovies;   // actual number of movies currently showing
  int numOfTheaters; // acutal number of theaters

  string movieTitle; // title of the movie of interest

  ifstream movieFile;   // movie file input stream
  ifstream theaterFile; // theater file input stream
  ifstream showingFile; // movie showings file input stream

  int i, j;       // array index
  int movieIndex; // array index corresponing to "movieTitle"

  // initialize all elements of showings array to -1.
  for (i = 0; i < MAX_THEATERS; i++) {
    for (j = 0; j < MAX_MOVIES; j++)
      showings[i][j] = -1;
  }

  // open data files and read information on all current movies, all available
  // theaters, and current showings at each theater.
  movieFile.open("movies.dat");
  assert(movieFile);

  theaterFile.open("theaters.dat");
  assert(theaterFile);

  showingFile.open("showings.dat");
  assert(showingFile);

  // read info from all the data file
  numOfMovies = ReadMovies(movieFile, movies);
  numOfTheaters = ReadTheaters(theaterFile, theaters);
  ReadShowings(showingFile, showings, numOfTheaters, numOfMovies);

  // sort and display all movies in alphabetical order
  // Example on functions
  SortMovies(movies, numOfMovies);
  DisplayMovies(movies, numOfMovies);

  // Display info on all theaters that are currently showing the movie of
  // interest
  cout << endl << "Which movie do you want to watch?" << endl;
  getline(cin, movieTitle);

  // look to see if the movie is in the list, if so, movieIndex has its index in
  // the list, if not, movieIndex has value -1
  movieIndex = LinearSearch(movies, numOfMovies, movieTitle);

  // display error message if the movie is not in the array
  if (movieIndex < 0)
    cout << "This movie does not exist." << endl;
  else {
    cout << endl
         << movieTitle
         << " is currently showing at the following theaters:" << endl
         << endl;

    // find all theaters currently showing the movie of interest in 2D array
    // "showings" For each theater that is currently showing the movie, display
    // its name and phone number
    for (i = 0; i < numOfTheaters; i++) {
      for (j = 0; showings[i][j] >= 0; j++) {
        // theater i is showing the movie, display its info
        if (showings[i][j] == movieIndex) {
          cout << left << setw(30) << theaters[i].name;
          cout << theaters[i].phone << endl;

          break; // each movie occurs at most once in each row
        }
      }
    }
  }

  // close data files
  movieFile.close();
  theaterFile.close();
  showingFile.close();

  return 0;
}

// description: read movies information from file
// pre-condition: moviesFile is ready for read
// post-condition: movies array is filled with movie records
//                 numOfMovies represents the actual number of movies read and
//                 is sent back to the calling function
int ReadMovies(ifstream &movieFile, MovieType movies[]) {
  int index = 0;  // need to initialize the array index 
  int numOfMovies = 0;  

  // read movie record information line by line
  // assuming each movie record contains 3 fields, one field per line
  while (index < MAX_MOVIES && getline(movieFile, movies[index].title)) {
    getline(movieFile, movies[index].genre);  // getline is only used for reading string type data

    movieFile >> movies[index].runningTime;
    movieFile.ignore(100, '\n');

    index++;
  }
  numOfMovies = index;

  return numOfMovies;
}

// description: read information about movie theaters
// pre-condition: theaterFile is ready for read
// post-condition: theaters array is filled with movie information
//                 numOfTheaters represents the actual number of movie records
//                 read. It is sent back to the calling function.
int ReadTheaters(ifstream &theaterFile, TheaterType theaters[]) {
  int index = 0;
  int numOfTheaters = 0;

  // read theater information line by line
  // assuming each theater record containing 3 fields, one line per field
  while (theaterFile && index < MAX_THEATERS) {  // illustrating another way of constructing while condition for input from file
    getline(theaterFile, theaters[index].name);
    getline(theaterFile, theaters[index].phone);
    getline(theaterFile, theaters[index].type);

    index++;
  }
  numOfTheaters = index;

  return numOfTheaters;
}

// description: Read movie showings information from a data file
// pre-condition: the data file is ready for read
//               showings array is initialized with -1
//               numOfTheaters and numOfMovies represent the actual number of
//               theaters
//                and movies for the current program.
//                They can be used to check for the data input process
// post-condition: the showings array is filled with movie index values
// corresponding
//                 to the index of the movies appearing in array "movies"
void ReadShowings(ifstream &showingFile, int showings[][MAX_MOVIES],
                  int numOfTheaters, int numOfMovies) {
  int row = 0;
  int col = 0;

  // read movie showings for each theater line by line
  while (showingFile.peek() != EOF && row < numOfTheaters) {
    col = 0;
    while (col < numOfMovies && showingFile.peek() != '\n') {
      showingFile >> showings[row][col];
      col++;
    }
    // !!
    showingFile.ignore(100, '\n');
    row++;
  }

  return;
}

// Description: This function searches for a movie from a list
//              If the movie is found, the index of the item in the list is
//              returned otherwise, -1 is returned
// pre-condition: a number of movies have been stored in the "items" array,
//                numOfItems holds the actual
//                number of items in the array
// post-condition: the index of the item
int LinearSearch(MovieType items[], int numOfItems, string itemToLookfor) {
  int index;

  // find the movie of interest in array "items"
  for (index = 0; index < numOfItems; index++) {
    if (itemToLookfor == items[index].title) {
      return index;
    }
  }

  return -1;
}

// description: bubble sort on a list of movies in ascending
//               order based on the title of the movie
// pre-condition: movies array is filled with movie records
//			      numOfMovies represents the actual number of records in
//"movies"
// post-condition: the records in "movies" are sorted in ascending order based
//                  on movie title
void SortMovies(MovieType movies[], int numOfMovies) {
  bool sorted =
      false; // indicates whether additional comparison passes are needed
  int last = numOfMovies - 1; // the index of the last item in the remaining part of the array

  MovieType tmp;

  while (!sorted) {
    // assuming the remaining array is sorted.
    sorted = true;
    for (int i = 0; i < last; i++) {
      if (movies[i].title > movies[i + 1].title) {
        // swap the two records
        tmp = movies[i];
        movies[i] = movies[i + 1];
        movies[i + 1] = tmp;

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
//                numOfMovies represents the actual number of records in
//                "movies"
// post-condition: the movie records are displayed in formatted form

void DisplayMovies(MovieType movies[], int numOfMovies) {
  cout << endl << "The list of movies currently showing are:" << endl << endl;
  cout << left << setw(40) << "Title" << setw(12) << "Running Time" << setw(10)
       << "Genre" << endl;
  for (int i = 0; i < numOfMovies; i++)
    cout << left << setw(40) << movies[i].title << setw(12)
         << movies[i].runningTime << setw(10) << movies[i].genre << endl;

  return;
}
