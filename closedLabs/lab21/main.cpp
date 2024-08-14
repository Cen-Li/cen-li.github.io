#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

typedef string ItemType;
struct Node {
  Node * precede;
  ItemType data;
  Node * next;
};
typedef Node * NodePtr;

void Initialize(NodePtr & head);
void BuildList(ifstream & myIn, NodePtr & head);
void Insert(NodePtr & head, ItemType item);
void PrintForward(NodePtr head);
void PrintBackward(NodePtr head);
void DestroyList(NodePtr & head);

int main()
{
    NodePtr head;

    ifstream myIn("produce.dat");
    assert(myIn);

    Initialize(head);

    BuildList(myIn, head);

    PrintForward(head);

    PrintBackward(head);

    myIn.close();
}

void BuildList(ifstream & myIn, NodePtr & head) {
    
    ItemType item;
    while (myIn>>item) {
	Insert(head, item);
    }
}

void Initialize(NodePtr & head)
{
    head = new Node;
    head->precede = head;
    head->next = head;
}

void Insert(NodePtr & head, ItemType newData)
{
    NodePtr newPtr = new Node;
    newPtr->data = newData;
    newPtr->precede = NULL;
    newPtr->next = NULL;

    NodePtr cur=head->next;
    NodePtr prev=head;
    while (cur!=head && cur->data < newData) {
	 prev = cur;
	 cur = cur->next;
    }

    prev->next = newPtr;
    newPtr->precede = prev;
    newPtr->next = cur;
    cur->precede = newPtr;
}

void PrintForward(NodePtr head)
{
    cout << "Printing forward : "<< endl;
    NodePtr cur = head->next;
    while (cur != head) {
        cout << cur->data << endl;
	cur = cur->next;
    }
    cout << endl;
}

void PrintBackward(NodePtr head) 
{
    cout << "Printing backward : "<< endl;
    NodePtr cur = head->precede;
    do 
    {
        cout << cur->data << endl;
	cur = cur->precede;
    } while (cur != head->precede);
    cout << endl;
}

void DestroyList(NodePtr & head)
{
     NodePtr prev=head, cur = head->next;
     while (cur!=head)  {
         prev->next = cur->next;
	 cur->next = NULL;
	 cur->precede = NULL;
	 delete cur;
	 cur = prev->next;
    }
    head->next = NULL;
    head->precede = NULL;
    delete head;
    head=NULL;
}
