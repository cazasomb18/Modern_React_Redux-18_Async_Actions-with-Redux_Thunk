/////////////////////////////////////////////////////////////////////////////////////////////////////
//ASYNC ACTIONS WITH REDUX THUNK

//App Overview and Goals
	//THIS APP IS GOING TO BE A BIT PLAIN
		//... for a very good reason

	//The purpose of this app is to learn more about redux because we're still at the upper curve
	//off the master/time chart with Redux...

	//App Goals
		//Absolutely understand the purpose of reducers
		//Absolutely understand making API Requests with Redux
		//Absolutely understand the purpose of 'redux-thunk'
			//redux-thunk --> MIDDLEWARE!

	//App Overview:
		//We're going to be rendering a list of blogs posts on screen from an outside api
		//Blog posts will include:
			//Icon
			//Post Title
			//Body of post
			//Author name

		//Components
			//PostList - renders the entire list of blog posts
			//UserHeader - render author's name (purpose will be more clear later)

		//Blog data
			//We'll be making an axios request to fetch the blog data from api JSONPlaceholder

			//api documentation: jsonplaceholder.typicode.com/
				//Resources > POSTS
					//post data keys:
						//userId
						//id
						//title
						//body

				//Resources > USERS
					//users data keys:
						//id
						//name
						//email
						//address
							//street
							//city
							//zipcode
							//geo
								//lat
								//lng
						//phone
						//website
						//company
							//name
							//catchPhrase
							//bs

		//==> due to these two different endpoints we'll have to make 2 AXIOS REQUESTS
			//terminal command: npx create-react-app blog
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Initial App Setup

	//we're going to install some additional dependencies into this application:
		//unix command:
			//npm install --save redux react-redux axios redux-thunk
				//redux - actual redux library
				//react-redux - integration layer between react and redux libraries
				//axios - use for network requests
					//not strictly required but it's a lot easier to just make use of axios
				//redux thunk - middleware to help us make requests in a redux application

	//Now let's clear the src file and fill in all necessary boilerplate:
	// src, index.js:
		import React from 'react';
		import ReactDOM from 'react-dom'
		import { Provider } from 'react-redux';
		import { createStore } from 'redux';

		import App from './components/App';
		import reducers from './reducers';


		ReactDOM.render(
			<Provider store={createStore(reducers)}>
				<App/>
			</Provider>,
			document.querySelector('#root'));

	// now we'll create the App.js in src directory:
		import React, { Component } from 'react';

		const App = () => {
			return <div className="ui container">App</div>
		};

		export default App;
