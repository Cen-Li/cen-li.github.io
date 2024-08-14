#include <cstdlib>
#include <iostream>
using namespace std;

const int SIZE = 15;
typedef int datatype;

int  kSmall(int k, datatype anArray[], int first, int last);
void Partition(datatype A[], int F, int L, int& PivotIndex);
void RandomizeArray(datatype items[], int size);
void swap(datatype & value1, datatype & value2);

int main(int argc, char *argv[])
{
	datatype items[SIZE];  // the array of items: 10, 20, 30, ... The items will be randomized before kSmall is called
	int      index;   // the index of the k-th smallest item in the array
	int      k;   // specify k for the k-th smallest item

	srand(time(NULL));

	// form data in the array
	for (int i=0; i<SIZE; i++)
		items[i] = (i+1)*10;

	// randomize the data 
	RandomizeArray(items, SIZE);

	// display the array after randomization
	cout << "Here is the original array:" << endl;
	for (int i=0; i<SIZE; i++)
		cout << items[i] << "  ";

	cout << endl << "Which kth smallest value to show? ";
	cin >> k;

    index = kSmall(k, items, 0, SIZE-1);
	cout << "The " << k << "-th smallest value is : " << items[index]<< endl;

	return 0;
}

int kSmall(int k, datatype anArray[], int first, int last) 
{ 
    int pivotIndex; // index of the pivot

// display the current segment of the array after partition
cout << "Before Partition: " << endl;
cout << "=============================="<< endl;
for (int i=first; i<=last; i++)
   cout << anArray[i] << " ";
cout << endl;
cout << "=============================="<< endl;

     //partition the items of anArray[first … last] about pivot 
	Partition(anArray, first, last, pivotIndex); 

// display the current segment of the array after partition
cout << "After Partition: " << endl;
cout << "=============================="<< endl;
for (int i=first; i<=last; i++)
   cout << anArray[i] << " ";
cout << endl;
cout << "=============================="<< endl << endl;

    // if th pivot is located at a position greater than k
    // try again with the segment of array before pivot 
	if (k < pivotIndex - first + 1)
  		return   kSmall(k, anArray, first, pivotIndex-1); 

    // pivot value in the current segment of the array corresponds to the kth value in the original array
	else if (k == pivotIndex-first+1)
  		return pivotIndex; 

 	else  // kth smallest must be in the segment of array after pivot
		return kSmall ((k - (pivotIndex-first+1)), anArray, pivotIndex+1, last);
} 

// partition the data in the array around the pivot value
// pivot is chosen as the first value in the array
void Partition(datatype A[], int F, int L, int& PivotIndex) 
{ 
   datatype Pivot = A[F];     // copy pivot 
 
cout << "Pivot is " << Pivot << endl;
cout << "=============================="<< endl;

   // initially, everything but pivot is in unknown 
   int LastS1 = F;            // index of last item in S1 
   int FirstUnknown = F + 1;  // index of first item in unknown 
 
   // move one item at a time until unknown region is empty 
   for (; FirstUnknown <= L; ++FirstUnknown) 
   {  
	  // move item from unknown to proper region 
      if (A[FirstUnknown] < Pivot) 
      { 
		 // item from unknown belongs in S1 
         ++LastS1; 
         swap(A[FirstUnknown], A[LastS1]); 
      }  // end if 
 
      // else item from unknown belongs in S2 
   }  // end for 
 
   // place pivot in proper position and mark its location 
   swap(A[F], A[LastS1]); 
   PivotIndex = LastS1; 

}  // end Partition 


// a quick randomization routine for 1D array
void RandomizeArray(datatype items[], int size)
{
	int index1, index2;

	for (int i=0; i<20; i++)
	{
		index1 = rand()%size;
		index2 = rand()%size;

		swap(items[index1], items[index2]);
	}
}

void swap(datatype & value1, datatype & value2)
{
	datatype tmp;
	tmp = value1;
	value1 = value2;
	value2 = tmp;
}
