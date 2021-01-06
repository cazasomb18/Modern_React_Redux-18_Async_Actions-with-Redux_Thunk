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
	//