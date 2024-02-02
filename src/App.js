import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import {
	React,
	useState,
	useEffect
} from "react";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  FieldGroupIconButton,
  View,
  withAuthenticator,
  ThemeProvider,
  Theme,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Image,
  Message,
} from "@aws-amplify/ui-react";
import { MdSearch } from 'react-icons/md';
import { generateClient } from "aws-amplify/api";
import { listSamples } from "./graphql/queries";
import { 
  getCurrentUser,
} from 'aws-amplify/auth';
import pslogo from './pslogo.png';

const theme: Theme = {
  name: 'powersight-theme',
  tokens: {
    components: {
		card: {
			backgroundColor: { value: '{colors.neutral.10}' },
			outlined: {
			  borderColor: { value: '{colors.black}' },
			  borderRadius: { value: '{radii.small}' },
			},
		},
		
		heading: {
			color: { value: '{colors.white}' },
			fontWeight: { value: '{fontWeights.semibold}' },
			fontSize: { value: '{fontSizes.xl}' },
		},
		
		text: {
			color: { value: '{colors.black}' },
		},
		
		tabs: {
			borderColor: { value: '{colors.black}' },
			borderRadius: { value: '{radii.xs}' },
			item: {
			  color: { value: '{colors.blue.80}' },
			  fontSize: { value: '{fontSizes.xl}' },
			  fontWeight: { value: '{fontWeights.normal}' },

			  _hover: {
				color: { value: '{colors.red.60}' },
			  },
			  _focus: {
				color: { value: '{colors.red.40}' },
				borderColor: { value: '{colors.red.60}'}, 
			  },
			  _active: {
				color: { value: '{colors.red.60}' },
				borderColor: { value: '{colors.red.60}' },
				backgroundColor: { value: '{colors.neutral.40}' },
			  },
			  _disabled: {
				color: { value: 'gray' },
				backgroundColor: { value: 'transparent' },
			  },
			},
		},
		
		table: {
			row: {
			  hover: {
				backgroundColor: { value: '{colors.blue.20}' },
			  },

			  striped: {
				backgroundColor: { value: '{colors.blue.10}' },
			  },
			},

			header: {
				color: { value: '{colors.blue.60}' },
				fontSize: { value: '{fontSizes.medium}' },
				fontWeight: { value: '{fontWeights.medium}' },
			},

			data: {
				color: { value: '{colors.black}' },
				fontSize: { value: '{fontSizes.medium}' },
				fontWeight: { value: '{fontWeights.light}' },
			},
		},
		
		textfield: {
			color: { value: '{colors.blue.80}' },
			_focus: {
				borderColor: { value: '{colors.red.60}' },
			},
		},
		
		button: {
			color: { value: '{colors.red.60}' },
			borderColor: { value: '{colors.red.80}' },
			_hover: {
				color: { value: '{colors.blue.60}' },
				borderColor: { value: '{colors.blue.80}' },
			},
			_focus: {
				color: { value: '{colors.blue.80}' },
				borderColor: { value: '{colors.blue.60}' },
			},
			_active: {
				color: { value: '{colors.blue.90}' },
				borderColor: { value: '{colors.blue.80}' },
			},
			_disabled: {
				backgroundColor: { value: 'transparent' },
				borderColor: { value: '{colors.neutral.30}' },
			},
			
			// style the primary variation
			primary: {
				backgroundColor: { value: '{colors.blue.60}' },
				_hover: {
					backgroundColor: { value: '{colors.red.60}' },
				},
				_focus: {
					backgroundColor: { value: '{colors.blue.80}' },
				},
				_active: {
					backgroundColor: { value: '{colors.blue.90}' },
				},
				_disabled: {
					backgroundColor: { value: 'transparent' },
					borderColor: { value: '{colors.neutral.30}' },
				},
				error: {
					backgroundColor: { value: '{colors.pink.10}' },
					color: { value: '{colors.red.80}' },
					_hover: {
					  backgroundColor: { value: '#a51b34' },
					},
					_focus: {
					  backgroundColor: { value: '#9a0c26' },
					},
					_active: {
					  backgroundColor: { value: '#9a0c26' },
					},
				},
			}
		},
	},
  },
};

