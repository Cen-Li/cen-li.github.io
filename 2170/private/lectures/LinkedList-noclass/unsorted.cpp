// This program implements an unsorted linked list
#include <fstream>
#include <iostream>
#include <string>
#include <cstddef> // for NULL
#include <cassert> // for assert()
using namespace std;

typedef string ListItemType;
struct Node
{
   ListItemType data;
   Node * next;
};
typedef Node* NodePtr;

bool IsEmpty(NodePtr head);
int GetLength(NodePtr head);
NodePtr Find(NodePtr head, int location);
ListItemType Retrieve(NodePtr head, int location);
void Insert(NodePtr & head, ListItemType newItem, int location);
void Delete(NodePtr & head, int location);
void ListCopy(const NodePtr& oldHead, NodePtr& newHead);
void DestroyList(NodePtr& head);
void DisplayList(NodePtr head);

int main()
{
   ifstream myIn;
   ListItemType value;  
   int location;   // location of insertion or deletion
   NodePtr head = NULL;   // head of the list
   NodePtr cur;
   int length = 0;  // length of the list

   // open the data file
   myIn.open("names2.dat");
   assert(myIn);

   // Read (value, location) pairs til the end of input,
   // Insert the values into the list at location specified
   while (myIn >> value >> location)
   {
       Insert(head, value, location);
       length ++;
   }
   myIn.close();
  
   // Print all the values stored in the list
   DisplayList(head);

   // Find a value
   cout << "Which value are you looking for? (specify location): ";
   cin >> location; 
   if (location >=1 && location <=length)
   {
      cur = Find(head, location);
      cout << "Value stored at node (" << location << ") is " << cur->data << endl;

   
      // Delete the node at the specified location
      Delete(head, location);

      cout << "After the deletion..." << endl;
      // Print all the values stored in the list
      DisplayList(head);
   }
   else
   {
      cout << "Wrong location specified." << endl;
   }

   // delete list, free memory
   DestroyList(head);
   
   return 0;
}

// Print out the values stored in the list
void DisplayList(NodePtr head)
{
 
   NodePtr cur=head;

   cout << endl << endl << "Here is the list:" << endl;
   cout << "===============" << endl;
   // print values in the entire list
   while (cur != NULL)
   {
      cout << cur->data << endl;
      cur = cur->next;      
   }
   cout << endl << endl;
}

// Compute the length of the list
int GetLength(NodePtr head)
{
   int size=0; 
   NodePtr cur=head;
   
   while (cur != NULL)
   {
      size++;
      cur = cur->next;
   }
   
   return size;
} 

// Return a pointer to the node at location "location"
// The location should have been checked to be 
// valid (i.e., 1 <= location <= length of the list)
NodePtr Find(NodePtr head, int location) 
{
   NodePtr cur= head;
   for (int skip = 1; skip < location; skip++)
      cur = cur->next;

   return cur;
} // end Find


// Returns the data stored in the "location"-th node of the list
ListItemType Retrieve(NodePtr head, int location)
{
   ListItemType dataItem;

   // get pointer to node, then data in node
   NodePtr cur = Find(head, location);
   dataItem = cur->data;

   return dataItem;
} 


// Insert a new node (with data "newItem") into the list at location "location"
void Insert(NodePtr & head, ListItemType newItem, int location)
{
   // create new node and place newItem in it
   NodePtr newPtr = new Node;
   assert(newPtr != NULL);
   newPtr->data = newItem;
   newPtr->next= NULL;

   // attach new node to list
   if (location == 1)
   {  // insert new node at beginning of list
      newPtr->next = head;
      head = newPtr;
   }
   else
   { 
      NodePtr prev = Find(head, location-1);
      // insert new node after node to which prev points
      newPtr->next = prev->next;
      prev->next = newPtr;
   } // end if
} // end insert


// Delete the node at location "location"
void Delete(NodePtr & head, int location)
{
  NodePtr cur;

  if (location == 1)
  {  // delete the first node from the list
     cur = head; // save pointer to node
     head = head->next;
  }
  else
  { 
      NodePtr prev = Find(head, location - 1);
     // delete the node after the
     // node to which prev points
     cur = prev->next; // save pointer to node
     prev->next = cur->next;
  } // end if

  // return node to system
  cur->next = NULL;
  delete cur;
  cur = NULL;
} // end remove


// Make a deep copy of an existing list
void ListCopy(const NodePtr& oldHead, NodePtr& newHead)
{
   if (oldHead == NULL)
      newHead = NULL; // original list is empty
   else
   {  // copy first node
      newHead = new Node;
      assert(newHead != NULL); // check allocation
      newHead->data = oldHead->data;

      // copy rest of list
      NodePtr newPtr = oldHead; // new list pointer
      // newPtr points to last node in new list
      // origPtr points to nodes in original list
      for (NodePtr origPtr = oldHead->next;
                   origPtr != NULL;
                   origPtr = origPtr->next)
      {  newPtr->next = new Node;
         assert(newPtr->next != NULL);
         newPtr = newPtr->next;
         newPtr->data = origPtr->data;
      } // end for

      newPtr->next = NULL;
   } // end if
} // end copy constructor


// Release the memory of all the nodes back to the memory
void DestroyList(NodePtr& head)
{
   while (!IsEmpty(head))
      Delete(head, 1);
}

// Check to see if the list is empty
bool IsEmpty(NodePtr head)
{
   return (head == NULL);
} 
