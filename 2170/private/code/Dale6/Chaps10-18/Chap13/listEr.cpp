// Program ListEr reads in and stores float values from file
// "real.dat" until the stream fails.

#include <iostream>
#include <fstream>
using namespace std;

const int MAX_LENGTH = 20;

class FloatList
{ 
public:
  void GetList(ifstream&);
  // Reads values from a file and stores them in a list.
  void PrintList();
  // Prints list values on the screen.
  FloatList();                 
  // Constructor:  Sets the list to empty.

private:
  int length;
  float values[MAX_LENGTH];
};

int  main ()
{
  ifstream  tempData;
  FloatList  list;
  float unknown  = 0.0;
  cout  << fixed  << showpoint;
  tempData.open("real.in");

   // Input and print a list
  list.GetList(tempData);
  list.PrintList();
  
  cout  << unknown  << " set to 0.0 in program." << endl;
  return 0;
}
                                                            
//*******************************************

FloatList::FloatList()
{
  length = 0;
}
             
//*******************************************

void  FloatList::GetList(ifstream&  data)
{
  float  item;
  data  >> item;
  while (data)
  {
	values[length] = item;
	length++;
	data  >> item;
  }
}

//*******************************************************

void  FloatList::PrintList()
{
  int  index;
  for (index = 0; index < length; index++)
    cout  << values[index]  << endl;
}


