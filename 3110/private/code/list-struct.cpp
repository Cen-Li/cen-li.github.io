#include <iostream>
#include <fstream>
#include <cassert>
#include <string>
using namespace std;

struct bookStruct
{
   string title;
   string author;
   float  price;
};

typedef bookStruct ListItemType;

struct Node
{
   ListItemType data;
   Node *       next;
};

typedef Node* NodePtr;

void PrintList(NodePtr head);
int Search(NodePtr head, ListItemType value);
void Delete(NodePtr& head, ListItemType value);
void SortedInsert(NodePtr& head, ListItemType value);
void ReleaseNodes(NodePtr &head);

int main()
{
    NodePtr head=NULL;
    ListItemType oneBook;
    ifstream myIn("library.dat");

    assert(myIn);

    // read data one at a time and add to our list
    while (getline(myIn, oneBook.title))
    {
        getline(myIn, oneBook.author);
        myIn >> oneBook.price;
        myIn.ignore(100, '\n');

        SortedInsert(head, oneBook);
    }

    // print the list
    PrintList(head);

    // delete a node from the list 
    cout << "Which book do you want to delete : ";
    getline(cin, oneBook.title) ;

    Delete(head, oneBook);

    PrintList(head);

    ReleaseNodes(head);

    return 0;
}

void ReleaseNodes(NodePtr &head)
{
   NodePtr cur;

   while (head!=NULL)
   {
      cur= head;
      head=head->next;

      // release a node
      cur->next = NULL;
      delete cur;
   }
}

void SortedInsert(NodePtr& head, ListItemType aBook)
{
    NodePtr cur, prev;
    NodePtr newPtr;

    // create a node to be inserted
    newPtr = new Node;
    newPtr->data = aBook;  // aggregated assignment for struct type
    newPtr->next = NULL;

    // case 1: insert at the beginning of the list 
    if (head==NULL || (head != NULL && aBook.price< head->data.price))  
    {
       newPtr->next = head; // remember here: head is equal to NULL
       head = newPtr;
    }
    else // case 2: insert in the middle of at the end of the list
    {
       prev=NULL;
       cur=head;

       // look for the right place for insertion
       while (cur != NULL && cur->data.price< aBook.price)
       {
            prev = cur;
            cur = cur->next;
       }
       
       newPtr->next = cur;
       prev->next = newPtr;
    } // end else
 
    return;
}


void Delete(NodePtr& head, ListItemType aBook)
{
    NodePtr cur, prev;
    
    // case 1: delete from the front of the list
    if (head != NULL && head->data.title == aBook.title)
    {
        cur = head;
        head = head->next;
        cur->next = NULL;
        delete cur;
    }
    else  // case 2 : delete from the middle of end of the list case
    {
        prev=NULL;
        cur=head;

        // search for the right location to delete the node
        while (cur!= NULL && cur->data.title != aBook.title)
        {
             prev= cur;
             cur=cur->next;
        }

        // what the possible values of cur at this point?
        if (cur==NULL)
        {
           cout << "Item not in the list, deletion can not be done" << endl;
        }
        else
        {
           prev->next = cur->next;
           cur->next = NULL;
           delete cur;
        }
    } // end else

    return;
}


int Search(NodePtr head, ListItemType aBook)
{
    int location=1;
    NodePtr cur=head;
    while (cur != NULL)
    {
        if (cur->data.title == aBook.title)
        {
            cout << "Found the value" << endl;
            return location;
        }

        cur = cur->next; // advance to the next node
        location++;
    }

    // two possible values of cur
    // cur != NULL, because we found the value, and break out of while loop
    // cur==NULL, value not in the list, we have searched to the end of the list
    if (cur == NULL)
    {
       cout << "Value not in the list" << endl;
       return -1;
    }
}

void PrintList(NodePtr head)
{
    NodePtr cur;

    // print the list
    cur = head;
    while (cur!=NULL)
    {
       cout << cur->data.title << "\t" << cur->data.author 
            << "\t" << cur->data.price << endl;
       cur = cur->next;
    }
}
