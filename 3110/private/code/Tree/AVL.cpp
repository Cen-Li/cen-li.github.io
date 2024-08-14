
// *****************************************************
//                   AVL Tree class
// *****************************************************
const int leftheavy = -1;
const int balanced = 0;
const int rightheavy = 1;

template <class T>
class AVLTree:public BSTClass<T>
{
private :
	AVLTreeNode<T> * GetAVLTreeNode(const T&item, AVLTreeNode<T> *lptr, 
				AVLTreeNode<T>*rptr);
	AVLTreeNode<T>*CopyTree(AVLTreeNode<T>*t);

	Void SingleRotateLeft(AVLTreeNode<T>* & p);
	Void SingleRotateRight(AVLTreeNode<T>* &p);
	Void DoubleRotateLeft(AVLTreeNode<T>* &p);
	Void DoubleRotateRight(AVLTreeNode<T>* &p);

	Void UpdateLeftTree(AVLTreeNode<T>* & tree, int &reviseBalanceFactor);
	Void UpdateRightTree(AVLTreeNode<T>* &tree, int &reviseBalanceFactor);

	// general insert and delete methods
	void AVLInsert(AVLTreeNode<T>* &tree, AVLTreeNode<T>* newNode, 
int &reviseBalanceFactor);
	void AVLDelete(AVLTreeNode<T> * &tree, AVLTreeNode<T>*newNode, 
int &reviseBalanceFactor);

public:
	AVLTree();
	AVLTree(const AVLTree<T>&tree);

	AVLTree<T>&operator=(const AVLTree<T> &tree);
	
	virtual void Insert(const T &item);
	virtual void Delete(const T &item);
};

// allocate an AVLTreeNode; terminate the program on a memory allocation error
template <class T>
AVLTreeNode<T> *AVLTree<T>::GetAVLTreeNode(const T&item, AVLTreeNode<T>*lptr, AVLTreeNode<T> *rptr)
{
	AVLTreeNode<T> * p;

	P = new AVLTreeNode<T> (item, lptr, rptr);
	if (p == NULL)
	{
		cerr << "Memory allocation failure!" << endl;
		exit (1);
	};
	return p;
}

template<class T>
AVLTreeNode<T>*AVLtree<T>::CopyTree(AVLTreeNode<T> *t)
{
	AVLTreeNode<T> *newlptr, *newrptr, *newNode;
	if (t==NULL)
		return NULL;

	if (t->Left() != NULL)
		newlptr = CopyTree(t->Left());
	else
		newlptr = NULL;

	if (t->Right() !=NULL)
		newrptr = CopyTree(t->Right());
	else
		newrptr = NULL;

	newNode = GetAVLTreeNode(t->data, newlptr, newrptr);
	return newNode;
}

template<class T>
AVLTree<T>::AVLTree(const AVLTree<T>&tree)
{
	root = (TreeNode<T>*)CopyTree((AVLTreeNode<T>*)tree.root);
	current = root;
	size=tree.size;
}

template<class T>
AVLTree<T>::AVLTree<T>::operator=(const AVLTree<T>&tree)
{
	ClearList();
	root = (TreeNode<T>*)CopyTree((AVLTreeNode<T>*)tree.root);
	current = root;
	size=tree.size;
	return *this;
}

template <class T>
void AVLTree<T>::SingleRotateRight(AVLTreeNode<T>*&p)
{
	// the left subtree of p is heavy
	AVLTreeNode<T> *lc;
	
	// assign the left subtree to lc
	lc = p->Left();

	//update the balance factor for parent and left child
	p->balanceFactor = balanced;
	lc->balanceFactor = balanced;

	// any right subtree of lc must continue as right subtree
	// of lc. Do this by making it a left subtree of p
	p->Left() = lc->Right();

	//rotate p (larger node)into right subtree of lc
	// make lc the pivot node
	lc->Right() = p;
	p=lc;
}

// Write SingleRotateLeft()  method here

// double rotate right about node p
template <class T>
void AVLTree<T>::DoubleRotateRight (AVLTreeNode<T>*&p)
{
	// two subtrees that are rotated
	AVLTreeNode<T> *lc, *np;

	// in the tree, node(lc) < node(np) < node(p)
	lc = p->Left();  // lc is left child of parent
	np = lc->Right();  // np is right child of lc

	// update balance factors for p, lc, and np
	if (np->balanceFactor == rightheavy)
	{
		p->balanceFactor=balanced;
		lc->balanceFactor = leftheavy;   
	}
	else if (np->balanceFactor == balanced)
	{	
		p->balanceFactor = balanced;
		lc->balanceFactor = balanced;
	}
	else
	{
		p->balanceFactor = rightheavy;
		lc->balanceFactor = balanced;

	}
	np->balanceFactor = balanced;

	// before np replaces the parent p, take care of subtrees 
	// detach old children and attach new children
	lc->Right() = np->Left();
	np->Left() = lc;
	p->Left() = np->Right();
	np->Right() = p;
	p = np;
}

// Write Double RotateLeft() method here

