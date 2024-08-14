// This program build a list of integer values
// by adding new nodes at the end of the list

#include <iostream>
using namespace std;

typedef int ListItemType;

struct Node
{
   ListItemType data;
   Node * next;
};

typedef Node * NodePtr;
void BuildList(NodePtr &head);
void PrintList(NodePtr head);

int main()
{
   int value;
   NodePtr head = NULL;
   NodePtr cur;

   BuildList(head);

   PrintList(head);

   // free memory space
   while (head != NULL)
   {
      cout << "freed a node" << endl;
      cur = head;
      head = head->next;
      delete cur;
   }
      
   return 0;
}

void BuildList(NodePtr &head)
{
   int value;
   NodePtr cur;
   NodePtr tail;

   while (cin >> value)
   {
      cur = new Node;
      if (cur != NULL)
      {
         cur->data = value;
         cur->next = NULL;
      }

      if (head == NULL)
      {
         head = cur;
         tail = cur;
      }
      else 
      {
         tail->next = cur;
         tail = tail->next;
      }
   }
}

void PrintList(NodePtr head)
{
   NodePtr cur;

   // print the list
   cur = head;
   while (cur != NULL)
   {
      cout << cur -> data << endl;
      cur = cur->next;
   }
}
