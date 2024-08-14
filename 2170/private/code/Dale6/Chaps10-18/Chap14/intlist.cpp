// Program IntList reads integers and stores them in a linked list and prints them.

#include <iostream>
#include <cstddef>		// to access NULL
#include <fstream>
using namespace std;

typedef int ItemType;
struct NodeType;        	// forward declaration
typedef NodeType* NodePtr;
struct NodeType
{
  ItemType  item ;
  NodePtr  next;
};

void  GetList(NodePtr);
void  PrintList(NodePtr);

int main ()
{
  NodePtr  listPtr = NULL;        	// external pointer
  GetList(listPtr);
  PrintList(listPtr);
  return 0;
}

//*************************************************************

void  GetList(NodePtr  listPtr)

{
  ifstream  data;

  data.open("int.dat");
  ItemType  tempValue;
  data >> tempValue;
  if (data)       // File is not empty.
  {
	listPtr = new NodeType;
	NodePtr  currentNodePtr;	   	// extra pointer
	NodePtr  newNodePtr;
	currentNodePtr = listPtr -> next;
	listPtr -> item  = tempValue;     // Set up first node.
	data  >> tempValue;
	while (data)
	{
	  NodePtr  currentNodePtr;
	  newNodePtr = new NodeType;
	  newNodePtr -> item  = tempValue;
	  currentNodePtr -> next = newNodePtr;
	  currentNodePtr = newNodePtr;
	  data  >> tempValue;
	}
	currentNodePtr -> next = NULL;
  }
}


// **************************************************************

void  PrintList(NodePtr  listPtr)

{
  NodePtr  currentNodePtr;	   	// extra pointer
  currentNodePtr = listPtr;
  while (currentNodePtr != NULL)
  {
	cout  << currentNodePtr -> item   << endl;
	currentNodePtr = currentNodePtr -> next;
  }
}



