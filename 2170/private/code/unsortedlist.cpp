// Unsorted linked list example
// This linked list does not use class implementation
// Insertion into the list is done by "location"
// Deletion is done by "matching"

#include <iostream>
using namespace std;

struct Node
{
   string data;
   Node * next;
};
typedef Node * NodePtr;

int BuildList(NodePtr &head, NodePtr &back);
void PrintList(NodePtr head);
void DestroyList(NodePtr &head);
void Delete(NodePtr & head, string toDel);
void Insert(NodePtr & head, string toAdd, int position);

int main()
{
    NodePtr head, back;  // pointers pointing to the front and back of the list
    int  length;   // keeps track of the number of nodes in the list
    string name;

    // initialization
    length = 0;
    head = NULL;
    back = NULL;

    // Build a list
    length = BuildList(head, back);

    // Display a list
    PrintList(head);

    // Insert new items into a list
    Insert(head, "Joseph", 1);
    PrintList(head);

    // Delete item from a list
    cout << "Enter the name to delete: ";
    getline(cin, name);
    Delete(head, name);
    PrintList(head);

    // deallocate memory
    DestroyList(head);
    back = NULL;

    return 0;
}

// Insert an item "toAdd" into the list at a particular "position"
// Input: head points to the front of an existing list
//        toAdd holds the item to the added into the list
//        position holds the location where the item is to be inserted
//        the first node is treated as location 1
// Output: The head to the updated list is returned
void Insert(NodePtr & head, string toAdd, int position)
{
    NodePtr cur, prev;
    NodePtr newPtr;

    // Create a new node and put the item to be added in this new node
    newPtr=new Node;
    newPtr->data = toAdd;
    newPtr->next = NULL;

    // Determine where to insert the new node
    // If it is to be added in the front
    if (position == 1)
    {
       newPtr->next = head;
       head = newPtr;
       return;
    }


    // If the new item is to be added in the middle or at the end of the list
    cur=prev=head;
    // Traverse to the position
    // IMPORTANT: cur pointer points to the node at "position"
    //            prev pointer points to the item at "position-1"
    for (int i=1; i<position; i++)
    {
        prev=cur;
        cur=cur->next;
    }

    // Modify the link to add the node into the list at "position" 
    prev->next = newPtr;
    newPtr->next = cur;
}

// Delete an item "toDel" from the list
// This function removes ALL the occurences of the value from the list
// Input: head points to the front of an existing list
//        toDel holds the value to be deleted from the list
// Output: The head pointing to the updated list is returned

void Delete(NodePtr & head, string toDel)
{
     NodePtr cur, prev;
     bool  found=false;
   
     // Determine if the list is empty or if the first node is to be deleted
     if (head != NULL && head->data == toDel)
     {
        found = true;
	cur=head;
        head = head->next;
        cur->next=NULL;
        delete cur;
     }
     // Deletion from the middle or end of the list 
     else if (head != NULL)
     {
        // Use two pointers to traverse down the list
        // It will traverse all the way to the end of the list
     	cur=prev=head;
     	while (cur != NULL)
    	{
           // Use two pointers to traverse the list
	   //  -- cur points to the node to be deleted
           //  -- prev points to the node in the previous node
           // Remove the node by changing the link and free the memory
           if (cur->data == toDel)
           {
              found = true;
	      prev->next = cur->next;

              cur->next = NULL;
              delete cur;
              cur=prev;
           }
	   prev= cur;
           cur = cur->next;
        } // end while
      } // end else

      if (!found)
        cout << toDel << " is not in the list." << endl;
}

// Free the memory of all the nodes in the list
void DestroyList(NodePtr &head)
{
    NodePtr tmp;
    
    while (head != NULL)
    {
       cout << "Freeing one node" << endl;
       tmp=head;
       head = head->next;
       delete tmp;
    }
}


// Build a linked list 
// Read names from user and add the items at the back of the list
// Input and Output: The pointers pointing to the front and back of the list
int BuildList(NodePtr &head, NodePtr &back)
{
    int length=0;
    string name;
    NodePtr newPtr;

    cout << "Enter a name: ";
    getline(cin, name);
    while (name!="")
    {
        length++;

        // create a new node for the name
        newPtr = new Node;
        newPtr->data = name;
        newPtr->next = NULL;

        // add the node into the list
        if (head == NULL)  // empty list case
        {
           head = newPtr;
           back = newPtr;
        }
        else
        {  
           // add the new node at the end of the list
           back->next = newPtr;
           back = back->next;
        }   
        
        cout << "Enter a name: ";
        getline(cin, name);
    }
    
    return length;
}

// Display the list
// Print the items stored in the nodes in the list
// Input: head points to the front of the list
void PrintList(NodePtr head)
{
    NodePtr cur;

    // list traversal
    cout << "Here is the list of names:" << endl;
    cur = head;
    while (cur != NULL)
    {
	cout << cur->data << endl;
        cur = cur->next;
    }
}
