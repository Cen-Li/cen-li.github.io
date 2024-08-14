/* Implementation file QueueP.cpp for the ADT queue. */

#include "queue.h"  // header file
#include <stddef.h>  // for NULL

// The queue is implemented as a circular linked list
// with one external pointer to the back of the queue.
struct queueNode
{  
    queueItemType item;
    ptrType next;
};


/*******************************************************************************
Function: Default QueueClass constructor
Pre-condition:  N/A
Post-condition: BackPtr set to NULL and queueSize is set to 0
Description:    Creates an empty queue and initializes private data members
*******************************************************************************/
QueueClass::QueueClass() : BackPtr(NULL), queueSize(0)
{
}


/*******************************************************************************
Function: QueueIsEmpty
Description:    Determines whether a queue is empty.
Precondition:   NA
Postcondition:  Returns true if the queue is empty; otherwise returns false.
*******************************************************************************/
bool QueueClass::QueueIsEmpty() const
{
   return bool(BackPtr == NULL);
}


/*******************************************************************************
Function: QueueInsert
Description:    Inserts an item at the back of a queue.
Precondition:   NewItem is the item to be inserted. 
Postcondition:  If insertion was successful, NewItem is at the back of the queue 
                and success is true; otherwise success is false.
*******************************************************************************/
void QueueClass::QueueInsert(const queueItemType & Newitem, bool& success)
{
   // create a new node
   ptrType NewPtr = new queueNode;

   success = bool(NewPtr != NULL);  // check allocation
   
   if (success)
   {  // allocation successful; set data portion of new node
      NewPtr->item = Newitem;

      // insert the new node
      if (QueueIsEmpty())
         // insertion into empty queue
         NewPtr->next = NewPtr;

      else
      {  // insertion into nonempty queue
         NewPtr->next = BackPtr->next;
         BackPtr->next = NewPtr;
      }  

      BackPtr = NewPtr;  // new node is at back
      
      queueSize++;
   }  
}


/*******************************************************************************
Function: QueueDelete
Description:    Deletes the front of a queue.
Precondition:   NA
Postcondition:  If the queue was not empty, the item that was added to the queue 
                earliest is deleted and success is true. However, if the queue was 
                empty, deletion is impossible and success is false.
*******************************************************************************/
void QueueClass::QueueDelete(bool& success)
{
   success = bool(!QueueIsEmpty());

   if (success)
   {  // queue is not empty; remove front
      ptrType FrontPtr = BackPtr->next;
      if (FrontPtr == BackPtr)   // special case?
         BackPtr = NULL;         // yes, one node in queue
      else
         BackPtr->next = FrontPtr->next;

      FrontPtr->next = NULL;  // defensive strategy
      delete FrontPtr;
      queueSize--;
   }  
}  // end QueueDelete



/*******************************************************************************
Function: QueueDelete
Description:    Retrieves and deletes the front of a queue.
Precondition:   NA
Postcondition:  If the queue was not empty, QueueFront contains the item that was 
                added to the queue earliest, the item is deleted, and success is true. 
                However, if the queue was empty, deletion is impossible and success is false.
*******************************************************************************/
void QueueClass::QueueDelete(queueItemType & queueFront, bool& success)
{
   success = bool(!QueueIsEmpty());

   if (success)
   {  // queue is not empty; retrieve front
      ptrType FrontPtr = BackPtr->next;
      queueFront = FrontPtr->item;

      QueueDelete(success);  // delete front
   }  
}


/*******************************************************************************
Function: GetQueueFront
Description:    Retrieves the item at the front of a queue.
Precondition:   NA
Postcondition:  If the queue was not empty, QueueFront contains the item that was 
                added to the queue earliest and success is true. However, if the 
                queue was empty, the operation fails, QueueFront is unchanged, and 
                success is false. The queue is unchanged.
*******************************************************************************/
void QueueClass::GetQueueFront(queueItemType& queueFront, bool& success) const
{
   success = bool(!QueueIsEmpty());

   if (success)
   {  // queue is not empty; retrieve front
      ptrType FrontPtr = BackPtr->next;
      queueFront = FrontPtr->item;
   }   
}



/*******************************************************************************
Function: GetQueueSize
Description:    Gets the size of a queue
Precondition:   NA
Postcondition:  returns the queue size
*******************************************************************************/
int QueueClass::GetQueueSize()
{
    return queueSize;
}


/*******************************************************************************
Function: Default QueueClass Destructor
Pre-condition:  N/A
Post-condition: deletes all nodes
*******************************************************************************/
QueueClass::~QueueClass()
{
   bool success;

   while (!QueueIsEmpty())
      QueueDelete(success);
   // Assertion: BackPtr == NULL
}  // end destructor