const API = generateClient();

const App = ({ signOut }) => {
	const [samples, setSamples] = useState([]); // set samples as state variable and tie it to setSamples() function
	const [validIds, setIds] = useState([]); 
	const [showTables, setShowTables] = useState(false);
	const [currentUser, setCurrentUser] = useState([]); 
	const [date, setDate] = useState(new Date());
	
	useEffect(() => { // call fetchSamples() once on render
		fetchSamples();
	  }, []);
	
	useEffect(() => {
		getUser();
	}, []);
	
	useEffect(() => { // update time every second
		let timer = setInterval(()=>setDate(new Date()), 1000);
		return function clean() {
			clearInterval(timer);
		}
	});
	
	async function getUser() {
	  try {
		const myUser = await getCurrentUser();
		setCurrentUser(myUser);
		console.log("user =", myUser);
	  } catch (err) {
		console.log(err);
	  }
	}

	function parseData(data) {
		  data = data.replace(/[\"{}]/g, ''); // remove special characters that are part of JSON string
		  const splitData = data.split(','); // tokenize string to create array of measurements
		  const dataMap = new Map();
		  splitData.map(data => { // iterate through tokenized string and create map of ["MEASUREMENT TYPE" => VALUE]
			  if (data.match(/T:/)) {
				  data = data.replace(/T:/, '');
				  dataMap.set("T", data);
			  }
			  else if (data.match(/V1:/)) {
				  data = data.replace(/V1:/, '');
				  dataMap.set("V1", data);
			  }
			  else if (data.match(/V2:/)) {
				  data = data.replace(/V2:/, '');
				  dataMap.set("V2", data);
			  }
			  else if (data.match(/V3:/)) {
				  data = data.replace(/V3:/, '');
				  dataMap.set("V3", data);
			  }
			  else if (data.match(/I1:/)) {
				  data = data.replace(/I1:/, '');
				  dataMap.set("I1", data);
			  }
			  else if (data.match(/I2:/)) {
				  data = data.replace(/I2:/, '');
				  dataMap.set("I2", data);
			  }
			  else if (data.match(/I3:/)) {
				  data = data.replace(/I3:/, '');
				  dataMap.set("I3", data);
			  }
			  else if (data.match(/In:/i)) {
				  data = data.replace(/In:/i, '');
				  dataMap.set("In", data);
			  }
			  else if (data.match(/W1:/)) {
				  data = data.replace(/W1:/, '');
				  dataMap.set("W1", data);
			  }
			  else if (data.match(/W2:/)) {
				  data = data.replace(/W2:/, '');
				  dataMap.set("W2", data);
			  }
			  else if (data.match(/W3:/)) {
				  data = data.replace(/W3:/, '');
				  dataMap.set("W3", data);
			  }
			  else if (data.match(/Wt:/)) {
				  data = data.replace(/Wt:/, '');
				  dataMap.set("Wt", data);
			  }
		  });
		  return dataMap;
	  }
	  
	  function parseSamples(samples, myMap) { // store a map of map->id map->samples array
		  samples.map(sample => {
			  if (myMap.get(sample.device_id) === undefined) { // if map doesn't contain meter id yet, initialize with <id, array[map]>
				const dataArr = [];
				myMap.set(sample.device_id, dataArr); // elements are of the form <ID, array[map<measurement,data>]>
			  }
			  myMap.get(sample.device_id).push(parseData(sample.device_data)); // add map of measurements to ID map
		  });
	  }

	  async function assembleSamples(next, myMap) {
		  while (!(next === undefined) && !(next === null)) {
			try {
				const apiData = await API.graphql({
					query: listSamples,
					variables: {
						nextToken: next,
						limit: 100,
					}
				});
				const samplesFromAPI = apiData.data.listSamples.items;
				parseSamples(samplesFromAPI, myMap);
				next = apiData.data.listSamples.nextToken;
			} catch (error) {
				console.log('Error on fetching samples: ', error);
			}
		  }
	  }

	  async function fetchSamples() {
		try {
			const apiData = await API.graphql({
				query: listSamples,
				variables: {
					limit: 100,
				}
			});
			const samplesFromAPI = apiData.data.listSamples.items;
			const sampleMap = new Map();
			let nextToken = apiData.data.listSamples.nextToken;
			
			parseSamples(samplesFromAPI, sampleMap);
			await assembleSamples(nextToken, sampleMap);
			
			console.log("samples = ", sampleMap);
			setSamples(sampleMap);
		} catch (error) {
			console.log('Error on fetching samples: ', error);
		}
	  }

	  function validateId(ids) {
		  try {
			  ids = ids.replace(/ /g, ''); // remove spaces
			  ids = ids.split(/,/); // tokenize string to create array of ids
			  let myHTML = '';
			  let validIDs = [];
			  let match = false;
			  ids.map(id => {
				  if (samples.get(id) !== undefined) {
					match = true; // check to see if we have a match first, so we can make container for tables
					setShowTables(true); // set state to show tables
					validIDs.push(id);
				  }
				  else {
					alert('Failed to find Analyzer ID: ' + id + '. Please check the ID and try again.')
				  }
				  if (match) {
					  setIds(validIDs); // store the valid ids in state
				  }
			  });
		  } catch (error) {
			  console.log('Error on validating id(s): ', error);
		  }
	  }
	  
		function makeTables(id) {
			return (
				<div>
					<p>Total number of records: {samples.get(id).length}</p>
					<Table highlightOnHover variation="bordered">
						<TableHead>
							<TableRow>
								<TableCell as="th">Sample</TableCell>
								<TableCell as="th">Time</TableCell>
								<TableCell as="th">V1</TableCell>
								<TableCell as="th">V2</TableCell>
								<TableCell as="th">V3</TableCell>
								<TableCell as="th">I1</TableCell>
								<TableCell as="th">I2</TableCell>
								<TableCell as="th">I3</TableCell>
								<TableCell as="th">In</TableCell>
								<TableCell as="th">W1</TableCell>
								<TableCell as="th">W2</TableCell>
								<TableCell as="th">W3</TableCell>
								<TableCell as="th">Wt</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{
							samples.get(id).map((sample, i) => {  // use samples [id => measurements] map to generate table data
								return (
									<TableRow>
										<TableCell>
										{i+1}
										</TableCell>
										<TableCell>
										{sample.get("T")}
										</TableCell>
										<TableCell>
										{sample.get("V1")}
										</TableCell>
										<TableCell>
										{sample.get("V2")}
										</TableCell>
										<TableCell>
										{sample.get("V3")}
										</TableCell>
										<TableCell>
										{sample.get("I1")}
										</TableCell>
										<TableCell>
										{sample.get("I2")}
										</TableCell>
										<TableCell>
										{sample.get("I3")}
										</TableCell>
										<TableCell>
										{sample.get("In")}
										</TableCell>
										<TableCell>
										{sample.get("W1")}
										</TableCell>
										<TableCell>
										{sample.get("W2")}
										</TableCell>
										<TableCell>
										{sample.get("W3")}
										</TableCell>
										<TableCell>
										{sample.get("Wt")}
										</TableCell>
									</TableRow>
								)
							})
						}
						</TableBody>
					</Table>
				</div>
			)
		}
	  
	  function makeTabs() {
		  return (
			<div className="margin-med">
				<Heading className="blue-txt" level={4}>Analyzer ID:</Heading>
				<Tabs.Container defaultValue="Tab 0" isLazy>
					<Tabs.List spacing="equal" justifyContent="center" indicatorPosition="top">
						{
							validIds.map((id, i) => { // create tab buttons
								return ( 
									<Tabs.Item value={'Tab ' + i} key={i}>
										{id}
									</Tabs.Item>
								)
							})
						}
					  </Tabs.List>
						{
							validIds.map((id, i) => { // create tab content
								return (
									<Tabs.Panel value={'Tab ' + i} key={i}>
										{makeTables(id)}
									</Tabs.Panel>
								)
							})
						}
				</Tabs.Container>
			</div>
		  );
	  }
	  
	  return(
		<ThemeProvider theme={theme}>
			<div className="page-margin black-bg horizontal" style={{padding: '0.75em 0em 0.75em 0em'}}>
				<img style={{marginLeft: '0.25em'}} src={pslogo} alt="PowerSight Logo" />
				<Heading level={4}>Administrator Console, Version Alpha 1.0</Heading>
			</div>
			<div className="page-margin">
				<Heading className="blue-txt" level={4}>Welcome {currentUser.username}!</Heading>
				<Heading className="blue-txt" level={4}>Today's date is: {date.toDateString()} at {date.toLocaleTimeString()}.</Heading>
			</div>
			<Card className="page-margin" variation="outlined">
				<div className="margin-small">
					<Heading className="blue-txt" level={4}>View Data Records:</Heading>
					<p className="margin-small">Please enter your analyzer id(s). Separate by commas for multiple inputs</p>
					<Flex>
						<TextField
							placeholder="00000, 00001, 00002"
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									validateId(e.currentTarget.value); // check if user input corresponds to valid meter ids
								}
							}}
							innerEndComponent={ // generate magnifying glass button
								<FieldGroupIconButton
								  ariaLabel="Search"
								  variation="link"
								  onClick={() => alert('Still developing, please press enter for now.')}
								>
								  <MdSearch />
								</FieldGroupIconButton>
							}
						/>
					</Flex>
				</div>
				{
					showTables && validIds.length && makeTabs() // check for showTables state and that we have hits for user entered ids
				}
			</Card>
			<div className="margin-med center">
				<Button variation="primary" size="large" onClick={signOut}>Sign Out</Button>
			</div>
		</ThemeProvider>
	);
};

