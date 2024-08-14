// This implements a sorted linked list

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
bool Find(NodePtr head, ListItemType item);
void Insert(NodePtr & head, ListItemType newItem);
void Delete(NodePtr & head, ListItemType item);
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
   myIn.open("names.dat");
   assert(myIn);

   // Read (value, location) pairs til the end of input,
   // Insert the values into the list at location specified
   while (myIn >> value)
   {
       Insert(head, value);
   DisplayList(head);
       length ++;
   }
   myIn.close();
  
   // Print all the values stored in the list
   DisplayList(head);

   // Find a value
   cout << "Which value are you looking for:  ";
   cin >> value; 
   if (Find(head, value))
   {
      cout << "Value found in the list"; 

      // Delete the node at the specified location
      Delete(head, value);

      cout << "After the deletion..." << endl;
      // Print all the values stored in the list
      DisplayList(head);
   }
   else
   {
      cout << "Value NOT found in the list." << endl;
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

// This function search the list for "item"
// If it is found in the list, true is retured.
// Otherwise, false is returned.
bool Find(NodePtr head, ListItemType item) 
{
   NodePtr cur= head;
   while (cur != NULL)
   {
      if (cur->data == item)
         return true;

      cur = cur->next;
   }
   return false;

} 


// Insert a new node (with data "newItem") into the list at location "location"
void Insert(NodePtr & head, ListItemType newItem)
{
   NodePtr cur, prev;

   // create new node and place newItem in it
   NodePtr newPtr = new Node;
   assert(newPtr != NULL);
   newPtr->data = newItem;
   newPtr->next= NULL;

   // insert new node at the front of the list 
   if ( IsEmpty(head) || (!IsEmpty(head) && newItem < head->data))
   {  // insert new node at beginning of list
      newPtr->next = head;
      head = newPtr;
   }
   else // insert new node in the middle or at the end of the list
   { 
      cur = prev = head;
     
      // Move pointers prev and cur down the linked list one after the other
      // They are positioned such that cur points to the item greater than "newItem"
      // and prev points the node before cur's node
      while (cur != NULL && newItem > cur->data)
      {
       	   prev = cur;
           cur = cur->next;
      }   

      // insert new node after node to which prev points
      newPtr->next = cur;
      prev->next = newPtr;
   } // end if
} // end insert


// Delete the node having value "item" stored in it
void Delete(NodePtr & head, ListItemType item)
{
  NodePtr cur, prev;

  if (head == NULL) // empty list case
  {
     cout << "Empty list, deletion not carried out." << endl;
  }
  else if (head->data == item) 
  {  // delete the first node from the list
     cur = head; // save pointer to node
     head = head->next;
  }
  else  // delete the node from the middle or at the end of the list
  { 
     cur = head;
     prev= head;
     while (cur != NULL && cur->data != item)
     {  
        prev = cur;
        cur = cur->next;
     }
        
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
   NodePtr cur = head;
   while (cur != NULL)
   {
      head = head->next;
      delete cur;
      cur = head;
   }
}

// Check to see if the list is empty
bool IsEmpty(NodePtr head)
{
   return (head == NULL);
} 
