//******************************************************
//               AVL tree node
// ******************************************************
template <class T>
class AVLTree;

// inherites the TreeNode class
template <class T>
class AVLTreeNode:public TreeNode<T>
{
private:
	// additional data member needed by AVL tree node
	int balanceFactor;

	// used by AVLTree class methods to allow assignment
	// to a TreeNode pointer without casting
	AVLTreeNode<T>*& Left();
	AVLTreeNode<T>*& Right();

Public:
	AVLTreeNode(const  T&item, AVLTreeNode<T> *lptr=NULL, AVLTreeNode<T> *rptr=NULL, int balfac=0);
	
	// methods that return left/right TreeNode pointers as 
	// AVL TreeNode pointers; handles casting for the client
	AVLTreeNode<T>* Left() const;
	AVLTreeNode<T> *Right() const;

	// AVLTree methods needs access to left and right
	friend class AVLTree<T>;
};

// return a reference to left after casting it to an 
// AVLTreeNode pointer. Use to change left
template<class T> AVLTreeNode<T>*&AVLTreeNode<T>::Left()
{
	return (AVLTreeNode<T>*)left;
}

// return a reference to right after casting it to an AVLTreeNode pointer. 
// use to change right
template<class T>AVLTreeNode<T>* &AVLTreeNode<T>::Right()
{
	return(AVLTreeNode<T>*)right;
}

// constructor; initialize balanceFactor and the base class
// default pointer values NULL initialize node as a leaf node
template <class T> AVLTreeNode<T>::AVLTreeNode(const T&item, 
AVLTreeNOde<T> *lptr, AVLTreeNode<T> *rptr, int balfac):
TreeNode<T>(item, lptr, rptr), balanceFactor(balfac)
{}
//return left after casting it to an AVLTreeNode pointer
template<class T> AVLTreeNode<T>*AVLTreeNode<T>::Left() const
{
	return (AVLTreeNode<T> *)left;
}

// return right after casting it to an AVLTreeNode pointer
template <class T>
AVLTreeNode<T>* AVLTreeNode<T>::Right() const
{
	return (AVLTreeNode<T> *)right;
}

template<class T>
AVLTreeNode<T>::GetBalanceFactor()
{
	return balanceFactor;
}
 