/////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////////////
//Tricking Redux with 'DUMMY' Reducers

	//in reducers/index.js:
		import { combineReducers } from 'redux';

		export default combineReducers({});
		//App renders but we now have an error/warning message 
			//store does not have a valid reducer:
				//this happens frequently when you're getting started on a redux project:
					//maybe we don't want to work on our reducers with now?  so what's the work around?
						//trick, insideCombineReducers call we can do this:
							export default combineReducers({
								replaceMe: () => 9
							});
						//--> this ^^^ gets rid of the error message so you can continue buliding
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//A Touch More Setup
	//GOALS:
		//We'll start putting togther the <PostList/>
		//We'll then create an action creater to fetch the data we want

	//create class-based comp PostList in components dir:
		import React from 'react';

		const PostList = () => {
			return <div>PostList</div>
		};

		export default PostList;

	//And wire it up to the <App/>:
		import PostList from './PostList';

		const App = () => {
			return (
				<div className="ui container">
					<PostList/>
				</div>
			);
		};
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//How to Fetch Data in a Redux App
	//GOAL: understand how we load up data into our redux application from an outside API

	//FLOW OF DATA FETCHING WITH AXIOS
		//Render some component on the screen (in this case: <PostList/>)
			//needs list of posts from JSON api to show itself correctly
		//Component's 'componentDidMount' lifecycle method get called
		//We call action creator from 'componentDidMount'
			//COMPONENTS ARE GENERALLY RESPONSIBLE FOR FETCHING DATA THEY NEED BY CALLING AN ACTION CREATOR
		//Action creator runs code teo make an API request
		//API responds with data
		//Action creator returns 'action' with fetch data on the 'payload' property
			//ACTION CREATORS ARE RESPONSIBLE FOR MAKING API REQUESTS
				//THIS IS WHERE REDUX-THUNK COMES INTO PLAY
		//Some reducer sees the action, returns the data off the 'payload'
		//Because we generated some new state object, redux/react-redux cause our app to get rerendered
			//WE GET FETCHED DATA INTO A COMPONENT BY GENERATING NEW STATE IN OUR REDUX STORE, THEN 
			//GETTING THAT INTO OUR COMPONENT THROUGH mapStateToProps
			//now inside state object we have our list of posts
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Wiring Up an Action Creator

	//create actions/index.js in components directory:
	//in src/actions/index.js:
		export const fetchPosts = () => {
			return {
				type: 'FETCH_POSTS'
			};
		};

	//now in PostList.js:
		import React from 'react';
		import { connect } from 'react-redux';
		import { fetchPosts } from '../actions';

		class PostList extends React.Component {
			render(){
				return <div>PostList</div>
			}
		};

		export default PostList;

	//export statement in PostLIst.js:
		export default connect(
			null,
			{ fetchPosts }
		 )(PostList);

	 //Now we want to call the method in CDM:
	 class PostList extends React.Component {
			render(){
				return <div>PostList</div>
			}
		 componentDidMount(){
				this.props.fetchPosts();
			}
		};
		//NEXT we'll wire up our request to the JSONPlaceholder API
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Making a Request from an Action Creator
	//We've completed these steps:
		//Render some component on the screen (in this case: <PostList/>)
		//Component's 'componentDidMount' lifecycle method get called
		//We call action creator from 'componentDidMount'

	//GOAL:
		//Make the action creator has some code in it to make a request to the api and get some data

	//We're going to preconfigure axios to make a request to the JSONPlaceholder API
	//Create src/apis directory and place jsonPlaceholder.js inside:

	//in jsonPlaceholder.js:
		import axios from 'axios';

		export default axios.create({
			baseURL: 'http://jsonplaceholder.typicode.com'
		});

	//Import jsonPlaceholder into actions/index.js, invoke request, declare response, add to payload:
		import jsonPlaceholder from '../apis/jsonPlaceholder';

		export const fetchPosts = async () => {
			const response = await jsonPlaceholder.get('/posts');

			return {
				type: 'FETCH_POSTS',
				payload: response
			};
		};
		/////THIS IS A BAD APPROACH: NOTE THE ERROR WE GET WHEN WE TRY TO RUN THIS:
			//Error: Actions must be plain objects. Use custom middleware for async actions.
				//We will eventually solve this with Redux-Thunk
					//you'll see this error message A LOT
						//if you understand where it comes from it'll make your life MUCH EASIER!
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Understanding Action Creators

	//What's wrong with 'fetchPosts'??
		//Actions creators must return plain JS object with a type-property: WE ARE NOT!
		//By the time our action gets to a reducer, we won't have fetched our data!

	//We aren't returning a plain JS object w/ a type property:
		//in babeljs.io > tryitout copy + paste  the entire fetchposts() from 'const' (turn on all presets:
			//you'll see that b/c of the "async await" syntax the code gets transformed into this massive
			//complicated block of crap
		//When you remove async await, then it goes back to what it should be.


	//PostList.js
		//CDM()
			//this.props.fetchPosts()
								//===>
								//Probably Happening in React-Redux:
									//store.dispatch(
										//fetchPosts()
									//)  ===>
										//actions/index.js
											//export const fetchPosts = async() => {
												//case 0:
													//return jsonPlaceholder.get('/posts')
												//case 1:
													//return {type: 'FETCH_POSTS', payload: response };
											// }
										//HERE WE'RE RETURNING THE REQUEST OBJECT, NOT THE js{type,payload}
											//this is all due to the async await syntax
	//===> ISSUE 1: action creators must return plain JS objects with a type-property
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//More on Async Action Creators
	//So b/c this is all caused by the async await syntax we may assume that we can simple remove those kws
		//However, when we remove that syntax we get a promise to get some data in the future:
		//so let's try this, and prove that it doesn't work, in actions/index.js:
			export const fetchPosts = () => {
			//STILL A BAD APPROACH!!!!
			const promise = jsonPlaceholder.get('/posts');

			return {
					type: 'FETCH_POSTS',
					payload: promise
				};
			};
			//THIS WILL NOT WORK AS YOU EXPECT, WHY?

	//ISSUE 2: by the time our action gets to a reducer we won't have fetched our data!
		//this is why the syntax above WILL NOT WORK!
			//by the time we call our action creator, and it's dispatched to the reducer we still won't
			//have fetched our data b/c this happens in fractions of a millisecond

	//Here's what's going on behind the scenes:
		//Action Creator called 					Request Made to TypicodeAPI
		//Action Returned
		//Action Sent to All Reducers
		//Reducers Run
			// X data not here!! X
		//											WE GET THE RESPONSE!
					//THE REDUCERS HAVE ALREADY RUN AND THERE'S NOTHING WE CAN DO TO TELL IT
					//TO WAIT UNTIL THE DATA HAS BEEN RETURNED FROM THE ACTION CREATOR
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Middlewares in Redux
	
	//Now that we understand the problem we'll look at fixing fetchPosts(), remember:
		//Problem 1: we aren't returning a plain JS objects with a type-property
			//--> fixed
		//Problem 2: by the time our action gets to a reducer we won't have fetched our data!
			//--> need to install middleware that will allow us to use asychronous action creators

	//Synchronous action creator
		//--> instantly returns an action with data ready to go
			//--> action ready to be processed by REDUCERS
		//--> up until this point we have been writing SYNCHRONOUS ACTION CREATORS

	//Asynchronous action creator
		//--> Takes some amount of time for it to get its ready to dispatch 
			//--> whenever you have an action that requires a NETWORK REQUEST it will ALWAYS QUALIFY
			//	  as an ASYNC ACTION CREATOR
			//--> if you want to use ASYNC ACTION CREATORS in REDUX you have to install a MIDDLEWARE
					//--> allows us to deal with ASYNCHRONOUS ACTION CREATORS

	//What is a middleware? REDUX THUNK
		//Redux Thunk === middleware that will help us deal w/ asynchronous action creators

	//Remember the Redux Cycle:
		//ACTION CREATOR - called to change state of app - Produces an action...
			//-->ACTION - gets fed to dispatch...
				//-->DISPATCH - forwards action to middleware...
					//-->MIDDLEWARE - sends action to reducers...
						//-->REDUCERS - creates new state...
							//-->STATE - wait until we need to update state again
		//^^^ cycle begins agains when change to state is made ^^^

		//Now instead of the dispatch forwarding the action directly to the reducers, it's
		//handed off to the middlware which then sends that action to the reducers

		//MIDDLEWARE IN REDUX
			//Function that gets called with every action we dispatch
			//Has the ability to STOP, MODIFY or otherwise mess around with actions
				//i.e. middleware that console.logs every action that you dispatch
			//Tons of open source middleware exist
				//We aren't limited to these, we can easily write our own middleware and use them inside
				//of our Redux Store
			//Most popular use of middleware is for dealing with async actions
			//We are going to use a middleware called REDUX-THUNK to solve our async issues
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Behind the Scenes of Redux Thunk

	//Normal Rules around ACTION CREATORS
		//actions creators must return action objects
		//actions must have a 'type' property (plain JS object)
		//actions can optionally have a 'payload'

	//Rules around ACTION CREATORS with REDUX-THUNK
		//actions can return actions objects 
		//actions creators can also return FUNCTIONS!
			//--> IF YOU DO RETURN A FUNCTION, REDUX-THUNK will automatically call that function!
				//***THIS IS THE ONLY DIFFERENT RULE WITH REDUX-THUNK AROUND ACTION CREATORS!
		//if an action object gets returned, it must have a 'type'
		//if an action object gets returned, it can optionally have a 'payload'

	//REDUX THUNK FLOW
	//Action Creator --> return "SOMETHING" either an object or function
		//after we return 'something' to goes to redux thunk
				//REDUX-THUNK: hi 'something', are you a FUNCTION?
					//YES! --> 	great!  I'm going to call you with the DISPATCH AND 'getState' functions
								//Go ahead and 'dispatch' actions are your leisure
					//NO! --> passed the object to REDUCERS
						//--> REDUCERS

		//** redux-thunk does not involve itself at all if the action returned is a plain JS object,
			//--> will only do something if a FUNCTION is returned by the ACTION CREATOR

	//RETURNING A FUNCTION, in src/actions/index.js:
	import jsonPlaceholder from '../apis/jsonPlaceholder';

	export const fetchPosts = () => {
		return function(dispatch, getState){
		//since redux-thunk is going to call this returned function with dispatch and getState they
		//need to be included here as arguments
			const promise = jsonPlaceholder.get('/posts');

			return {
				type: 'FETCH_POSTS',
				payload: promise
			};
		}
	};
			//dispatch function - same one we've been talking about, can pass actions into the dispatch
			//function, will be sent through middlwares and eventually forwarded off to reducers
				//DISPATCH = unlimited power to initiate changes to data on the redux side of our app!

			//getState function - can be called on our redux store
				//-->will return ALL DATA INSIDE OUR REDUX STORE

				//These 2 arguments are unlimited power over our REDUX STORE
					//DISPATCH - can CHANGE any data we want
					//GETSTATE - can READ or ACCESS any data we want

	//OK - so inside this returned function we're trying to make an API request
		//We'll imagine that redux thunk invokes function w/ those 2 arguments (dispatch getState)
		//Inside this function we're going to WAIT until our request gets a response from the API
		//Once we have the response we're going to use the DISPATCH function to "manually" dispatch 
		//an ACTION
		//Now ACTION flow with DISPATCH and is NOW A PLAIN JS OBJECT
			//--> redux-thunk now see this object and do nothing and forward it to DISPATCH
		//normal redux cycle continues with REDUCERS creating new state from DISPATCH

	//check this redux-thunk source code out: github.com/reduxjs/redux-thunk
		//--> src > index.js:
			function createThunkMiddleware(extraArgument) {
			  return ({ dispatch, getState }) => (next) => (action) => {
			    if (typeof action === 'function') {
		    	//DID YOU JUST DISPATCH AN ACTION?  IF SO IS IT A FUNCTINO?
			      return action(dispatch, getState, extraArgument);
		      		//IF SO, RETURN ACTION, INVOKE WITH DISPATCH AND GET STATE
			    }

			    return next(action);
			    	//OK NOT A FUNCTION, JUST RETURN THE ACTION
			  };
			}
			const thunk = createThunkMiddleware();
			thunk.withExtraArgument = createThunkMiddleware;
			export default thunk;
			//^^^ this is all redux-thunk is ^^^ only about 6 lines actually do something
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Shortened Syntax with Redux Thunk

	//HOOKING UP MIDDLEWARE TO A REDUX STORE
		//even though redux-thunk is installed as a depenency, we have to wire it up to the REDUX STORE
	//In src/index.js, import thunk:
		import thunk from 'redux-thunk';
	//Also import applyMiddlware from redux - allows us to use middleware with Redux
		import { createStore, applyMiddleware } from 'redux';

	//So now we're going to make our code more legible by declaring store as a var and passing it
	//applyMiddlware(thunk) as the 2nd arg so we can use thunk:
		const store = createStore(reducers, applyMiddleware(thunk));

	//So that now we can cleanup the <Provider> to this:
		ReactDOM.render(
			<Provider store={store}>
				<App/>
			</Provider>,
			document.querySelector('#root'));

	//Now, let's focus on our ACTION CREATOR, in src/actions/index.js:

		import jsonPlaceholder from '../apis/jsonPlaceholder';
		export const fetchPosts = () => {
			//In the inner function we're returning an action, we don't need to do this, instead we want to 
			return async function(dispatch, getState){
				//async await: can use with redux-thunk, will only modify return values of inner function!
				const response = await jsonPlaceholder.get('/posts');

				//-->call dispatch and pass in our action object:
				dispatch({ type: 'FETCH_POSTS', payload: response })
			}
		};

		//TOTALLY FINE TO RETURN AN ACTION OBJECT!!
		export const selectPost = () => {
			return {
				type: 'SELECT_POST'
			}
		};

	//Ok so let's do a little bit of code clean-up w/ some ES2015 syntax:
		import jsonPlaceholder from '../apis/jsonPlaceholder';

		export const fetchPosts = () => async dispatch => {
			const response = await jsonPlaceholder.get('/posts');

			dispatch({ type: 'FETCH_POSTS', payload: response })
		};
			//remember () w/ a single arg are optional and return not needed when calling nesting
			//function calls, also we aren't using getState so that was removed as an arg

	//So now we understand how to create asynchronous action action creators we've done these steps:
		//Action Creator runs code to make API request
		//API responds with data
		//Action creator returns an 'action' with the fetched data on the 'payload' property
	//NEXT STEP WILL RESUME THE NORMAL REDUX FLOW:
		//REDUCER sees ACTION, returns the data off the 'payload'
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Rules of Reducers

	//GOALS:
		//We're going to create a seperate file for each or our reducers in the reducers directory
		//Then we'll import them to the src/reducers.index.js file
		//And wire them up to the combineReducers() call

	//Here's what reducer we're going to create does:
		//ACTION CREATOR (fetchPosts) fetches our posts...
			//--> Creator DISPATCHES an ACTION with a 'type' of 'FETCH_POSTS', and a 'payload' of reponse
				//POST REDUCER - responsible for watching for actions of 'type' 'FETCH_POSTS':
					//--> when reducer sees that type: 'FETCH_POSTS' it will pull off the response
					//and add it inside of an array

	//In src/recuers, create new file postsReducer.js, add this 'dummy' reducer:
		export default () => {
			return 123;
		};

	//Now wire it up to src/reducers/ index.js:
		import { combineReducers } from 'redux';
		import postsReducer from './postsReducer';

		export default combineReducers({
			posts: postsReducer
		});
