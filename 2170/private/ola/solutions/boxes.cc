#include <iostream>
#include <string>
#include <fstream>
#include <iomanip>
using namespace std;
int LinearSearch(string names[], int size, string toFind);
void SelectionSort(string names[], int box[], int n);

const int SIZE=100;

int main()
{
    ifstream myIn;
    string name;
    int quantity;
    int index;
    int boxes[SIZE];
    string names[SIZE];

    myIn.open("boxes.dat");

    int size=0;
    while (myIn>>name>>quantity) {
	index = LinearSearch(names, size, name);
	if (index>=0) {
		boxes[index] += quantity;
	}
	else {
		names[size] = name;
		boxes[size] = quantity;
		size ++;
	}
    }
    myIn.close();

    SelectionSort(names, boxes, size);

    int max;
    string maxName;

    max = boxes[0];
    maxName = names[0];
    for (int i=1; i<size; i++)  {
    	if (boxes[i] > max) {
	    max = boxes[i];
	    maxName = names[i];
	}
    }

    cout << "The final results are: " << endl;
    for (int i=0; i<size; i++) {
        cout << setw(10) << names[i] << "\t" << boxes[i] << endl;
    }
    cout << endl << endl;

    cout << "The winner is " << maxName << " sold " << max << " boxes." << endl;

    return 0;
}

int LinearSearch(string names[], int size, string toFind)
{
    for (int i=0; i<size; i++) {
        if (names[i] == toFind)
	    return i;
    }

    return -1;
}

void SelectionSort(string names[], int box[], int n) {
    int i, j, minIndex;
    string tmp;
    int tmpB;

    for (i=0; i<n-1; i++)  {

     	minIndex=i;
	for (j=i+1; j<n; j++)  {
	   if (box[j] < box[minIndex])  {
		minIndex = j;
	   }
	}
    
    	if (minIndex != i) {

    	   tmp = names[i];
	   names[i] = names[minIndex];
	   names[minIndex] = tmp;

	   tmpB = box[i]; 
	   box[i] = box[minIndex];
	   box[minIndex] = tmpB;
	}
    }
}
