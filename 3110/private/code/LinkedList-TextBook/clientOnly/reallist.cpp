// Program RealList creates a linked head of values from a
// file and prints the head.

#include <iostream>
#include <cstddef>		                // to access NULL
#include <fstream>
#include <cassert>
using namespace std;

typedef float ItemType;

struct NodeType;              	        // forward declaration
typedef NodeType* NodePtr;
struct NodeType
{
  ItemType data;
  NodePtr next;
};

int main ()
{
  NodePtr  head;                	// head of the list
  NodePtr  newNodePtr;              	// extra pointer
  NodePtr  currentNodePtr;	        // extra pointer

  ItemType  tempValue;
  ifstream  myIn;
  myIn.open("real.dat");
  assert(myIn);

  // keep reading from the data file and build the list with the values read
  while (myIn >> tempValue) {   // end of file not reached, enter the loop

	  	// read and create the first node with that value
  	  	newNodePtr = new NodeType;
	  	newNodePtr -> data = tempValue;
	  	newNodePtr -> next = NULL;

	  	if (head == NULL)  {  // case 1: empty list case
      		head = newNodePtr;   // now the list is no longer empty

  			currentNodePtr = head;  // get ready for building the rest of the list
		} 		
		else {    // case 2: list not empty
			// link the node into the list
      		currentNodePtr->next = newNodePtr;

	  		// get ready for the next node
      		currentNodePtr = newNodePtr;
		}
  }

  cout  << fixed  << showpoint;

  // print out values
  currentNodePtr = head;
  while (currentNodePtr != NULL)
  {
	cout << currentNodePtr->data  << endl;
	currentNodePtr = currentNodePtr->next;
  }

  return 0;
}