template <class T>
void AVLTree<T>::UpdateLeftTree(AVLTreeNode<T>*&p, int &reviseBalanceFactor)
{
	AVLTreeNode<T> *lc;
	
	lc = p->Left(); // left subtree is also heavy
	if (lc->balanceFactor == leftheavy)
	{
		SingleRotateRight(p);  // need a single rotation
		reviseBalanceFactor = 0;
	}
	// is right subtree heavy?
	else if (lc->balanceFactor==rightheavy)
	{
		// make double rotation
		DoubleRotateRight(p);
		// root is now balanced
		reviseBalanceFactor = 0;
	}
}

template<class T>
void AVLTree<T>::UpdateRightTree(AVLTreeNode<T>*&p, int &reviseBalanceFactor)
{
	AVLTreeNode<T> *rc;
	Rc = p->Right();
	If (rc->balanceFactor == rightheavy)
	{	
		SingleRotateLeft(p);
		reviseBalanceFactor=0;
	}
	else if (rc->balanceFactor == leftheavy)
	{
		DoubleRotateLeft(p);
		reviseBalanceFactor=0;
	}
}

// insert a new node using the basic List operation and format
template <class T>
void AVLTree<T>::Insert(const T &item)
{
	// declare AVL tree node pointer using base class method
	// GetRoot, cast to larger node and assign root pointer
	AVLTreeNode<T>*treeRoot = (AVLTreenode<T>*)GetRoot(), *newNode;

	// flag used by AVLInsert to rebalance nodes
	int reviseBalanceFactor = 0;

	// get a new AVL tree node with empty pointer fields
	newNode=GetAVLTreeNode(item, NULL, NULL);

	AVLInsert(treeRoot, newNode, reviseBalanceFactor);

	// assign new values to data members root, size
	// current in the base class
	root = treeRoot;
	current = newNode;
	size ++;
}


template<class T>
void AVLTree<T>::AVLInsert(AVLTreeNode<T>* &tree, AVLTreeNode<T>*newNode, 
int & reviseBalanceFActor)
{
	// flag indicates change node?s balance factor will occur
	int rebalanceCurrNode;

	// scan reaches an empty tree; time to insert the new node
	if (tree == NULL)
	{
		// update the parent to point at newNode
		tree = newNode;
	
		// assign balanceFactor = 0 to newNode
		tree->balanceFactor = balanced;

		// broadcast message; balanceFactor value is modified
		reviseBalanceFactor = 1;
	}
	
	// recursively move left if new data < current data
	else if (newNode->data < tree->data)
	{
		AVLInsert(Tree->Left(), newNode, rebalanceCurrNode);

		// check if balance Factor must be updated
		if (rebalanceCurrNode)
		{
			// case 3: went left from node that is already heavy
			// on the left. Violates AVL condition; rotate
			if (tree->balanceFactor == leftheavy)
				UpdateLeftTree(tree, reviseBalanceFactor);

			// case 1: moving left from balanced node resulting 
// node will be heavy on left
else if  (tree->balanceFactor == balanced)
{
	tree->balanceFactor = leftheavy;
	reviseBalanceFactor = 1;
}
	
// case 2: scanning left from node heavy on the right. 
// Node will be balanced

else
{
	tree->balanceFactor = balanced;
	reviseBalanceFactor = 0;
}
 		    }
		    else
			// no balancing occurs, do not ask previous nodes
			reviseBalanceFactor = 0;
	}
	// otherwise recursively move right
	else
	{
		AVLInsert(tree->Right(), newNode, rebalanceCurrNode);
		// check if balanceFactor must be updated
		if (rebalanceCurrNode)
		{
			// case 2: node becomes balanced
			if (tree->balanceFactor == leftheavy)
			{
				// scanning right subtree. Node heavy on left
				// the node will become balanced
				tree->balanceFactor = balanced;
				reviseBalanceFactor = 0;
			}
			// case 1: node is initially balanced
			else if (tree->balanceFactor == balanced)
			{
				// node is balanced; will become heavy on right
				tree->balanceFactor = rightheavy;
				reviseBalanceFactor = 1;
			}
			else
				// case 3: need to update node
				// scanning right from a node already heavy on
				// the right, this violates the aVL condition
				// and rotations are needed.
				UpdateRightTree(tree, reviseBalanceFactor);
		}
		reviseBalanceFactor = 0;
	}
}

// spacing between levels
const int INDENT_AVL_BLOCK=6;

// inserts num blanks on the current line
void IndentAVLBlanks(int num)
{
	for (int i=0; i<num; i++)
		cout << "  ";
}

// print AVL tree sideways using an RNL tree traversal
template <class T>
void AVLPrintTree(AVLTreeNode<T> *t, int level)
{
	// print tree with root t, as long as t != NULL
	if (t != NULL)
	{
		// print right branch of AVLTree t
		AVLPrintTree(t->Right(), level+1);
		
		// indent. Output node data and balance factor
		IndentAVLBlanks(INDENT_AVL_BLOCK*level);
		cout << t->data << ":" << t->GetBalanceFactor() << endl;
		
		// print left branch of AVLTree t
		AVLPrintTree(t->Left(), level+1);
	}
}

