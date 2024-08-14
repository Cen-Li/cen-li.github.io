#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

typedef int ItemType;

struct nodeStruct
{
    ItemType  item;
    nodeStruct *next;
};

typedef nodeStruct * nodePtr;

void BuildList(ifstream & myIn, nodePtr & head);
void PrintList(nodePtr list);
void FreeList(nodePtr head);

int main()
{
    nodePtr head=NULL;
    ifstream myIn("int.dat");
    assert(myIn);

    BuildList(myIn, head);
    myIn.close();

    PrintList(head);
    FreeList(head);

	return 0;
}

void BuildList(ifstream & myIn, nodePtr & head)
{
    nodePtr currPtr;
    ItemType value;
    myIn >> value;
    
    if (head == NULL)
    {
       head = new nodeStruct;
       head->item = value;
       head->next = NULL;

       currPtr = head;
       while (myIn >> value)
 	   {
           currPtr->next = new nodeStruct;
           currPtr = currPtr->next;
           currPtr->item = value;
           currPtr->next = NULL;
       }
    }
    else
       cout << "head needs to be NULL in this case." << endl;
}

void PrintList(nodePtr list)
{
    while (list != NULL)
    {
         cout << list->item << endl;
         list = list->next;
    }   
}

void FreeList(nodePtr head)
{
    nodePtr currPtr;
    while (head != NULL)
    {
		currPtr = head;
        head = head->next;
        
		currPtr->next = NULL;
        delete currPtr;
    }
}
