#include <iostream>
#include <string>
#include <vector>
#include <iomanip>

using namespace std;

int main()
{
	vector<string> oneVector;

	oneVector.push_back("one");
	oneVector.push_back("two");
	oneVector.push_back("three");
	oneVector.push_back("four");
	
	cout << "Using at functions to access elements" << endl;
	for (int i=0; i<oneVector.size(); i++ )
		cout << oneVector.at(i) << endl;

	cout << endl;
	cout << "Using [] to access elements" << endl;
	for (int i=0; i<oneVector.size(); i++ )
		cout << oneVector[i] << endl;

	// The difference between at & []
	// No range check for the operator [],
	// Function at will check the range, and may throw an exception
	// For example: v.at(100) = 99; will throw an out_of_range exception

	cout << endl;
	cout << "Using iterator to access elements" << endl;
	for (vector<string>::iterator iter=oneVector.begin(); iter != oneVector.end(); iter++ )
		cout << *iter << endl;


	cout << endl << "Two dimensional array example" << endl;

	int		numOfRows, numOfCols;

	cout << "Please enter number of rows: ";
	cin >> numOfRows;
	cout << "Please enter number of columns: ";
	cin >> numOfCols;

	// Create a two-dimensional array with "numOfRows" rows and "numOfCols" columns
	vector< vector<int> >		graph;
	vector<int>		oneRow(numOfCols);
 
	for ( int i=0; i<numOfRows; i++ )
	{
		oneRow.clear();
		for (int j=0; j<numOfCols; j++ )
			oneRow.push_back(i+j);
		graph.push_back(oneRow);	
	} 

        //Another approach
	vector< vector<int>>  graph(numOfRows, vector<int>(numOfCols));

        // assign values to vector elements
	for ( int i=0; i<graph.size(); i++ )
		for (int j=0; j<graph[i].size(); j++ )
			graph[i][j] = i + j;
	
	// display vector
	for (int i=0; i<graph.size(); i++)
	{
		for (int j=0; j<graph[i].size(); j++)
			cout << setw(2) << graph[i][j] << " ";
		cout << endl;
	}
	
	return 0;
}