export default withAuthenticator(App);

/***
const App = ({ signOut }) => {
	
	const [customers, setCustomers] = useState([]);
	const [devices, setDevices] = useState([]);
	
	const [samples, setSamples] = useState([]); // set samples as state variable and tie it to setSamples() function
	const [validIds, setIds] = useState([]); 
	const [showTables, setShowTables] = useState(false);
	
	const [showInitial, setShowInitial] = useState(true); // show the initial admin console screen
	const [showManageCustomers, setShowManageCustomers] = useState(false); // show manage customers
	const [showManageDevices, setShowManageDevices] = useState(false); // show manage devices
	
	useEffect(() => { // call fetchSamples() once on render
		fetchSamples();
	  }, []);

	useEffect(() => {
		generateCustomers();
	}, []);
	
	useEffect(() => {
		generateDevices();
	}, []);

	async function generateCustomers() {
		const customers = [];
		const names = ["Vincent", "Ken", "Rich", "Ricky", "Grace", "Jason"]
		const devices = ["PS3550-04286", "PS4550-04287", "PS5000-04288", "PS3550-04386", "PS4550-04387", "PS5000-04388"]
		const count = 5;
		
		for (let i=0; i<count; i++) {
			customers.push({
			  id: i,
			  name: names[i],
			  company: "Summit Technology",
			  devices: devices[i]
			});
		}
		
		setCustomers(customers);
	}
	
	async function generateDevices() {
		const devices = [];
		const serials = ["04286", "04287", "04288", "04386", "04387", "04388"]
		const models = ["PS3550", "PS4550", "PS5000", "PS3550", "PS4550", "PS5000"]
		const customers = ["Vincent", "Ken", "Rich", "Ricky", "Grace", "Jason"]
		const count = 5;
		
		for (let i=0; i<count; i++) {
			devices.push({
			  id: i,
			  serial: serials[i],
			  model: models[i],
			  customer: customers[i]
			});
		}
		
		setDevices(devices);
	}

	function parseData(data) {
		  data = data.replace(/[\"{}]/g, ''); // remove special characters that are part of JSON string
		  const splitData = data.split(','); // tokenize string to create array of measurements
		  const dataMap = new Map();
		  splitData.map(data => { // iterate through tokenized string and create map of ["MEASUREMENT TYPE" => VALUE]
			  if (data.match(/T:/)) {
				  data = data.replace(/T:/, '');
				  dataMap.set("T", data);
			  }
			  else if (data.match(/V1:/)) {
				  data = data.replace(/V1:/, '');
				  dataMap.set("V1", data);
			  }
			  else if (data.match(/V2:/)) {
				  data = data.replace(/V2:/, '');
				  dataMap.set("V2", data);
			  }
			  else if (data.match(/V3:/)) {
				  data = data.replace(/V3:/, '');
				  dataMap.set("V3", data);
			  }
			  else if (data.match(/I1:/)) {
				  data = data.replace(/I1:/, '');
				  dataMap.set("I1", data);
			  }
			  else if (data.match(/I2:/)) {
				  data = data.replace(/I2:/, '');
				  dataMap.set("I2", data);
			  }
			  else if (data.match(/I3:/)) {
				  data = data.replace(/I3:/, '');
				  dataMap.set("I3", data);
			  }
			  else if (data.match(/In:/i)) {
				  data = data.replace(/In:/i, '');
				  dataMap.set("In", data);
			  }
			  else if (data.match(/W1:/)) {
				  data = data.replace(/W1:/, '');
				  dataMap.set("W1", data);
			  }
			  else if (data.match(/W2:/)) {
				  data = data.replace(/W2:/, '');
				  dataMap.set("W2", data);
			  }
			  else if (data.match(/W3:/)) {
				  data = data.replace(/W3:/, '');
				  dataMap.set("W3", data);
			  }
			  else if (data.match(/Wt:/)) {
				  data = data.replace(/Wt:/, '');
				  dataMap.set("Wt", data);
			  }
		  });
		  return dataMap;
	  }
	  
	  function parseSamples(samples, myMap) { // store a map of map->id map->samples array
		  samples.map(sample => {
			  if (myMap.get(sample.device_id) === undefined) { // if map doesn't contain meter id yet, initialize with <id, array[map]>
				const dataArr = [];
				myMap.set(sample.device_id, dataArr); // elements are of the form <ID, array[map<measurement,data>]>
			  }
			  myMap.get(sample.device_id).push(parseData(sample.device_data)); // add map of measurements to ID map
		  });
	  }

	  async function assembleSamples(next, myMap) {
		  while (!(next === undefined) && !(next === null)) {
			try {
				const apiData = await API.graphql({
					query: listSamples,
					variables: {
						nextToken: next,
						limit: 100,
					}
				});
				const samplesFromAPI = apiData.data.listSamples.items;
				parseSamples(samplesFromAPI, myMap);
				next = apiData.data.listSamples.nextToken;
			} catch (error) {
				console.log('Error on fetching samples: ', error);
			}
		  }
	  }

	  async function fetchSamples() {
		try {
			const apiData = await API.graphql({
				query: listSamples,
				variables: {
					limit: 100,
				}
			});
			const samplesFromAPI = apiData.data.listSamples.items;
			const sampleMap = new Map();
			let nextToken = apiData.data.listSamples.nextToken;
			
			parseSamples(samplesFromAPI, sampleMap);
			await assembleSamples(nextToken, sampleMap);
			
			console.log("samples = ", sampleMap);
			setSamples(sampleMap);
		} catch (error) {
			console.log('Error on fetching samples: ', error);
		}
	  }

	  function validateId(ids) {
		  try {
			  ids = ids.replace(/ /g, ''); // remove spaces
			  ids = ids.split(/,/); // tokenize string to create array of ids
			  let myHTML = '';
			  let validIDs = [];
			  let match = false;
			  ids.map(id => {
				  if (samples.get(id) !== undefined) {
					match = true; // check to see if we have a match first, so we can make container for tables
					setShowTables(true); // set state to show tables
					validIDs.push(id);
				  }
				  else {
					alert('Failed to find the id you entered. Please check your entry and try again.')
				  }
				  if (match) {
					  setIds(validIDs); // store the valid ids in state
				  }
			  });
		  } catch (error) {
			  console.log('Error on validating id(s): ', error);
		  }
	  }
	  
		function makeTables(id) {
			return (
				<div>
					<p>Status: Online</p>
					<p>Location: Santa Clara, CA</p>
					<p>Total number of records: {samples.get(id).length}</p>
					<Table highlightOnHover variation="bordered">
						<TableHead>
							<TableRow>
								<TableCell as="th">Sample</TableCell>
								<TableCell as="th">Time</TableCell>
								<TableCell as="th">V1</TableCell>
								<TableCell as="th">V2</TableCell>
								<TableCell as="th">V3</TableCell>
								<TableCell as="th">I1</TableCell>
								<TableCell as="th">I2</TableCell>
								<TableCell as="th">I3</TableCell>
								<TableCell as="th">In</TableCell>
								<TableCell as="th">W1</TableCell>
								<TableCell as="th">W2</TableCell>
								<TableCell as="th">W3</TableCell>
								<TableCell as="th">Wt</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{
							samples.get(id).map((sample, i) => {  // use samples [id => measurements] map to generate table data
								return (
									<TableRow>
										<TableCell>
										{i+1}
										</TableCell>
										<TableCell>
										{sample.get("T")}
										</TableCell>
										<TableCell>
										{sample.get("V1")}
										</TableCell>
										<TableCell>
										{sample.get("V2")}
										</TableCell>
										<TableCell>
										{sample.get("V3")}
										</TableCell>
										<TableCell>
										{sample.get("I1")}
										</TableCell>
										<TableCell>
										{sample.get("I2")}
										</TableCell>
										<TableCell>
										{sample.get("I3")}
										</TableCell>
										<TableCell>
										{sample.get("In")}
										</TableCell>
										<TableCell>
										{sample.get("W1")}
										</TableCell>
										<TableCell>
										{sample.get("W2")}
										</TableCell>
										<TableCell>
										{sample.get("W3")}
										</TableCell>
										<TableCell>
										{sample.get("Wt")}
										</TableCell>
									</TableRow>
								)
							})
						}
						</TableBody>
					</Table>
				</div>
			)
		}
	  
	  function makeTabs() {
		  return (
			<div className="margin-med">
				<Heading className="heading-blue" level={4}>Meter ID:</Heading>
				<Tabs.Container defaultValue="Tab 0" isLazy>
					<Tabs.List spacing="equal" justifyContent="center" indicatorPosition="top">
						{
							validIds.map((id, i) => { // create tab buttons
								return ( 
									<Tabs.Item value={'Tab ' + i} key={i}>
										{id}
									</Tabs.Item>
								)
							})
						}
					  </Tabs.List>
						{
							validIds.map((id, i) => { // create tab content
								return (
									<Tabs.Panel value={'Tab ' + i} key={i}>
										{makeTables(id)}
									</Tabs.Panel>
								)
							})
						}
				</Tabs.Container>
			</div>
		  );
	  }
	  
	  return(
		<ThemeProvider theme={theme}>
			<div className="page-margin black-bg horizontal" style={{padding: '0.75em 0em 0.75em 0em'}}>
				<img style={{marginLeft: '0.25em'}} src={pslogo} alt="PowerSight Logo" />
				<Heading level={4}>Administrator Console, Version 1.0</Heading>
			</div>
			<Card className="page-margin" variation="outlined">
				<div className="margin-small" style={{display: 'flex'}}>
					<div>
						<Heading className="heading-blue" level={5}>Customers</Heading>
						<p className="margin-small">Total: {customers.length}</p>
					</div>
					<Button size="small" className="right">Manage</Button>
				</div>
				<div className="margin-small">
					<Table highlightOnHover variation="bordered">
						<TableHead>
							<TableRow>
								<TableCell as="th">ID</TableCell>
								<TableCell as="th">Name</TableCell>
								<TableCell as="th">Company</TableCell>
								<TableCell as="th">Devices</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								customers.map((customer) => {
									return (
										<TableRow>
											<TableCell>{customer.id}</TableCell>
											<TableCell>{customer.name}</TableCell>
											<TableCell>{customer.company}</TableCell>
											<TableCell>{customer.devices}</TableCell>
										</TableRow>
									);
								})
							}
						</TableBody>
					</Table>
				</div>
			</Card>
			<Card className="page-margin" variation="outlined">
				<div className="margin-small" style={{display: 'flex'}}>
					<div>
						<Heading className="heading-blue" level={5}>Devices</Heading>
						<p className="margin-small">Total: {devices.length}</p>
					</div>
					<Button size="small" className="right">Manage</Button>
				</div>
				<div className="margin-small">
					<Table highlightOnHover variation="bordered">
						<TableHead>
							<TableRow>
								<TableCell as="th">ID</TableCell>
								<TableCell as="th">Serial Number</TableCell>
								<TableCell as="th">Model</TableCell>
								<TableCell as="th">Customer</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								devices.map((device) => {
									return (
										<TableRow>
											<TableCell>{device.id}</TableCell>
											<TableCell>{device.serial}</TableCell>
											<TableCell style={{textAlign: 'center'}}>
												{device.model} <br/>
												<img src={require(`/${device.model}.png`)} alt={device.model}/>
											</TableCell>
											<TableCell>{device.customer}</TableCell>
										</TableRow>
									);
								})
							}
						</TableBody>
					</Table>
				</div>
			</Card>
			<Card className="page-margin" variation="outlined">
				<div className="margin-small">
					<Heading className="heading-blue" level={4}>View Data Records:</Heading>
					<p className="margin-small">Please enter your meter id(s). Separate by commas for multiple inputs</p>
					<Flex>
						<TextField
							placeholder="00000, 00001, 00002"
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									validateId(e.currentTarget.value); // check if user input corresponds to valid meter ids
								}
							}}
							innerEndComponent={ // generate magnifying glass button
								<FieldGroupIconButton
								  ariaLabel="Search"
								  variation="link"
								  onClick={() => alert('Still developing, please press enter for now.')}
								>
								  <MdSearch />
								</FieldGroupIconButton>
							}
						/>
					</Flex>
				</div>
				{
					showTables && validIds.length && makeTabs() // check for showTables state and that we have hits for user entered ids
				}
			</Card>
			<div className="margin-med center">
				<Button variation="primary" size="large" onClick={signOut}>Sign Out</Button>
			</div>
		</ThemeProvider>
	);
};
***/

/***
TUTORIALS:
https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql
https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
https://ui.docs.amplify.aws/react/components/textfield
https://ui.docs.amplify.aws/react/components/tabs
https://stackoverflow.com/questions/69476529/way-to-render-a-new-component-onclick-in-react-js
https://www.youtube.com/watch?v=1TYObnD0RCA React Tutorial #4 - Dynamically Rendering Multiple Components
https://sentry.io/answers/unique-key-prop/
https://stackoverflow.com/questions/31284169/parse-error-adjacent-jsx-elements-must-be-wrapped-in-an-enclosing-tag
***/

/***
innerEndComponent={
	<FieldGroupIconButton
	  ariaLabel="Search"
	  variation="link"
	  onClick={() => alert('Still developing, please press enter for now.')}
	>
	  <MdSearch />
	</FieldGroupIconButton>
}
***/