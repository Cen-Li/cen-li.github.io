listClass::listClass(const listClass& L): Size(L.Size)
{
   if (L.Head == NULL)
      Head = NULL;  // original list is empty

   else
   {  // copy first node
      Head = new Node;
      assert(Head != NULL);  // check allocation
      Head->item = L.Head->item;

      // copy rest of list
      nodePtr NewPtr = Head;  // new list pointer
      // NewPtr points to last node in new list 
      // OrigPtr points to nodes in original list
      for (nodePtr OrigPtr = L.Head->next;
                   OrigPtr != NULL; 
                   OrigPtr = OrigPtr->next)
      {  NewPtr->next = new Node;
         assert(NewPtr->next != NULL);
         NewPtr = NewPtr->next;
         NewPtr->item = OrigPtr->item;
      }  // end for

      NewPtr->next = NULL;
   }  // end if
}  // end copy constructor

listClass::~listClass()
{
   bool Success;

   while (!ListIsEmpty())
      ListDelete(1, Success);
} // end destructor
