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