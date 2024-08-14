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
    NodePtr head, back;
    int  length;
    length = 0;
    head = NULL;
    back = NULL;

    length = BuildList(head, back);

    PrintList(head);

    //Delete(head, "Amy");
    Insert(head, "Joseph", 1);

    PrintList(head);

    DestroyList(head);
    back = NULL;

    return 0;
}

void Insert(NodePtr & head, string toAdd, int position)
{
    NodePtr cur, prev;
    NodePtr tmp;

    tmp=new Node;
    tmp->data = toAdd;
    tmp->next = NULL;

    if (position == 1)
    {
       tmp->next = head;
       head = tmp;
       return;
    }
    cur=prev=head;
    for (int i=1; i<position; i++)
    {
        prev=cur;
        cur=cur->next;
    }

    prev->next = tmp;
    tmp->next = cur;
}


void Delete(NodePtr & head, string toDel)
{
     NodePtr cur, prev;
   
     if (head != NULL && head->data == toDel)
     {
	cur=head;
        head = head->next;
        cur->next=NULL;
        delete cur;
     }
     else if (head != NULL)
     {
     	cur=prev=head;
     	while (cur != NULL)
    	{
           if (cur->data == toDel)
           {
	      prev->next = cur->next;

              cur->next = NULL;
              delete cur;
              break;
           }
	   prev= cur;
           cur = cur->next;
        } // end while
      } // end else
}

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


int BuildList(NodePtr &head, NodePtr &back)
{
    int length=0;
    string name;
    NodePtr tmp;

    while (cin >> name)
    {
        length++;

        tmp = new Node;
        tmp->data = name;
        tmp->next = NULL;

        if (head == NULL)  // empty list case
        {
           head = tmp;
           back = tmp;
        }
        else
        {
           back->next = tmp;
           back = back->next;
        }   
    }
    
    return length;
}

void PrintList(NodePtr head)
{
    NodePtr cur;

    cout << "Here is the list of names:" << endl;
    cur = head;
    while (cur != NULL)
    {
	cout << cur->data << endl;
        cur = cur->next;
    }
}


