# StateManagement based BlackJack 21 Game

## How to Run
Simply run `npm i` then `npm start`.

## How to Play
When the game starts, it will show you Dealer's and Player's (Your) hand, 
then you will decide either Hit or Stand. To hit, press 'h' , to stand press 's',
then press 'Enter'. 

Instead of a complete OOP or a complete FP approaches, I used an hybrid version of them.
Players and Game are constructed as Objects and they are basically instances of `StoreNode`
class.

## Structure
It all starts in index.js file but the iron horses of the game are `StoreNode` objects. These
objects are basically use Actions and Getters to manage their functionality and use their state
object to store some needed data related to their functionality.

To make it pure and non-side-effect, I tried to use small functions for everything. They are called, helpers.
So basically, you create your master pieces of the game as StoreNodes and use Functional Programming aproach
for the rest.

I could also store all the StoreNodes in one master object to make it possible for StoreNodes to interact each 
other but I did it like this for now.

All the structure is documented in their files. Feel free to check them.

## Why State Management?

I would basically create bunch of classes according to the needs of the application, and store 
all related data in their properties. Instead, I used State Management approach to keep
particular main objects, such as Player and Game, consistent, SOLID, and Testable. Also, State
Management approach supports the Separation of Concern with the power of `Action` and `getter` functions.
Last but not least, since the `state` is local to the owning `StoreNode` instance, you can easily implement
better immutability on them to keep the code even more reliable and maintainable. For now I used simply 
Object.assign or destructuring.

Besides all of these general benefits of the StateManagement approach, I used it for another reason: 
make the game extensible. Since rules of the game can vary from casino to casino, and even some other
functionality can come into the game too, you can easily use `Action` classes to override functionality
of the game. 

For instance, to implement Split functionality, you need two different hands for 
the current player. But while split is active, you should, somehow, handle two different hands in the 
same state and also change the functionality of Hit action. Or let's say instead of State Management
you had complete OOP aproach and you had a Player class to handle hit functionality. To add Split,
you would have to add another function Split and store a flag the Split state and reuse Hit method
of the player to continue hitting. But this violates Open/Closed principle. With the `Action` class 
approach, you can override current actions in a way that, until you change it back to normal,
all hit actions would dispatch your Split action with a parameter of actual action (like 'hit' or 'stand') 
and then you can handle all these action in an isolated class. Once you are done with the split, then you can
restore the old (defult) actions to continue normal playing.

This is just an idea, not a perfect solution. With a decent implementation of StateManagement and perfect
immutability, it can be solved in even better way.

Also, I used the power of Functional Programming to break all functions into small, reusable, composable, 
non-side-effect, and testable pieces. I am not an expert in FP, so the solution might not be perfect. I just
wanted to try to look at the development of this kind of game from a different angle.