/////////////////////////////////////////////////////////////////////////////////////////////////////

//RULES	 OF REDUCERS
	//1 - Must return 'any' value besides 'undefined'
	//2 - Produces 'state', or data to be used inside your app using only previous state and the action
	//3 - Must not return reach 'out of itself' to decide what value to return (reducers are pure)
	//4 - Must not mutate its input 'state' argument

/////////////////////////////////////////////////////////////////////////////////////////////////////
//Rules of Reducers - MUST RETURN AN VALUES BESIDES 'UNDEFINED' - REDUCER RULE 1
	//1 - Must return 'any' value besides 'undefined'
		//this is why we initially set up our 'dummy' reducer to return any value, like 123
		//Your reducer can NEVER return 'undefined'
	//2 - Produces 'state', or data to be used inside your app using only previous state and the action
	//3 - Must not return reach 'out of itself' to decide what value to return (reducers are pure)
	//4 - Must not mutate its input 'state' argument

/////////////////////////////////////////////////////////////////////////////////////////////////////
//Argument Values - REDUCER RULE NUMBER 2

	//2 - Produces 'state', or data to be used inside your app using only previous state and the action

	//FIRST TIME A REDUCER IS CALLED:
		//UNDEFINED 		ACTION #1
				//--> REDUCER
					//==> STATE V1
	
	//When you first start up redux, the reducer will be automatically invoked one time
		//allows us to specify some default state value
	//When called during that initializtion process it receives to arguments:
		//1st argument has value of undefined
		//2nd argument has an action object
			//it is up to the reducer to take these two arguments and return some initial state value

	//We went through this w/ the songs application, here's an example from the selectedSongReducer:
		const selectedSongReducer = (selectedSong = null, action) => {
			if (action.type === 'SONG_SELECTED') {
				return action.payload;
			}

			return selectedSong;
		};
			//when app started, up, this was invoked one time:
				selectedSongReducer(undefined, {type: 'NOT_YET_KNOWN'})
					//redux quickly realizes the first value is undefined so to circumvent that
					//we assign the selectSong an initial value of null
						//this takes place one time when the reducer is initially invoked
						//We will not always default this to null
							//sometimes it'll be a number, '', [], etc., it made sense here b/c
							//there's no currently selectedSong in our app

	//Things get interesting when the reducer is called for the 2nd time on...
		//Now, 1st arg !== undefined, instead it'll be whatever reducer returned last time it ran
		//Now 2nd time - 1st arg === STATEV1
			//This is what we mean by the 2nd rule that reducers produce state only using previous
			//state and action
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Pure Reducers - REDUCER RULE NUMBER 3
	//What do we mean by 'reducers are pure'? 
		//Anytime we call and reducer with an action and a state value we are not supposed to REACH
		//OUT of this function at all - can ONLY look @ previous state value ACTION OBJECT to decide
		//what to return:

	//So inside of our reducers we'll never do this:
		return document.querySelector('input');
			//or
		return axios.get('/posts');

	//The only thing we'll ever return will be some computation done on the two arguments:
		export default (state, action) => {
			return state + action
				//something here has to do some computation with only the state and action, that's it
		};
		//can only return values that have something to do with the input arguments
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Mutations in JavaScript - REDUCER RULE NUMBER 4

	//by convention we call the 1st arg in the reducer 'state':
		export default (state, action) => {};

	//RULE 4 - MUST NOT MUTATE ITS INPUT 'STATE' ARGUMENT:
		//SO WHAT DOES 'MUTATE' MEAN IN THE CONTEXT OF JAVASCRIPT?
			//--> 
		//example with [] in browser console:
			const colors = ['red', 'green'];
			//we can MUTATE this very easily a multitude of different ways with js...
				//add new element:
					colors.push('purple');
					//3 elements
				//remove element:
					colors.pop();
					//"purple" removed
					console.log(colors);
				//modify existing element:
					colors[0] = "pink";
					//colors[0] now = "pink"
			//==> all of these methods MUTATE an array

		//So now let's see some examples of MUTATIONS with JS OBJECTS {}:
				const profile = {name: 'Alex'}
				//profile === {name: "Alex"}
				profile.age = 30;
				//profile === {name: "Alex", age: 30}

	//MUTATING on an OBJECT {} is defined as - 
		//UPDATING a value
		//ADDING k-v pair
		//REMOVING a k-v pair

	//This means that in our reducer we do nothing like this:
		export default (state, action) => {
			state[0] = 'Sam';
			state.pop();
			state.push()

			state.name = 'same';
			state.age = 30;
		};
		//NEVER DIRECTLY AUGMENT STATE IN OUR REDUCERS

	//Another example:
		const name = 'Sam';
		name[0] = 'X';
		//"X" no error when running this
		name;
		//however, name is still === "Sam"
		// IN JS STRINGS AND NUMBERS ARE IMMUTABLE VALUES
			//WE CANNOT CHANGE THEM IN THE SAME WAY THAT WE CAN CHANGE AN ARRAY OR AN OBJECT

		//Therefore, if you have a reducer that's always returning a NUMBER or  STRING you don't
		//have to worry baout this mutation rule, only when you're working with an [] or an {}
			//REDUCERS always return data in an array or object so this comes up a lot.
				//however, in the next session that we don't have to take rule 4 @ face value...
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Equality of Arrays vs Objects - 

	//side topic, in browser console.:
		const numbers = [1,2,3];

	//in primitive data values the '===' is like the a comparison method
		1 === 1; //true
	//same with strings b/c ''are also are primitive values
		'hi' === "hi"; //true

	//But what about with arrays?
		numbers === numbers;
		//true b/c JS is checking to see if this is a reference to the array in memory
		//NOT the CONTENTS of the numbers array;

	//Example:
		numbers === [1,2,3];
		// false b/c comparison is between whether or not 'numbers' is referencing the exact
		// same array in memory as the one we declared: <const numbers = [1,2,3]>
			//in this case this is not the same array in memory therefore console returns false
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//A Misleading Rule - REDUCER RULE 4 - must not MUTATE its input 'state' argument

	//4 - Must not mutate its input 'state' argument ==> THIS IS MISLEADING OR ALMOST FALSE
		//====>> JUST KIDDING! You can mutate it all day and not see any errors!
			//Its easier to tell beginners 'dont mutate state ever' tjam to tell them when they
			//can and when they can't.

		//WE ARE NOT GOING TO MUTATE STATE EVER:
			//We want to understand the behind the scenes of this rule to help us better understand Redux

	//But this rule is in EVERY DOC for a REASON, so why is that?
		//--> ONE CASE IN WHICH IT'LL LAND YOU IN TROUBLE:

	//to understand this REDUCER RULE we'll look at the source code in the redux lib: 
		//github.com/reduxjs/redux/ > src > combineReducers > at bottom:
	    //this chunk of code gets executed whenever you DISPATCH AN ACTION:
			//key var
			let hasChanged = false
		    const nextState: StateFromReducersMapObject<typeof reducers> = {}
		    //iterates over all reducers in app
		    for (let i = 0; i < finalReducerKeys.length; i++) {
		      const key = finalReducerKeys[i]
		      const reducer = finalReducers[key]
	      	  //var assigned last STATE value that our REDUCER just returned
		      const previousStateForKey = state[key]
		      //our reducer will run w/ previousState and the action object and be assgined
		      //the value of 'nextStateForKey'
		      const nextStateForKey = reducer(previousStateForKey, action)
		      					 //  ^^this var is your reducer that you passed 
		      					 //  to the combine reducers function 
		      						// 1st arg: previousStateForKey = state that reducer
		      						// 		 last time it ran
		      						// 2nd arg: action = action object 
		      //if statement: checks to see if value is undefined
		      if (typeof nextStateForKey === 'undefined') {
		        const errorMessage = getUndefinedStateErrorMessage(key, action)
		        throw new Error(errorMessage)
		      }//assuming the nextStateForKey !== 'undefined'... we break out of this block.
		      nextState[key] = nextStateForKey
		      //If reducer just returned [] that is exact [] in memory as last time reducer ran:
		      	//hasChanged = false;
      		  //If reducer returned a brand new [], then hasChanged === true;
		      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
		      							//checks to see if nextState and previousState are
		      							//the exact same object in memory
		    }//end of for loop
		    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length
		    //if hasChanged === true then return the new state object assembled by all reducers
		    //if hasChanged === false then will return the old state returned by reducers last time ran
		    return hasChanged ? nextState : state
	//IN SUMMATION THIS BLOCK OF CODE RETURNS THE NEW STATE IF REDUCERS MADE A CHANGE TO STATE, AND
	//RETURNS 'OLD' STATE LAST TIME REDUCERS RAN IF NOT
		//Why is this relelvant?
			//If REDUX returns the old state value then redux will NOT notify any other parts of your 
			//app that any of your data has changed
			//If you DO HAVE NEW STATE:
				//redux will look at {}, see new state, and notify react that there's new state:
					//this will then allow our react app to rerender

			//The reason why we say you can't mutate the state argument with our reducers is...
				//if you accidentally return the same value that's pumped into your reducer
				return state; //this will think it's exactly the same in memory and will not RERENDER!
					//IF WE RETURN THE SAME VALUE, 'state', redux won't think data has changed.
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Safe State Updates in Reducers
	//So What Can and Can't We do to State with Reducers?

	//BAD - arrays 												GOOD - arrays
	//Removing an e from an array: 
								//state.pop()		==> 		state.filter(e => e !== 'hi!')
	//adding an e to an array: 
								//state.push('')	==> 		[...state, 'hi!']
	//replacing an e in an array:
								//state[0] = 'hi'	==> 		state.map(e => e === 'hi' ? 'bye' : e)

	//BAD - objects 											GOOD - objects
	//updating a prop in an {}:
								//state.sam = 'Sam' ==> 		{...state, name: 'Sam'}
	//Adding a property to an {}:
								//state.age = 30	==> 		{...state, age: 30}
	//Removing a prop from an {}:
								//delete state.name ==>			{...state.age: undefined }
	//												==> 		_.omit(state, 'age')

	//Examples in browser console:
	const colors = ['red', 'green'];
	//ADDING AN ELEMENT TO AN ARRAY:
		//[...colors'] === creates new array with existing value of colors inside it
		[...colors, 'blue'];
			//length/contents of new array: (3) ["red", "green", "blue"]

		//however this is NOT THE ORIGINAL ARRAY COLORS SO...
		[...colors, 'blue'] === colors;
			//returns false b/c we created a new array and it is not the same as the [] in the colors memory

		//We can easily use this syntax to add new elements onto the end of our new []:
		[...colors, 'blue', 'purple', 'pink'];
			//returns length/contents of new []: (5) ["red", "green", "blue", "purple", "pink"]

		//Or add them at the beginning
		['purple', ...colors]
			//length/contents of new []: (3) ["purple", "red", "green"]
				//IMPORTANT: THIS IS B/C THE ORDER OF OPERATIONS READS FROM LEFT TO RIGHT

	//REMOVING AN ELEMENT FROM AN ARRAY:
		//filters out all elements !== 'green'
		colors.filter(color => color !== 'green' );
			//returns NEW [] w/ value 'red': ["red"]
		colors.filter(color => color !== 'green') === colors;
			//returns false b/c the colors [] has not been changed and isn't the same the [] colors in memory

	//UPDATING PROPERTIES INSIDE OF AN OBJECT:
		const profile = {name: 'Sam'}

		//takes name property out of profile {} and changes it to Alex: 
		{...profile, name: 'Alex'}
			//new object: {name: "Alex"}

	//ADDING PROPERTIES INSIDE OF AN OBJECT:
		//adds 'age' property to new {} w/ profile
		{...profile, age: 30}
			//new object: {name: "Sam", age: 30}

		//Remember the order of operations is the same as in arrays:
		{ name: 'Alex', ...profile }
			//the console reads this from left to right, so even though we tried
			//to change the value of the name prop, since we put the profile var
			//last to the right it was overwritten with this: {name: "Sam"}

	//DELETING PROPERTIES INSIDE OF AN OBJECT:
		//WE CANNOT DO THIS
		delete profile.name;
		//true valid js operation but mutates object ot this: {}
			//WE CANNOT DO THIS

		{...profile, name: undefined}
		//returns new {} as this: {name: undefined}, however this is not truly deleting the
		//propety b/c the key-value pair still exists:

		//LoDash Library _.omit(state, 'age') - popular js library for working with objects and arrays
		const profile = { name: 'Sam' } 

		//with lodash, removes 'name' prop
		_.omit(profile, 'name'); 
			//returns new empty object: {}
		profile 
			//and we can still reference the original data, profile === {name: 'Sam'}
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Switch Statements in Reducers
	//in reducers/index.js:
	//B/c this is dealing w/ a list of records we'll default state an empty []
	export default (state = [], action) => {
		//watches for action type 'FETCH_POSTS'
		if (action.type === 'FETCH_POSTS') {
			//action.type === 'FETCH_POSTS' will return action.payload;
			return action.payload;
		}
		//when there is no appropriate action.type we'll just return state
		return state;
	};

	//However, the usual syntax in Reducers uses switch statements in order to see everything w/o errors
	export default (state = [], action) => {
		switch (action.type) {
			case 'FETCH_POSTS':
				return action.payload;
			default:
				return state;
		}
	};
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Coding Challenge 13 - Adding a Reducer Case
/*Right now, our reducer only handles one type of action - the 'FETCH_POSTS' type. 

Let's add another case to the switch statement that will add a single post to our list of posts.

Your reducer will be called with an action that looks like the following:*/

	{ type: 'ADD_POST', payload: { id: 123, title: 'Post Title' } }/*

1.Add another switch statement to the reducer. Make sure you watch for an action of type 'ADD_POST'

2. Add the payload of this action on to the end of your current list of posts (the state variable) and 
return the result

	Hints

	1. Don't forget that you need to return a completely new array!  Don't use the push method to add 
	the post.
	2. Use the syntax shown in the video 'Safe State Updates in Reducers' to add the payload into the 
	state array

postsReducer.js*/

