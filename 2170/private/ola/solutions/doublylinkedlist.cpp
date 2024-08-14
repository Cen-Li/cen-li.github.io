#include <iostream>
#include <string>
#include <fstream>
#include <cassert>
using namespace std;

typedef string ListItemType;
struct Node;
typedef Node * NodePtr;

struct Node
{
    NodePtr precede;
    ListItemType data;
    NodePtr   next;
};

void InitializeHead(NodePtr & head);
void DestroyList(NodePtr & head);

void Insert(NodePtr & head, ListItemType data);
void Delete(NodePtr & head, ListItemType data);
int Retrieve(NodePtr head, ListItemType data)
void Print(NodePtr  head);

int main()
{
    NodePtr head;
    char command;
    ifstream myIn;
    ListItemType item;
    int location;
  
    myIn.open("linkedlist.dat");
    assert(myIn);
   
    InitializeHead(head);

    while (myIn >> command)
    {
 	if (command == 'I')
        {
  	     myIn >> item;           
             Insert(head, item);
        }
        else if (command == 'D')
        {
 	     myIn >> item;
             Delete (head, item);
        }
        else if (command == 'P')
        {
   	     Print(head);
        }
        else if (command == 'R')
        {
             location = 0;
             myIn >> item;
             location = Retrieve(head, item);
             if (location >= 1)
                cout << item << " is retrieved from node " << location << endl;
             else
                cout << item << " is not found from the list." << endl;
	}
    } // while

    DestroyList(head);
}

void Insert(NodePtr & head, ListItemType data)
{
    NodePtr newPtr;
    newPtr = new Node;
    newPtr->data = data;
    newPtr->next = NULL;
    newPtr->precede = NULL;
    NodePtr cur;

    cur=head->next;
    while ((cur != head) && (cur->data < data))
 	cur = cur->next;

    // needs to change four pointers
    newPtr->next = cur; 
    newPtr->precede = cur->precede;
 
    cur->precede->next = newPtr; 
    cur->precede = newPtr;
}

void Delete(NodePtr & head, ListItemType data)
{
    NodePtr cur;

    cur=head->next;
    while ((cur != head) && (cur->data != data)) 
    {
	cur = cur->next; 
    }
    if ((cur!=head) && cur->data == data)
    {
       cur->precede->next = cur->next; 
       cur->next->precede = cur->precede;
   
       cur->next=NULL; 
       cur->precede=NULL;
       delete cur; 
       cur=NULL;
    } 
    else
       cout << "Item is not found in the list" << endl;
}

int Retrieve(NodePtr head, ListItemType data)
{
    NodePtr cur = head;
    int  count = 0;

    while (cur != head)
    {
       count++;
       if (cur->data == data)
          return count;
    }

    return -1;
}

void InitializeHead(NodePtr & head)
{
    head = new Node;
    head->precede = head;
    head->next = head;
} 

void Print(NodePtr  head)
{
    NodePtr cur = head->next;
    while (cur != head)
    {
       cout << cur->data << endl;
       cur = cur->next;
    }
}

void DestroyList(NodePtr & head)
{
    NodePtr cur = head->next;
    NodePtr delPtr;

    while (cur != head)
    {
        delPtr = cur;
        cur = cur->next;
   
        delPtr->next = NULL;
        delPtr->precede = NULL;
        delete delPtr;
    }

    head->next = NULL;
    head->precede = NULL;
    delete head;
    head = NULL;
}
