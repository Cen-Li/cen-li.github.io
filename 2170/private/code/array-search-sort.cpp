#include <iostream>
#include <fstream>
#include <string>
#include <cassert>
using namespace std;

const int ARRAY_SIZE = 100;
void PrepDataFile(ifstream & myIn);
int ProcessingData(ifstream &myIn, int &largest, int &smallest, float &ave, int values[]);
void Sort(int values[], int count);
int LinearSearch(const int values[], int count, int number);
void PrintArray(int values[], int count);
void DisplayResults(int largest, int smallest, float ave);

int main()
{
	ifstream myIn;
	int values[ARRAY_SIZE];
	int largest, smallest, count;
	int number;
	int index;
	float average;
	
        // Get the input data file ready for reading
	PrepDataFile(myIn);
	
        // Read data from data file, compute the smallest, largest, and the averaqe value
	count = ProcessingData(myIn, largest, smallest, average, values);
	
        DisplayResults(largest, smallest, average, values);
        // Display the values read
        // Sort the values into ascending order
	Sort(values, count);

	// Display the values after they are sorted
	cout << "The sorted values are: "<< endl;
	for (int i=0; i<count; i++)
		cout << i << " : " << values[i] << endl;
	
	// Prompt for a number
	cout << "Enter a number: " ;
	cin >> number;
	
        // Search for a value in the array
	index = LinearSearch(values, count, number);
        // Display the appropriate message based on the search result
	if (index >= 0)
		cout << "Found the value at location: " << index << endl;
	else
		cout << "Value not found" << endl;
	
	myIn.close();
    
        return 0;
}

// Selection sort : sort the valuse in ascending order
// The array of values and the number of values in the array are passed in the function
// The sorted array of values is sent back 
void Sort(int values[], int count)
{
	int tmp;
	int minIndex;
	
	// count-1 passes 
	for (int i=0; i< count-1; i++)
	{
                // find the index corresponding to the smallest value on the ith pass
		minIndex = i;
		for (int j=i+1; j < count; j++)
		{
			if (values[j] < values[minIndex])
				minIndex = j;
		}
		
                // swap the two values to put the smallest value in the ith location of the array
		if (minIndex != i)
		{
			tmp = values[i];
			values[i]=values[minIndex];
			values[minIndex] = tmp;
		}
	}
}

// Linear Search: search for the value "number" in the array.
// If "number" is found, its location/subscript is returned. 
// If "number" is not found, -1 is returned.
// Input: The array of values, the number of values in the array, and "number" to search for are passed in 
// Output: The location of the value in the array, or the value -1 if not found, is returned
int LinearSearch(const int values[], int count, int number)
{
	for (int i=0; i<count; i++)
	{
		if (values[i] == number)
			return i;
	}
	return -1;
}

// This function reads the values from the data file and computes the largest, smallest, and the average value. All the values read are stored in the array "values"
// Input: input file stream
// Output:  largest, smallest and average values
//          the list of values read
int ProcessingData(ifstream &myIn, int &largest, int &smallest, float &ave, int values[])
{
	int count=0;
	int sum=0;
	int value;
	
        // Read from the data file one value at a time
	while (myIn >> value)
	{
                // store the value in the array
		values[count] = value;
               
                // set the starting values of largest and smallest
		if (count == 0){
			largest = value;
			smallest = value;
		}
		else {
                // update largest and smallest as needed
			if (value > largest)
				largest = value;
			else if (value < smallest)
				smallest = value;
		}
		
                // compute the total
		sum += value;
		count ++;
	}
        // compute the average
	ave = (float) sum/count;
	
	return count;
}

// The functions prepares the data file to be read
// Output: the input file stream for a data file ready to read from is sent back by reference
void PrepDataFile(ifstream & myIn)
{
	string filename;
	
	// prompt for file name
	cout << "Enter the file name: ";
	cin >> filename;
	
	myIn.open(filename.c_str());
	assert(myIn);	
}

// Display statistics of the values read
void DisplayResults(int largest, int smallest, float ave)
{
        cout << "The largest  is " << largest << endl;
        cout << "The smallest is " << smallest << endl;
        cout << "The average is " << ave << endl;
}

// Display the content of the array
void PrintArray(int values[], int count)
{
	cout << "The values are: "<< endl;
	for (int i=0; i<count; i++)
		cout << i << " : " << values[i] << endl;
}
		
