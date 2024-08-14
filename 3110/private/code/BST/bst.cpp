#include "bst.h"

struct treeNode
{  treeItemType Item;
   ptrType      LChildPtr, RChildPtr;

   // constructor:
   treeNode(const treeItemType& NodeItem, ptrType L, ptrType R);
};  // end struct

treeNode::treeNode(const treeItemType& NodeItem, ptrType L, 
                   ptrType R): Item(NodeItem), LChildPtr(L), RChildPtr(R)
{
}  // end constructor

bstClass::bstClass() : Root(NULL)
{
}  // end default constructor

bstClass::bstClass(const bstClass& Tree)
{
   CopyTree(Tree.Root, Root);
}  // end copy constructor

bstClass::~bstClass()
{
   DestroyTree(Root);
}  // end destructor

bool bstClass::SearchTreeIsEmpty() const
{
   return bool(Root == NULL);
}  // end SearchTreeIsEmpty

void bstClass::SearchTreeInsert(const treeItemType& NewItem, bool& Success)
{
   InsertItem(Root, NewItem, Success);
}  // end SearchTreeInsert

void bstClass::SearchTreeDelete(keyType SearchKey, bool& Success)
{
   DeleteItem(Root, SearchKey, Success);
}  // end SearchTreeDelete

void bstClass::SearchTreeRetrieve(keyType SearchKey, treeItemType& TreeItem, bool& Success) const
{
   RetrieveItem(Root, SearchKey, TreeItem, Success);
}  // end SearchTreeRetrieve

void bstClass::PreorderTraverse(functionType Visit)
{
   Preorder(Root, Visit);
}  // end PreorderTraverse

void bstClass::InorderTraverse(functionType Visit)
{
   Inorder(Root, Visit);
}  // end InorderTraverse

void bstClass::PostorderTraverse(functionType Visit)
{
   Postorder(Root, Visit);
}  // end PostorderTraverse

void bstClass::InsertItem(ptrType& TreePtr, const treeItemType& NewItem, bool& Success)
{
   if (TreePtr == NULL)
   {  // position of insertion found; insert after leaf

      // create a new node
      TreePtr = new treeNode(NewItem, NULL, NULL);

      // was allocation successful?
      Success = bool(TreePtr != NULL);
   }

   // else search for the insertion position
   else if (NewItem.Key() < TreePtr->Item.Key())
      // search the left subtree
      InsertItem(TreePtr->LChildPtr, NewItem, Success);

   else  // search the right subtree
      InsertItem(TreePtr->RChildPtr, NewItem, Success);
}  // end InsertItem

void bstClass::DeleteItem(ptrType& TreePtr, keyType SearchKey, bool& Success)
// Calls: DeleteNodeItem.
{
   if (TreePtr == NULL)
      Success = false;  // empty tree

   else if (SearchKey == TreePtr->Item.Key())
   {  // item is in the root of some subtree
      DeleteNodeItem(TreePtr);  // delete the item
      Success = true;
   }  // end if in root

   // else search for the item
   else if (SearchKey < TreePtr->Item.Key())
      // search the left subtree
      DeleteItem(TreePtr->LChildPtr, SearchKey, Success);

   else  // search the right subtree
      DeleteItem(TreePtr->RChildPtr, SearchKey, Success);
}  // end DeleteItem

void bstClass::DeleteNodeItem(ptrType& NodePtr)
// Algorithm note: There are four cases to consider:
//   1. The root is a leaf.
//   2. The root has no left child.
//   3. The root has no right child.
//   4. The root has two children.
// Calls: ProcessLeftmost.
{
   ptrType      DelPtr;
   treeItemType ReplacementItem;

   // test for a leaf
   if ( (NodePtr->LChildPtr == NULL) &&
        (NodePtr->RChildPtr == NULL) )
   {  delete NodePtr;
      NodePtr = NULL;
   }  // end if leaf

   // test for no left child
   else if (NodePtr->LChildPtr == NULL)
   {  DelPtr = NodePtr;
      NodePtr = NodePtr->RChildPtr;
      DelPtr->RChildPtr = NULL;
      delete DelPtr;
   }  // end if no left child

   // test for no right child
   else if (NodePtr->RChildPtr == NULL)
   {  DelPtr = NodePtr;
      NodePtr = NodePtr->LChildPtr;
      DelPtr->LChildPtr = NULL;
      delete DelPtr;
   }  // end if no right child

   // there are two children:
   // retrieve and delete the inorder successor
   else
   {  ProcessLeftmost(NodePtr->RChildPtr, ReplacementItem);
      NodePtr->Item = ReplacementItem;
   }  // end if two children
}  // end DeleteNodeItem

