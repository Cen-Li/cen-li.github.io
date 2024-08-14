
// Name: GoNorth
// Function: Exploring along north 
// Precondition: Maze created, Creature created
// Postcondition: Creature moved north if position clear
void GoNorth(MazeClass & maze, CreatureClass & creature, bool& success)
{
	Coordinate location;		// Position of creature in maze
	Coordinate next;			// Position to move to from current position
	Coordinate exit;			// Position of exit from maze
	
	// Get location
	location = creature.GetLocation();

	// Get exit
	exit = maze.GetExit();
	
	// Get square north of location
	next.col = location.col;		// Same column
	next.row = location.row - 1;	// Row north of current

	// If square to the north is clear, in the maze, and unvisited
	if(maze.IsInMaze(next) && maze.IsClear(next) && !(maze.IsVisited(next)))
	{
		// Mark as path
		maze.MarkPath(location);

		// Move to square
		creature.MoveUp();

		// Check if at exit now
		if(maze.IsExit(next))
		{
			// Done!
			maze.MarkPath(next);
			success = true;
		}
		// Not done. Explore recursively
		else
		{
			// Try to going north
			GoNorth(maze, creature, success);

			// If failed try west
			if(!success)
			{
				// Try to move west
				GoWest(maze, creature, success);

				// If failed try east
				if(!success)
				{
					// Try to move east
					GoEast(maze, creature, success);

					// If failed. Backtrack
					if(!success)
					{
						// Mark as visited
						maze.MarkVisited(next);

						// Move back -- retracing the previous movement "MoveUp"
						creature.MoveDown();
					}
				}
			}
		}
	}
	// Can't move, action failed
	else
	{
		success = false;
	}
	
	return;	
}

