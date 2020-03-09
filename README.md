# StateManagement based BlackJack 21 Game

Instead of a complete OOP or a complete FP approaches, I used an hybrid version of them.
Players and Game are constructed as Objects and they are basically instances of `StoreNode`
class.

## Why State Management?

I would basically create bunch of classes according to the needs of the application, and store 
all related date in their properties. Instead, I used State Management approach to keep
particular main objects, such as Player and Game, consistent, SOLID, and Testable. Also, State
Management approach supports the Separation of Concern with the power of Action and Getter functions.
Last but not least, since the state is local to the owning `StoreNode` instance, you can easily implement
immutability on them to keep the code even more reliable and maintainable. 

Besides all of these general benefits of the StateManagement approach, I used it for another reason: 
make the game extensible. Since rules of the game can vary from casino to casino, and even some other
functionality can come into the game too, you can easily use Action classes to override functionality
of the game. 

For instance, to implement Split functionality, you need two different hands for 
the current player. But while split is active, you should, somehow, handle two different hands in the 
same state and also change the functionality of Hit action. This violates Open/Closed principle. With the 
`Action` class approach, you can override current actions in a way that, until you change it back to normal,
all hit actions would dispatch your Split action with a parameter of actual action (like 'hit' or 'stand') 
and then you can handle all these action in an isolated class. Once you are done with the split, then you can
restore the old (defult) actions to continue normal playing.

This is just an idea, not a perfect solution. With a decent implementation of StateManagement and perfect
immutability, it can be solved in even better way.

Also, I used the power of Functional Programming to break all functions into small, reusable, composable, 
non-side-effect, and testable pieces. I am not an expert in FP, so the solution might not be perfect. I just
wanted to try to look at the development of this kind of game from a different angle.
