/*
  Course:      CSCI2170
  Description: This example illustrates the usage of 
               command line arguments
			   To run the program:
            a.out  number-of-scores(K)   score1  score2 ... scoreK 
*/

#include <iostream>
#include <cstdlib>  // exit() and atoi() functions  
#include <iomanip>
#include <cmath>
using namespace std;

// Maximum number of scores to use
const int SIZE = 30;

int main(int argc, char *argv[])
{
	int     numOfScores;	// number of scores to read and process
	float   scores[SIZE];// array of scores
	int    	i;    		// array index
	float	sum; 		// sum of all the scores
	float   average;	// average of all the scores
	float   sdv;        // standard deviation

	// check the provided command line arguments
	if (argc < 2)
	{
		cerr << "Too few command line arguments." << endl;
		cerr << "Run the program with :"
                << "a.out number-of-scores(K)  score1 score2 ... scoreK"<< endl;
		exit(-1);
	}
	else  // there are at least 2 command line arguments provided
	{
		numOfScores = atoi(argv[1]);

		// if there are less than specified number of scores provided, terminate the program
		if (argc < numOfScores+2) 
		{
			cerr << "Not enough scores provided." << endl;
			cerr << "Run the program with :"
                    	 << "a.out number-of-scores(K)  score1 score2 ... scoreK"<< endl;
			exit(-1);
		}
		else // command line has at least K scores provided
		{
			
			// store the scores in the scores array
			for (i=0; i<numOfScores; i++)
				scores[i] = atof(argv[2+i]);
		}
	}

	// Here is a good place to perform debugging to see the actual content of the "scores" array

	// compute the average score 
	sum=0.0;
	for (i=0; i<numOfScores; i++)
		sum += scores[i];
	if (numOfScores > 0)   // prevent division by zero 
		average = sum/numOfScores;

	// You may add other routines here to:
	// (1) sort the scores
	// (2) compute other statistics, i.e., standard deviation.
	float total;
	total = 0;
	for (i=0;i<numOfScores;i++)
		total=total + ((scores[i] - average)*(scores[i] -average));
	float stdev;
    	stdev = sqrt(total/numOfScores);

	float minscore, maxscore;
	
	minscore=scores[0];
	maxscore=scores[0];
	
	for(i=1;i<numOfScores;i++)
	{
		if (scores[i]>maxscore)
			maxscore=scores[i];
		if(scores[i]<minscore)
			minscore=scores[i];
	}
	
	// display output
	//this is the right answer
	if (numOfScores > 0) 
	{
		cout<<"argc = "<<argc<<endl;
		for (i=0;i<argc;i++)
			cout<<"argv["<<i<<"] = "<<argv[i]<<endl;
		
		cout<<endl;
		
		cout<<"There are "<<numOfScores<<" scores provided"<<endl;
		
		for(i=0;i<numOfScores;i++)
			cout<<"scores["<<i<<"] = "<<scores[i]<<endl;
		cout<<endl;
		cout<<"The highest score is "<<maxscore<<endl;
		cout<<"The lowest score is "<<minscore<<endl;
		cout<<endl;
	}
	
	
	//cout << "Total      " << numOfScores << " scores." << endl;
	if (numOfScores > 0)  // prevent underfined value or NAN to be displayed
	{
		cout << "Average is: " << setprecision(4) << average << endl;

		cout << "standard deviation is " << setprecision(3) << stdev << endl;
	}
	
	
	return 0;   
}

