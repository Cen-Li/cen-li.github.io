// Program Ounces converts ounces to cups, quarts, and gallons

/* 1 */ #include <iostream>
/* 2 */ using namespace std;

/* 3 */ const OUNCES = 9946;

/* 4 */ int main()
/* 5 */ {

/* 6 */   int cups;
/* 7 */   int quarts;
/* 8 */   int gallons;

/* 9 */   cups = OUNCES / 8;
/* 10 */  cout  << OUNCES  << " ounces is "  << cups
		        << " cups and  << OUNCES / 8  << " ounces.";
/* 11 */  quarts = cups % 2;
/* 12 */  cout << OUNCES  << " ounces is "  << quarts
		     << " quarts and "
		     << cups % 2 * 8 + OUNCES % 8  << " ounces .";
/* 13 */  gallons = OUNCES / 64
/* 14 */  cout  << OUNCES  << " ounces is "  << gallons
                << " gallong aand "  << OUNCES % 64  
                << " ounces.";
/* 15 */
/* 16 */}
  


