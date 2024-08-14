// count the number appearance of individual characters appearing in 
// a line of text entered
#include <iostream>
#include <string>
using namespace std;

const int SIZE=26;
int main()
{
    string text;
    int    freq[SIZE];

    cout << "Enter text: ";
    getline(cin, text);

    // initialize the array
    for (int i=0; i<SIZE; i++)
		freq[i] = 0;

    // count the appearance of each character
    for (int i=0; i<text.length(); i++) {
	if ((text[i] >= 'a'  && text[i] <= 'z') ||
	    (text[i] >= 'A' && text[i] <= 'Z')) {
		text[i] = tolower(text[i]);
		freq[text[i]-'a'] ++;
	}
    }

    for (int  i=0; i<SIZE; i++) {
	cout << char (i + 'a') << " : " << freq[i] << endl;
    }

    return 0;
}