export default (state = [], action) => {
    
    switch (action.type) {
        case 'FETCH_POSTS':
            return action.payload;
        //SOLUTION
    	case 'ADD_POST':
    		return [...state, action.payload];
    		//END SOLUTION
    	default: 
    		return state;
    };
};
/*This adds in a new case to the switch statement. This reducer can now handle actions with the type 
'ADD_POST'. 
Whenever this reducer sees an action with type 'ADD_POST', it will take the payload property from the 
action and add it in to the end of the state array. Notice that the update to the state is done with 
that special array spread syntax. This makes sure that a completely new array is returned.  
Remember: we don't modify (or mutate) state inside of a reducer.*/
  /////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Dispatching Correct Values

	//Now any time we make a request to the api we should be getting back an action w/ a payload prop
	//showing up in the reducer
	//--> Reducer should be returning the list of posts
	//--> Redux state object will now contain that list of posts from the api
	//--> React sees the change in state and rerenders.
		//Now all we really ahve to do is openup the PostList comp and get the list of posts inside this
		//component, 
		//REMEMBER - anytime we want to get data from REDUX into REACT we will always:
			//define mapStateToProps
			//pass it off to the connect function 
	//in PostList.js:

	//1 - define mapStateToProps
		const mapStateToProps = state => {
			return { posts: state.posts }
		};
		//remember, we have to return it w/ the variable of posts b/c that's what we called it in 
		//src/reducers/index.js:
			export default combineReducers({
				posts: postsReducer
			});

	//2 - pass off to connect function as 1st arg:
		export default connect(
			mapStateToProps,
			 { fetchPosts }
		 )(PostList);

		 //now to test we'll console.log(this.props.posts):
		 render(){
			console.log(this.props.posts);
			return <div>PostList</div>
		}
		//In browser console, you'll see that we have 2 console.logs:
			/*1*/[] //that was the initial value when the REDUCER ran for the 1st TIME
				//whatever reducer's initial value it probably won't have the value of 'FETCH_POSTS'
					//therefore an empty array is returned: []
			/*2*/ {data: Array(100), status: 200, statusText: "OK", headers: {…}, config: {…}, …}
				//after component renders, in CDM, we'll run the fetchPosts() method to fetch data from api
					//after we get back data and dispatch the action to a reducer 
					//REDUCER sees we have an action type of 'FETCH_POSTS' and returns whatever value is
					//in action.payload prop
					//REDUX sees that weh ave not returned the same array in memory
						//--> b/c this is a new value redux assumes we have some new data
						//--> redux tells REACT to rerender itself with new data
					//--> POSTLIST rendered a second time
						//--> mapstatetoprops called a second time
							//--> we'll get the new value of state.posts
								//--> new props post gets shown up inside component
									//--> render method called again
										//--> console.log called again w/ api data now

		//So now we have one small error, we're returning the entire response object and not just the data,
		//To fix this, we'll dispatch response.data response src/actions/index.js:
		import jsonPlaceholder from '../apis/jsonPlaceholder';

		export const fetchPosts = () => async (dispatch) => {
			const response = await jsonPlaceholder.get('/posts');

			dispatch({ type: 'FETCH_POSTS', payload: response.data })
		};
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//List Building!!
	//Now that we have our data (response.data), let's build a list, in PostList.js, create a new 
	//method and call it renderList(){}:
		renderList(){
			return this.props.posts.map(post => {
				return (
					<div className="item" key={post.id}>
						<i className="large middle aligned icon user"/>
						<div className="content">
							<div className="description">
								<h2>{post.title}</h2>
								<p>{post.body}</p>
							</div>
						</div>
					</div>
				);
			})
		}//						post.title / post.body --> keys from the api data that we want
	//Now we want to call renderList() in our render method:
		render(){
			console.log(this.props.posts);
			return <div className="ui relaxed divided list">{this.renderList()}</div>
		}

	//OK - now the list is rendering the way we want it to, next we'll address how to display the
	//user information
