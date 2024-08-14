// File: 30-linear-search.cc
// This program reviews the following topics:
//    sorting in a 1D array of integer
// This program provides the simplest form of sorting
// Learn the sorting step by hand trace the execution of the program

#include <iostream> // Header file for input/output
#include <fstream> 
#include <cassert>
using namespace std;

const int MAX_SIZE = 100; // Maximum number of books to be stored

// declare all the functions here
void BubbleSort(int data[], int number);
int LinearSearch(int data[], int numOfValues, int toFind);

int main()
{
    int data[MAX_SIZE];
    int count;
    ifstream myIn;
    myIn.open("sort.dat");
    assert(myIn);
    int  toFind;
    int  location;

    // read in the data from data file
    count = 0;
    while (count<MAX_SIZE && myIn >> data[count])  {
        count ++;
    }

    // sort the values
    BubbleSort(data, count);

    // display the original data
    cout << "The numbers are : " << endl;
    for (int i=0; i<count; i++)  {
        cout << i << " : " << data[i] << endl;
    }

    cout << "Which value do you look for:" << endl;
    cin >> toFind;
    location = LinearSearch(data, count, toFind);
 
    cout << endl;
    if (location >=0)  
        cout << "The value is at location: " << location << "." << endl << endl;
    else
        cout << "The value is not in the list." << endl << endl;
 	
    myIn.close();
    return 0;
}


// This function sorts an array of integer values using the bubble sort algorithm
// data (IN/OUT): the unsorted array of values are passed in 
//                and the sorted array of values are returned back
// number (IN): The number of books in the array of struct "library"
void BubbleSort(int data[], int number)
{
    bool sorted=false;    // indicates whether additional comparison passes are needed
    int  last=number-1; // the index of the last item in the remaining part of the array

    int  tmp;

    while (!sorted)
    {
        // assuming the remaining array is sorted.
        sorted=true;
        for (int i=0; i<last; i++)
        {
            if (data[i] > data[i+1])
            {
                // swap the two records
		tmp = data[i];
		data[i] = data[i+1];
		data[i+1] = tmp;			

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

// This function performs linear search for the value "toFind" in an array "data".
// It returns the array subscript of the value if found, otherwise it returns -1
// data (IN): The list of values to search from
// numOfValues (IN): the number of values in the array
// toFind (IN): the value to look for in the array 
int LinearSearch(int data[], int numOfValues, int toFind)
{
    for (int i=0; i<numOfValues; i++)  {
        if (data[i] == toFind)  {
            return i;
        }
    }

    return -1;
}

