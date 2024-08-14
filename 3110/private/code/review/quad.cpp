#include <iostream>
#include <cmath>
using namespace std;

int main() {
	
	float a, b, c;
	float root1, root2;
	float discriminant;
	
	// prompt to enter the parameters
	cout << "Enter a, b, and c paremeters for the equation:";
	cin >> a >> b >> c;
	
	// compute roots
	discriminant = pow(b, 2.0) - 4 * a * c;
	root1 = (-b + sqrt(discriminant)) / (2 * a);
	root2 = (-b - sqrt(discriminant)) / (2 * a);
	
	// Display result
	cout << "The roots are: " << root1 << " and " << root2 << endl;
	
	return 0;
}