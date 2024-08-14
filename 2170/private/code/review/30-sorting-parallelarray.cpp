// This example illustrates selection sort used with parallel arrays

#include <iostream>
#include <string>
#include <fstream>
#include <cassert>
using namespace std;

const int SIZE = 10;
void Display(const string names[], const int grades[], int count);
void selectionSort(int array[], string names[], int size);
void swap(int &a, int &b);
void swap2(string &a, string &b);

int main()
{
   ifstream myIn1, myIn2;
   int count;
   string names[SIZE];
   int grades[SIZE];
   string oneName;
   int  oneGrade;

   myIn1.open("studentNames.dat");
   myIn2.open("grades.dat");
   assert(myIn1);
   assert(myIn2);

   // read in the data from two different files.
   // names and grades are stored in the parallel arrays
   count =0;
   while (count < SIZE && getline(myIn1, oneName))
   {
       names[count] = oneName;
       
       myIn2 >> oneGrade;
       grades[count] = oneGrade;

       count ++;
   }

   cout << "Before sorting....." << endl;
   Display(names, grades, count);

   selectionSort(grades, names, count);
     
   cout << "After sorting....." << endl;
   Display(names, grades, count);

   return 0;
}

// Display the names together with each person's grade
void Display(const string names[], const int grades[], int count)
{
    cout << "The students are: " << endl;
    for (int i=0; i<count; i++)
  	cout << i+1 << " : " << names[i] << " ->  " << grades[i] << endl;
}


//********************************************************************************************
// The selectionSort function sorts the parallel arrays based on grades in descending order. *
//********************************************************************************************
void selectionSort(int array[], string names[], int size)
{
   int maxIndex, maxValue;

   for (int start = 0; start < (size - 1); start++)
   {
      maxIndex = start;
      maxValue = array[start];
      for (int index = start + 1; index < size; index++)
      {
         if (array[index] > maxValue)
         {
            maxValue = array[index];
            maxIndex = index;
         }
      }
      swap(array[maxIndex], array[start]);
      swap2(names[maxIndex], names[start]);
   }
}

//***************************************************
// The swap function swaps a and b in memory.       *
//***************************************************
void swap(int &a, int &b)
{
   int temp = a;
   a = b;
   b = temp;
}

void swap2(string &a, string &b)
{
   string temp = a;
   a = b;
   b = temp;
}