/////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////////////
//Displaying Users
	//Let's review the api documentation so we can remember why we need to get the user information
	//from a seperate api request:
		//http://jsonplaceholder.typicode.com/posts
			//this data endpoint returns the following keys:
				//userId
				//id (post id)
				//title
				//body
		//jsonplaceholder.typicode.com/users
			//data endpoint returns the key: id
				//if we want to show the actual name of the author making the posts we'll need to make
				//a follow up request to the api and get the user's information
					//there's an easy way and a hard way

		//Easy Way: we know we have the entire list of posts and that the user endpoint will return any 
		//user in this application
			//this is too easy b/c a real blogging app wouldn't display the information in one page,
			//b/c this would be millions of users they'd show you a portion of the data, 
				//so we're not going to do it this way, it woudln't be done like this in the real world

		//THE HARD WAY: 
			//Fetch Posts
				//--> Show posts in PostList
					//--> each element in PostList shows User Header
					//in PostList: we'll place <UserHeader/> and give it a userId prop
						//--> UserHeader is given ID of user to show
						//--> each UserHeader Attempts to Fetch its user
						//{Fetch User,  id: 1}, 	{Fetch User, id: 2}, 	{Fetch User, id: 3}
							//--> show  users in each --> UserHeader		-->
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Fetching Singular Records
	//We're going to create a new ACTION CREATOR to fetch ONE DIVIDUAL USER at a time
		//fetchUser (action creator): makes request to API, gets chosen user and dispatches action
			//--> Action dispatched with type of 'FETCH_USER', and response.data on the payload prop
				//-->create usersReducer: holds list of all users fetched in our application
					//--> we'll tabulate all the user records we collect into this reducer

	//put together action creator fetchUser in src/actions/index.js:
		export const fetchUser = (id) => async dispatch => { 
				//takes in id from users as arg, async syntax w/ dispatch

			//response = jsonPlaceholder api users endpoint
			const response = await jsonPlaceholder.get(`/users/${id}`);
				//					interpolate the id value in endpoint w/ es2015 syntax

			dispatch({ type: 'FETCH_USER', payload: response.data });
		};
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Displaying the User Header
	//Now that we've got out fetchUser action creator put together, we'll start creating our component
	//that will just display the author's name, we'll call it UserHeader:
	//in src/components/UserHeader.js, add boilerplate:
		import React from 'react';

		class UserHeader extends React.Component {
			render(){
				return <div>User Header</div>
			}
		}

		export default UserHeader;

	//Now in PostList.js, make sure we can render this component:
		import UserHeader from './UserHeader';
			//import component
		//show instance of component in render w/ userIdprop:
		<UserHeader userId={post.userId}/>
			//we're in the renderList() props.post.map: key we want is userId

	//Back to UserHeader.js:
		import { connect } from 'react-redux';
			//import connect function from react-redux middleware
		import { fetchUser } from '../actions';
			//import fetchUser action we created

		class UserHeader extends React.Component {
			componentDidMount(){
				this.props.fetchUser(this.props.userId)
					//
			}

			render(){
				return <div>User Header</div>
			}
		}

		export default connect(null, { fetchUser })(UserHeader);
			//call connect:
				//initialize w/ initial state of null, 
				//attach action fetchUser, and add component: <UserHeader/>

		//Next we'll work on creating a reducer that will package the data we want it to
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Finding Relevant Users
	//We're going to wire up a reducer to catch the action created by our action creator
		//this new usersReducer: will maintain a list of all the users we've fetched
			//--> once we collect that data inside our reduce we can make it availalbe to the UserHeader
			//component
				//--> component UserHeader will render the data we care about:

	//So, let's create usersReducer.js w/ this boilerplate:
		export default (state = [], action) => {
			switch(action.type) {
				case 'FETCH_USER':
					return [...state, action.payload];
				default: 
					return state;
			}
		}

	//Now let's wire this up in reducers/index.js:
		import usersReducer from './usersReducer';
			//import the reducer we just created 

		export default combineReducers({
			posts: postsReducer,
			users: usersReducer
				//now we have a reducer avail as the key of users
		});

	//Now let's get this data in state to our UserHeader component with mapStateToProps:
	//UserHeader.js:
		const mapStateToProps = (state) => {
		return { users: state.users }
	};//now UserHeader has access to this.props.users, [] of all users we care about

	//Still in UserHeader.js, render() method:
	render(){
		//find first user where the id matches the userId in props object:
		const user = this.props.users.find(user => user.id === this.props.userId);

		//if no user matches that, return null
		if (!user) {
			return null;
		}
		//when we have a user render the user.name inside of a div:
		return <div>{user.name}</div>
	}

		//quick example on the array mutation .find(), browser console:
			const colors = ['red', 'green', 'blue', 'green'];
			colors.find(color => color === 'blue');
			//method ends once it finds 'blue' and returns --> "blue"

	//DON'T FORGET TO CALL mapStateToProps as the first arg in connect()()!!!:
	//UserHeader.js:
		export default connect(mapStateToProps, { fetchUser })(UserHeader);

	//Ok so now we're looking great, but we have one little issue... 
		//next we'll do a refactor for the <UserHeader/> component
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Extracting Logic to MapStateToProps
	//So right now the UserHeader component has the entire list of user data, we want to figure out a way
	//to only pass it the user information that we care about, so how could we go about this?

	//in UserHeader.js, mapStateToProps, instead of loading all of this data in the component and having
	//the component decide what data to care about, we could extract all that logic to the 
	//mapStateToProps function:
		const mapStateToProps = (state, ownProps) => {
		//argument 2: ownProps --> object is a reference to the props that are about to be sent into
		//UserHeader

			return { users: state.users.find(user => user.id === ownProps.userId) };
		};

	//Now that we've moved the user declaration we need to extract it out of the props object in render(){}:
		render(){
			const { user } = this.props;
				//now 'user' is available outside the props object
			if (!user) {
				return null;
			}
			return <div className="header">{user.name}</div>
		};
		//we can extract anything that is going to do some computation into our redux state to our 
		//mapSTateToProps function
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//That's the Issue!
	//chrome console > networks tab > filter by XHR requests:
		//we'll see that we're making request from posts then 10 for each user
			//everytime UserHeader is rendered, CDM is calling fetchUsers each time
				//--> we're making 10 times more calls to the api than we need to
					//2 ways to solve:
						//1 - simple code change w/ comlplicated syntax
						//2 - more challenging way that helps us understand what's going on better
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Memoizing Functions
	//ISSUE: we're overfetching our user data
		//2 solutions 
			//1 - complicated syntax, simple code change
			//2 - difficult change - easy to understand

		//lodash.com/docs "memoize"
			//in browser console @ lodash.com:
				function getUser(id) {
				    fetch(id);
				    return 'Made a request!';
				};
			//now when we call it w/ a random number we'll see an xhr request in the network tab
				getUser(2)
					//return "Made a request!";

			const memoizedGetUser = _.memoize(getUser)
				//memoized version of same function we wrote above:
					//ONLY DIFFERENCE: can only call memoizedGetUser ONE TIME with any unique set
					//of arguments
						//we can still call it after but original function will not be invoked
							//--> memoize will return whatever we returned previously
		//Let's try an example in lodash.com console:
			memoizedGetUser(3);
			//string returned --> "Made a request!"
			// request made --> VM309:2 GET https://lodash.com/3
			memoizedGetUser(3); //no request made
			//string returned"Made a request!"
				//SOO... THIS SEEMS LIKE THE PERFECT SOLUTION:
		//memoizing our action creator could be a good solution
			//runs the function to make request w/ unique args once but afterwards w/ those args
			//just returns the string
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Memoization Issues
	//in project directory run npm install --save lodash

	//in src/actions/index.js:
		import _ from 'lodash';
			//import lodash library: by convention lodash is identified w/ the '-'

	//Now we're going to rewrite our fetchUser action w/ 'function' syntax:

	export const fetchUser = _.memoize(function(id) {
		//we're trying to _.memoize the outer function w/ the unique arg and hopefully 
		//solve the problem
		return async function(dispatch) { 
			const response = await jsonPlaceholder.get(`/users/${id}`);
				//API call

			dispatch({ type: 'FETCH_USER', payload: response.data });
		};
	});//end of outer memoize
	//This doesn't work b/c we're STILL RETURNING a dispatch function that's making an API call


	//So let's try memoizing the inner function:
		export const fetchUser = function(id) {

			return _.memoize(async function(dispatch) { 
				//we're recreating this function each time, therefore the memoizing doens't work
				//as we expect it to, since we recreate the function it has new args and it'll run
				const response = await jsonPlaceholder.get(`/users/${id}`);
				//this api call each time...



				dispatch({ type: 'FETCH_USER', payload: response.data });
			});//end of inner memoize
		};//we're still making 10 requests per 
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//One Time Memoizing
	//still in src/actions/index.js:
		export const fetchUser = id => dispatch => { 
			_fetchUser();
			//calls memoized version of action creator
				//needs to be called with id and dispatch
					//==> so that memoized version can call w/ those same args below:
		};


		//_ ==> 'private' function, other engineers shouldn't really call it unless they know what it does
		const _fetchUser = _.memoize(async ( id, dispatch) => {
		//_.memoize this entire call --> memoirze(id, dispatch) --> receives args from export above ^^^^
			const response = await jsonPlaceholder.get(`/users/${id}`);
			//now api call is only made once
			dispatch({ type: 'FETCH_USER', payload: response.data });
			//data is dispatched once
		});

		//can clean up export statement w/ some es 2015 syntax to this:
			export const fetchUser = id => dispatch => _fetchUser(id, dispatch);
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Alternate Overfetching Solution
	//We're going to create an action creator called fetchPostsAndUsers():
		//call 'fetchPosts'
		//get list of posts
		//--> from list we'll find all unique userId's from list of posts
		//Iterate over unique userId's
		//Call 'fetchUser' with each userId
			//we're not going to replace fetchPosts or fetchUsers
				//the idea is that we want to create action creators that are as small
				//and compact as possible
					//in the future we want to put together a user profile page, 
						//in that case we'd want an action creator to fetch one user,

				//in general, when we want to have an action creator that does a lot of things
				//it's BEST PRACTICE to create a bunch of small specific ones and wire them together

	//So let's refactor fetchUser action creator back to previous state, src/actions/index.js:
		export const fetchUser = id => dispatch => {
			const response = await jsonPlaceholder.get(`/users/${id}`);

			dispatch({ type: 'FETCH_USER', payload: response.data });
			
		};
