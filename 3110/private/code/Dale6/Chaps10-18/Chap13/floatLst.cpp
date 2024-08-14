//**************************************************************
// Program FloatLst reads in and stores float values from file
// "real.in" until the stream fails.
//**************************************************************

#include <iostream>
#include <fstream>
using namespace std;

const int MAX_LENGTH = 50;

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
  // Set up input and output file
  ifstream  tempData;
  FloatList  list;
  cout << fixed  << showpoint;  
  tempData.open("real.in");

  // Input and print a list
  list.GetList(tempData);
  list.PrintList();
  return 0;
}
                                                            
//*******************************************

FloatList::FloatList()
// Post:  list.length has been set to zero. 
{
  length = 0;
}
             
//*******************************************

void  FloatList::GetList(ifstream&  data)
// Post: Values are read from file data and stored into list.
//	    list.length contains the number of values read.

{
  float  item;
  data  >> item;
  while (data)
  {
    values[length] = item;
    length++;
    data >> item;
  }             
}                                                            
                                                            
//*******************************************************  
                                                            
void  FloatList::PrintList()
// Post: list.length items are written on cout.

{
  int  index;
  for (index = 0; index < length; index++)
    cout  << values[index]  << endl;
}

