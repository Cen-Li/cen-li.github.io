/* Header file: queue.h */

#ifndef QUEUE_H
#define QUEUE_H

typedef int queueItemType;

struct queueNode;                   // defined in implementation file
typedef queueNode* ptrType;         // pointer to node

class QueueClass
{
    public:
        // constructors and destructor:
        QueueClass();                     // default constructor
        ~QueueClass();                    // destructor

        bool QueueIsEmpty() const;
        // Determines whether a queue is empty.
        // Precondition: NA
        // Postcondition: Returns true if the queue is empty;
        // otherwise returns false.

        void QueueInsert(const queueItemType& NewItem, bool& success);
        // Inserts an item at the back of a queue.
        // Precondition: NewItem is the item to be inserted. 
        // Postcondition: If insertion was successful, NewItem
        // is at the back of the queue and success is true; 
        // otherwise success is false.

        void QueueDelete(bool& success);
        // Deletes the front of a queue.
        // Precondition: NA
        // Postcondition: If the queue was not empty, the item 
        // that was added to the queue earliest is deleted and 
        // success is true. However, if the queue was empty, 
        // deletion is impossible and success is false.

        void QueueDelete(queueItemType& queueFront, bool& success);
        // Retrieves and deletes the front of a queue.
        // Precondition: NA
        // Postcondition: If the queue was not empty, QueueFront 
        // contains the item that was added to the queue 
        // earliest, the item is deleted, and success is true. 
        // However, if the queue was empty, deletion is 
        // impossible and success is false.

        void GetQueueFront(queueItemType& QueueFront, bool& success) const;
        // Retrieves the item at the front of a queue.
        // Precondition: NA
        // Postcondition: If the queue was not empty, QueueFront 
        // contains the item that was added to the queue earliest 
        // and success is true. However, if the queue was empty, 
        // the operation fails, QueueFront is unchanged, and 
        // success is false. The queue is unchanged.
   
        int GetQueueSize();
        //Gets the size of a queue
        //Precondition:  NA
        //Postcondition: returns the queue size
    
    private:
        ptrType BackPtr;     //pointer to the back of a queue
        int queueSize;       //queue size
};

#endif
