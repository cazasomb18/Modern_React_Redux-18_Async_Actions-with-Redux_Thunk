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