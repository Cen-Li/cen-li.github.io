// File: songs.cc 

#include <iostream> // Header file for input/output
#include <fstream> 
#include <string>
#include <cassert>
#include <iomanip>
using namespace std;

const int MAX_SONGS = 500; // Maximum number of songs to be stored

struct SongType 
{
    string title;
    string artist;
    int    year;
    int    rank;
    bool operator > (SongType& rhs);
};

bool SongType::operator > (SongType & rhs)
{
    if (artist> rhs.artist)
        return true;
    else
       return false;
}


// declare all the functions here
void ReadSongs(ifstream& infile, SongType songs[], int &number);
void DisplaySongs(SongType songs[], const int number);
void SortSongs(SongType songs[], int number);
void Swap(SongType & b1, SongType & b2);
void ListSongsByYear(SongType songs[], int number, int year);
void ListSongsByArtist(SongType songs[], int number, string name);

int main()
{
    int numberSongs;
    SongType songs[MAX_SONGS];
    ifstream myIn;
    myIn.open("topsongs.dat");
    assert(myIn);
    string thisAuthor;
    int year;
    string name;

    ReadSongs(myIn, songs, numberSongs);

    SortSongs(songs, numberSongs);

//    DisplaySongs(songs, numberSongs);

/*
    cout << "enter year: ";
    cin >> year;

    ListSongsByYear(songs, numberSongs, year);
*/

    cout << "enter artist: ";
    cin >> name;
    ListSongsByArtist(songs, numberSongs, name);

    myIn.close();
    return 0;
}

void ReadSongs(ifstream& infile, SongType songs[], int &number)
{
   number = 0;
   // read book by book til the end of the data file
   while (infile.peek() != EOF && number < MAX_SONGS) {
		infile >> songs[number].rank;
        infile.ignore(100, '\n');
        getline(infile, songs[number].artist);
        getline(infile, songs[number].title);
		infile >> songs[number].year;

    	number ++;
   }
}

void DisplaySongs(SongType songs[], const int number)
{
    for (int i=0; i<number; i++) {
	    cout << songs[i].title << '\t' << songs[i].artist<< '\t' << songs[i].year << endl;
    }

    cout << endl;
}

void SortSongs(SongType songs[], int number)
{
    bool sorted=false;    // indicates whether additional comparison passes are needed
    int  last=number-1; // the index of the last item in the remaining part of the array

    SongType tmp;

    while (!sorted) {

        // assuming the remaining array is sorted.
        sorted=true;
        for (int i=0; i<last; i++) {

            if (songs[i] > songs[i+1]) {

        	    Swap(songs[i], songs[i+1]);

                // the remaining array is not sorted, need at least another pass
                // of pairwise comparison
                sorted = false;
            }

        }

        // one less item to sort for the next round
        last--;
    }

    return;
}

void Swap(SongType & b1, SongType & b2)
{
    SongType tmp;
    
    tmp = b1;
    b1 = b2;
    b2 = tmp;
}

void ListSongsByArtist(SongType songs[], int number, string name)
{
    cout << left;
    // Go through all the books one by one
    cout << endl << endl << "Here are the songs by " << name << endl;

    cout << setw(30) << "Title" << setw(8) << "Rank" << setw(8) << "Year" << endl;
    for (int i=0; i<number; i++) {
        if (name == songs[i].artist) 
	        cout << setw(30) << songs[i].title<< setw(8) << songs[i].rank << setw(8) << songs[i].year<< endl;
    }
}


void ListSongsByYear(SongType songs[], int number, int year)
{
    // Go through all the books one by one
    cout << endl << endl << "Here are the songs in " << year<< endl;

    for (int i=0; i<number; i++) {
        if (year == songs[i].year) 
	        cout << songs[i].title << "\t" << songs[i].artist << endl;
    }
}