void bstClass::ProcessLeftmost(ptrType& NodePtr, treeItemType& TreeItem)
{
   if (NodePtr->LChildPtr == NULL)
   {  TreeItem = NodePtr->Item;
      ptrType DelPtr = NodePtr;
      NodePtr = NodePtr->RChildPtr;
      DelPtr->RChildPtr = NULL;  // defense
      delete DelPtr;
   }

   else 
      ProcessLeftmost(NodePtr->LChildPtr, TreeItem);
}  // end ProcessLeftmost

void bstClass::RetrieveItem(ptrType TreePtr, keyType SearchKey,
                            treeItemType& TreeItem,  bool& Success) const
{
   if (TreePtr == NULL)
      Success = false;  // empty tree

   else if (SearchKey == TreePtr->Item.Key())
   {  // item is in the root of some subtree
      TreeItem = TreePtr->Item;
      Success = true;
   }

   else if (SearchKey < TreePtr->Item.Key())
   // search the left subtree
      RetrieveItem(TreePtr->LChildPtr, SearchKey, TreeItem,
                                                   Success);

   else  // search the right subtree
      RetrieveItem(TreePtr->RChildPtr, SearchKey, TreeItem,
                                                   Success);
}  // end RetrieveItem


bstClass& bstClass::operator=(const bstClass& Rhs)
{
   if (this != &Rhs)
   {  DestroyTree(Root);  // deallocate left-hand side
      CopyTree(Rhs.Root, Root);  // copy right-hand side
   }  // end if
   return *this;
}  // end operator=

void bstClass::CopyTree(ptrType TreePtr,
                            ptrType& NewTreePtr) const
{
   // preorder traversal
   if (TreePtr != NULL)
   {  // copy node
      NewTreePtr = new treeNode(TreePtr->Item, NULL, NULL);
      assert(NewTreePtr != NULL);

      CopyTree(TreePtr->LChildPtr, NewTreePtr->LChildPtr);
      CopyTree(TreePtr->RChildPtr, NewTreePtr->RChildPtr);
   }  // end if
   else
      NewTreePtr = NULL;  // copy empty tree
}  // end CopyTree

void bstClass::DestroyTree(ptrType& TreePtr)
{
   // postorder traversal
   if (TreePtr != NULL)
   {  DestroyTree(TreePtr->LChildPtr);
      DestroyTree(TreePtr->RChildPtr);
      delete TreePtr;
      TreePtr = NULL;
   }  // end if
}  // end DestroyTree

ptrType bstClass::RootPtr() const
{
   return Root;
}  // end RootPtr

void bstClass::SetRootPtr(ptrType NewRoot)
{
   Root = NewRoot;
}  // end SetRoot

void bstClass::GetChildPtrs(ptrType NodePtr, ptrType& LeftPtr,
                                ptrType& RightPtr) const
{
   LeftPtr = NodePtr->LChildPtr;
   RightPtr = NodePtr->RChildPtr;
}  // end GetChildPtrs

void bstClass::SetChildPtrs(ptrType NodePtr, ptrType LeftPtr,
                                ptrType RightPtr)
{
   NodePtr->LChildPtr = LeftPtr;
   NodePtr->RChildPtr = RightPtr;
}  // end SetChildPtrs

void bstClass::Preorder(ptrType TreePtr,
                            functionType Visit)
{
   if (TreePtr != NULL)
   {  Visit(TreePtr->Item);
      Preorder(TreePtr->LChildPtr, Visit);
      Preorder(TreePtr->RChildPtr, Visit);
   } // end if
}  // end Preorder

void bstClass::Inorder(ptrType TreePtr,
                           functionType Visit)
{
   if (TreePtr != NULL)
   {  Inorder(TreePtr->LChildPtr, Visit);
      Visit(TreePtr->Item);
      Inorder(TreePtr->RChildPtr, Visit);
   } // end if
}  // end Inorder

void bstClass::Postorder(ptrType TreePtr,
                             functionType Visit)
{
   if (TreePtr != NULL)
   {  Postorder(TreePtr->LChildPtr, Visit);
      Postorder(TreePtr->RChildPtr, Visit);
      Visit(TreePtr->Item);
   } // end if
}  // end Postorder
// End of implementation file.
