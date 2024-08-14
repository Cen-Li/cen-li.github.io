// Cen Li
// PlayerClass for OLA assignment in CSCI 2170

#include "PlayerClass.h"
#include <cstdlib>
#include <iomanip>

PlayerClass::PlayerClass()
{
	count=0;
	score=0;
}

void PlayerClass::AddCard(CardStruct c)
{
	hand[count]=c;	
	count++;
}

void PlayerClass::DisplayCards()
{
    int i;              //loop index
	
	cout << setw(2) << "#";
    cout << setw(7) << "SUIT";
    cout << setw(14) << "VALUE";
    cout << setw(14) << "POINTS" << endl;

    //This for loop prints the user's cards in hand
    for(i=0; i<count; i++)
    {
        //Using enum type switch expression
        //Print values of each card
        //if the value is 11, then print J.
        //if the value is 12, then print Q.
        //if the value is 13, then print K.
        //if the value is 14, then print A.
        //Then print point of each card
        switch (hand[i].suit)
        {
			case DIAMOND:
				cout << setw(2) << i+1;
                cout << setw(9) << "Diamond";
                if(hand[i].value==14)
                    cout << setw(10) << "A";
                else if(hand[i].value==11)
                    cout << setw(10) << "J";
                else if(hand[i].value==12)
                    cout << setw(10) << "Q";
                else if(hand[i].value==13)
                    cout << setw(10) << "K";
                else
                    cout << setw(10) << hand[i].value;
                cout << setw(14) << hand[i].points;
                cout << endl;
                break;

            case CLUB:
				cout << setw(2) << i+1;
                cout << setw(7) << "Club";
                if(hand[i].value==14)
                    cout << setw(12) << "A";
                else if(hand[i].value==11)
                    cout << setw(12) << "J";
                else if(hand[i].value==12)
                    cout << setw(12) << "Q";
                else if(hand[i].value==13)
                    cout << setw(12) << "K";
                else
                    cout << setw(12) << hand[i].value;
                cout << setw(14) << hand[i].points;
                cout << endl;
                break;

            case HEART:
				cout << setw(2) << i+1;
                cout << setw(8) << "Heart";
                if(hand[i].value==14)
                    cout << setw(11) << "A";
                else if(hand[i].value==11)
                    cout << setw(11) << "J";
                else if(hand[i].value==12)
                    cout << setw(11) << "Q";
                else if(hand[i].value==13)
                    cout << setw(11) << "K";
                else
                    cout << setw(11) << hand[i].value;
                cout << setw(14) << hand[i].points;
                cout << endl;
                break;
                
            case SPADE:
				cout << setw(2) << i+1;
                cout << setw(8) << "Spade";
                if(hand[i].value==14)
                    cout << setw(11) << "A";
                else if(hand[i].value==11)
                    cout << setw(11) << "J";
                else if(hand[i].value==12)
                    cout << setw(11) << "Q";
                else if(hand[i].value==13)
                    cout << setw(11) << "K";
                else
                    cout << setw(11) << hand[i].value;
                cout << setw(14) << hand[i].points;
                cout << endl;
                break;
        }
    }
    cout << endl;
}

CardStruct PlayerClass::FollowOneCard(CardSuitType s)
{
	bool found = false;
	int i, j;
	int randNum;
	CardStruct tmp;
	
	// search to see if the player has card of suit s
	for (i=0; !found&&i<count; i++)
	{
		if (hand[i].suit == s)
		{
			found = true;
			break;
		}
	}
  
	if (found)   // player has the same suit card
	{
		tmp = hand[i]; // plays the first card of suit s
    
		// remove the card from the hand
		for (j=i; j<count-1; j++)
			hand[j] = hand[j+1];   
	}
	
	// no same suit card, play the random card in the player's hand
	// and then shifts other cards above randNum up one position
	else
	{
		randNum = rand() % count;
		tmp = hand[randNum];
		
		for(int k=randNum; k<count; k++)
			hand[k] = hand[k+1];
	}
	count --;

	return tmp;
}

CardStruct PlayerClass::StartOneHand()
{
    // When it is the computer player's turn to play
    // he always picks the random card to play
    CardStruct tmp;
	
	int randNum;
	
	//if the hand is full, pick 2 of CLUB for a first round of the game
	if(count == 13)
	{
		//this for loop finds 2 of CLUB
		for(int i=0; i<count; i++)
		{
			//if found, return 2 of CLUB
			if(hand[i].suit == CLUB && hand[i].value == 2)
			{
				tmp=hand[i];
				
				//Since 2 of CLUB is in the middle of the player's hand
				//this for loop shifts other cards up one position
				for(int k=i; k<count; k++)
					hand[k] = hand[k+1];
				
				count--;
				return tmp;
			}
		}
		
	}
	
	// If there are still one or more cards in the player's hand,
	// return the random card in the player's hand,
	// shifts other cards above randNum up one position 
	// and reduce the number of cards remaining in hand by 1
    if (count > 0)
	{
		randNum = rand() % count;
		tmp = hand[randNum];
		
		for(int k=randNum; k<count; k++)
			hand[k] = hand[k+1];
		
		count--;    // card is decremented by one;
		return tmp;
	}
    else
	{
        cout << "The player does not have cards left" << endl;
        exit(-1);
    } 
}

bool PlayerClass::IsFirstLead()
{
	bool lead=false;
	
	//this for loop finds if the player has 2 of Club
	for(int i=0; i<count; i++)
	{
		if(hand[i].suit == CLUB && hand[i].value == 2)
			lead = true;
	}
	
	return lead;
}

int PlayerClass::GetScore()
{
	return score;
}

void PlayerClass::AddScore(int s)
{
	score = score + s;
}

CardStruct PlayerClass::PlaySelectedCard(int choice)
{
	CardStruct tmp;
	
	//Assigns a card of user's choice to tmp
	tmp = hand[choice-1];
	
	//remove a card of user's choice from the user's hand
	for(int i=choice-1; i<count; i++)
		hand[i] = hand[i+1];
	
	count--;
	
	return tmp;
}

int PlayerClass::GetCount()
{
	return count;
}

bool PlayerClass::IsValidChoice(CardSuitType s, int choice)
{
	bool available = true;
	
	//if the user's choice matches with the leading suit return true
	if(hand[choice-1].suit == s)
		return true;
	
	//else, if the user has any card of the leading suit,
	//then the choice is not valid
	else
	{
		for(int i=0; i<count; i++)
		{
			if(hand[i].suit == s)
				available = false;
		}
	}
	
	return available;
}

void PlayerClass::SortCards()
{
	//bubble sort
    bool sorted=false;				//is the list sorted?
    int last=MAX_PLAYER_CARDS-1;	//start last at the last array element
    int i;							//loop index
	CardStruct temp;

    while(!sorted)
    {
        sorted=true;
        for(i=0; i<last; i++)
        {
            if((hand[i].suit > hand[i+1].suit) || 
               (hand[i].suit == hand[i+1].suit)&&(hand[i].value > hand[i+1].value))
            {
                temp=hand[i];
				hand[i]=hand[i+1];
				hand[i+1]=temp;
                sorted=false;
            }
        }
        last--;
    }
}