/////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Creators in Action Creators!
	//GOAL: call fetchPOsts() - wait to get all posts - retrieve userIds etc.

	//in src/actions/index.js:
		export const fetchPostsAndUsers = () => async dispatch => {
			//error handling - keeping track of when we run dispatch(fetchPosts());
			console.log('About to fetch posts!');
			await dispatch(fetchPosts());
			//await === makes sure we don't move down to the next line until the api call is complete
			console.log('Fetched posts!');
			//error handling - keeping track of when we run dispatch(fetchPosts());
		};
			/*when we call fetchPosts(), we have to pass the result of calling it into our dispatch
			function*/ dispatch(fetchPosts());
				//so that inner function will show up in redux-thunk and get invoked w/ dispatch()
				//rule whenever we call an action creator inside of an aciton creator

	//Now let's wire up this fetPostsAndUsers action creator to PostList.js:
		import { fetchPostsAndUsers } from '../actions';

		class PostList extends React.Component {
			componentDidMount(){
				this.props.fetchPostsAndUsers();
				//replace old action creator with new fetchPostsAndUsers
			}
		}
		export default connect(
			mapStateToProps,
			 { fetchPostsAndUsers }
			 //and call action creator with connect()()
		 )(PostList);
/////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Finding Unique User Ids
	//Now we have a better idea of how we can call an action creator from an action creator, and 'wait'
	//for a task to be completed within an inner action creator

	//1 - Call 'fetchPosts' - done
	//2 - Get list of Posts - done
	//3 - Iterate over list of posts, find all unique user ids ***
	//4 - Iterate over list of userIds and call fetchUsers() on each one

	//2 - Get list of Posts
	//^^^ can do this easily - remember, 2nd argument in action creators that return a function is 
		//getState --> function existing on the redux store that gives us access to all the data inside of
		//redux (store)
		//So in src/actions/index.js, let's try calling getState().posts after 'await' dispatch();
			export const fetchPostsAndUsers = () => async dispatch => {
				await dispatch(fetchPosts());
				console.log(getState().posts);
				//logs out all 100 posts, can see in console
			};

	//3 - Now let's iterate over list of posts, find all unique user ids and fetch user for each one:

	//We'll use the lodash library to do this, will make finding unique ids very easy/straightforward.
	//Lodash has it's own version of .map() that has some nice features in it:

		_.map(getState().posts, 'userId'); //goes through all posts and pull off just user id props
			//--> array of 100 userids - now we need the unique user ids:

		const userIds = _.uniq(._map.(getState().posts, 'userId'));
			//_.uniq() returns all unique data in _.map() ==> 10 unique user Ids

	//entire action-creator now looks like this (src/actions/index.js:):
		export const fetchPostsAndUsers = () => async (dispatch, getState) => {
			await dispatch(fetchPosts());
			const userIds = _.uniq(_.map(getState().posts, 'userId'));
			userIds.forEach(id => dispatch(fetchUser(id)));
		};

	//4 - Now that we have our  list of userIds, iterate and call ACTION CREATOR fetchUsers() on each one:
		userIds.forEach(id => dispatch(fetchUser(id)));
			//calls fetchUser() forEach id in the userIds [] and dispatches the results
				//WE ARE NOT AWAITING THIS OPERATION B/C WE DON'T CARE ABOUT WAITING FOR THIS:
					//we wanted to wait on the posts, once we had that we just wanted to initiate a
					//request to go and fetch the users - not needed this time around b/c nothing else
					//is waiting on this operation.
						//*** 'async await' syntax does not work with arr.forEach() anyways

	//Let's check out the network xhr request log - we're still making all these duplicate requests,

	//UserHeader is still attempting ot fetch it's own data, to stop this, go to UserHeader.js:
		//remove entire CDM: trying to fetch own data, we're now using fetchPostsAndUsers for user data
		//since we're removing fetchUser(), remove import statement also
		//and finally delete argument in connect()() @ bottom:
	//UserHeader.js now looks like this:
		import React from 'react';
		import { connect } from 'react-redux';
		class UserHeader extends React.Component {
			render(){
				const { user } = this.props;
				if (!user) {
					return null;
				}
				return <div className="header">{user.name}</div>
			}
		}
		const mapStateToProps = (state, ownProps) => {
			return { user: state.users.find(user => user.id === ownProps.userId) };
		};
		export default connect(mapStateToProps)(UserHeader);
