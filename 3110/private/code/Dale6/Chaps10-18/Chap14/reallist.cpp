// Program RealList creates a linked listPtr of values from a
// file and prints the listPtr.

#include <iostream>
#include <cstddef>		                // to access NULL
#include <fstream>
using namespace std;

typedef float ItemType;

struct NodeType;              	        // forward declaration
typedef NodeType* NodePtr;
struct NodeType
{
  ItemType component;
  NodePtr next;
};

int main ()
{
  NodePtr  listPtr;                	// external pointer
  NodePtr  newNodePtr;              	// extra pointer
  NodePtr  currentNodePtr;	        // extra pointer
  ItemType  tempValue;
  ifstream  data;

  cout  << fixed  << showpoint;
  data.open("real.dat");
  listPtr = new NodeType;
  data  >> listPtr->component;
  if (data)
  {   // read in values
	currentNodePtr = listPtr;
	data >> tempValue;
	while (data)
	{
      newNodePtr = new NodeType;
      newNodePtr->component = tempValue;
      currentNodePtr->next = newNodePtr;
      currentNodePtr = newNodePtr;
      data  >> tempValue;
	}
	currentNodePtr->next = NULL;
  }
  else
    listPtr = NULL;

  // print out values
  currentNodePtr = listPtr;

  while (currentNodePtr != NULL)
  {
	cout << currentNodePtr->component  << endl;
	currentNodePtr = currentNodePtr->next;
  }
  return 0;
}
