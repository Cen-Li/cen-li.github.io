    int size=0;
    while (myIn>>name>>quantity) {
	index = LinearSearch(names, size, name);
	if (index>=0) {
		boxes[index] += quantity;
	}
	else {
		names[size] = name;
		boxes[size] = quantity;
		size ++;
	}
    }