/////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////////
//Quick Refactor with Chain
	//Optional refactor to fetch posts and users:
	//src/acitons/index.js:
	export const fetchPostsAndUsers = () => async (dispatch, getState) => {
		await dispatch(fetchPosts());
		const userIds = _.uniq(_.map(getState().posts, 'userId'));
		userIds.forEach(id => dispatch(fetchUser(id)));
	};// ^^^ we're going to refactor this block using lodash _.chain() function:

	_.chain() //very special lodash function, allows us to "chain on" a bunch of additional functions
	//that are going to manpulate some data.

	//example:
		/*rewrite this w/ _.chain() */
		const userIds = _.uniq(_.map(getState().posts, 'userId'));

		_.chain(getState().posts)
			.map('userId') //--> 1st arg automatically = whatever object we called _.chain():list of posts
						   		//--> 'userId'=== 2nd arg in .map ==> .map(getState().posts, 'userId')
			.uniq()		   //--> finds each unique 'userId' from map
			.forEach(id => dispatch(fetchUser(id))); //--> calls fetchUser(id) per id and dispatches action
			.value()	//lodash will not execute all these _.chain() methods until you run value();
/////////////////////////////////////////////////////////////////////////////////////////////////////
//App Wrapup
	//root index.js:
		//imported redux thunk, wired it up to redux store via use of applyMiddleWare
		//called Applymiddleware and passed result of it into the 2nd arg of the createStore() call

	//when we apply this redux thunk middleware, anytime we dispatch an action it will be
		//sent to REDUX THUNK FIRST
			//then action sent off to all our reducers

	//when we used redux-thunk, it changed the rules of our action creators:
		//allows us to optionally return functions:
			//through this we returned the DISPATCH and GETSTATE functions which allowed
			//us total control over the information from our redux store

				//***anytime we make an API REQUEST from an ACTION CREATOR we will ALWAYS
				//need to use something like REDUX-THUNK***

	//When we returned an action creator we used some interesting syntax:
	export const fetchPosts = () => async dispatch => {
		const response = await jsonPlaceholder.get('/posts');
		dispatch({ type: 'FETCH_POSTS', payload: response.data })
	};
	//all that's going on here is we have a function that returns a function, like this:
		function(){
			return function(){
			}
		};

	//ACTION CREATORS - remember we learned how to create an action creator that called other action
	//creators and still dispatched the results of those actions creators
		//we needed to do this due to an overfetching data problem.

	//REDUCERS - learned A LOT ABOUT REDUCERS
		//1st argument = state, and is what was returned from the first time reducer ran
		//We usually make use of the switch statement syntax with reducers
		//usersReducer.js, remember the[...state, action.payload] syntax, we always return a NEW ARRAY:
			return [...state, action.payload];
				//remember 'state' in redux === 'state' in memory, not the new state, so it must always
				//be returned in a new array to cause react to rerender to show new content


	



