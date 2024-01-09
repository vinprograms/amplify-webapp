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

const theme: Theme = {
  name: 'powersight-theme',
  tokens: {
    components: {
		card: {
			backgroundColor: { value: '{colors.neutral.10]}' },
			outlined: {
			  borderColor: { value: '{colors.black}' },
			  borderRadius: { value: '{radii.small}' },
			},
		},
		heading: {
			color: { value: '{colors.red.60}' },
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
				color: { value: '{colors.red.60}' },
			  },
			  _active: {
				color: { value: '{colors.red.60}' },
				borderColor: { value: '{colors.red.80}' },
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
				fontWeight: { value: '{fontWeights.normal}' },
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
	},
  },
};

const API = generateClient();

const App = ({ signOut }) => {
  const [samples, setSamples] = useState([]); // set samples as state variable and tie it to setSamples() function

  useEffect(() => { // call fetchSamples() once on render
    fetchSamples();
  }, []);

  function parseData(data) {
	  data = data.replace(/[\"{}]/g, ''); // remove special characters that are part of JSON string
	  const splitData = data.split(','); // tokenize string to create array of measurements
	  const dataMap = new Map();
	  splitData.map(data => { // iterate through tokenized string and create map of <"MEASUREMENT TYPE", VALUE>
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
  
  function parseSample(samples, myMap) { // create a map of <id, array>
	  samples.map(sample => {
		  if (myMap.get(sample.device_id) === undefined) { // if map doesn't contain meter id yet, initialize with <id, array[map]>
			const dataArr = [];
			myMap.set(sample.device_id, dataArr); // elements are of the form <ID, array[map<measurement,data>]>
		  }
		  myMap.get(sample.device_id).push(parseData(sample.device_data)); // add map of measurements to map array
	  });
  }

  async function fetchSamples() {
	try {
		const apiData = await API.graphql({ query: listSamples });
		const samplesFromAPI = apiData.data.listSamples.items;
		const sampleMap = new Map();
		parseSample(samplesFromAPI, sampleMap);
		setSamples(sampleMap);
		console.log("Samples parsed successfully", samples);
	} catch (error) {
		console.log('Error on fetching samples: ', error);
	}
  }

  function makeTable(id, arrayMap) {
	  console.log('arrayMap = ', arrayMap);
  }
  
  function validateID(ids) {
	  try {
		  ids = ids.replace(/ /g, ''); // remove spaces
		  ids = ids.split(/,/); // tokenize string to create array of ids
		  ids.map(id => {
			  if (samples.get(id) !== undefined) {
				makeTable(id, samples.get(id));
				//document.getElementById("search").style.display = "none";
			  }
			  else {
				alert('Failed to find the id you entered. Please check your entry and try again.')
			  }
		  });
	  } catch (error) {
		  console.log('Error on validating id(s): ', error);
	  }
  }

  return (
	<ThemeProvider theme={theme}>
		<Card style={{margin: "1em"}} variation="outlined">
			<div className="margin-small header">
				<Heading level={4}>PowerSight: Remote Monitoring</Heading>
			</div>
			<div className="margin-med" id="search">
				<p>Please enter your meter id(s). Separate by commas for multiple inputs:</p>
				<Flex>
					<TextField
						placeholder="00000, 00001, 00002"
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
							  validateID(e.currentTarget.value);
							}
						}}
						innerEndComponent={
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
			<Heading className="margin-small heading-blue" level={4}>Meter ID:</Heading>
			<Tabs
				  spacing="equal"
				  justifyContent="center"
				  indicatorPosition="top"
				  defaultValue='Tab 1'
				  items={[
					{
						label: '4287',
						value: 'Tab 1',
						content: (
							<Table highlightOnHover variation="striped">
								<TableBody>
								</TableBody>
							</Table>
						),
					},
					{
					label: '213',
					value: 'Tab 2',
					content: (
						<Table highlightOnHover variation="striped">
						  <TableHead>
							<TableRow>
							  <TableCell as="th">Device ID</TableCell>
							  <TableCell as="th">Measurement</TableCell>
							  <TableCell as="th">Value</TableCell>
							</TableRow>
						  </TableHead>
						  <TableBody>
							<TableRow>
							  <TableCell>22</TableCell>
							  <TableCell>I1</TableCell>
							  <TableCell>1000</TableCell>
							</TableRow>
							<TableRow>
							  <TableCell>22</TableCell>
							  <TableCell>I2</TableCell>
							  <TableCell>2000</TableCell>
							</TableRow>
							<TableRow>
							  <TableCell>22</TableCell>
							  <TableCell>I3</TableCell>
							  <TableCell>3000</TableCell>
							</TableRow>
						  </TableBody>
						</Table>
					),
				},
			  ]}
			/>
		</Card>
		<div className="margin-med center">
			<Button onClick={signOut}>Sign Out</Button>
		</div>
	</ThemeProvider>
  );
};

export default withAuthenticator(App);

/***TUTORIALS:
https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql
https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
***/

/*

<Heading className="heading-blue" level={4}>Measurements</Heading>

<Tabs
				  spacing="equal"
				  justifyContent="center"
				  indicatorPosition="top"
				  defaultValue='Tab 1'
				  items={[
					{
						label: 'Voltage',
						value: 'Tab 1',
						content: (
							<Table highlightOnHover variation="striped">
								<TableBody>
								{samples.map((sample) => {
									return (	
										<TableRow key={sample.device_id}>
											<TableCell>{sample.device_id}</TableCell>
											<TableCell>{sample.sample_time}</TableCell>
											<TableCell>{sample.device_data}</TableCell>
										</TableRow>
									)
								})}
								</TableBody>
							</Table>
						),
					},
					{
						label: 'Current',
						value: 'Tab 2',
						content: (
							<Table highlightOnHover variation="striped">
							  <TableHead>
								<TableRow>
								  <TableCell as="th">Device ID</TableCell>
								  <TableCell as="th">Measurement</TableCell>
								  <TableCell as="th">Value</TableCell>
								</TableRow>
							  </TableHead>
							  <TableBody>
								<TableRow>
								  <TableCell>22</TableCell>
								  <TableCell>I1</TableCell>
								  <TableCell>1000</TableCell>
								</TableRow>
								<TableRow>
								  <TableCell>22</TableCell>
								  <TableCell>I2</TableCell>
								  <TableCell>2000</TableCell>
								</TableRow>
								<TableRow>
								  <TableCell>22</TableCell>
								  <TableCell>I3</TableCell>
								  <TableCell>3000</TableCell>
								</TableRow>
							  </TableBody>
							</Table>
						),
					},
					{ label: 'Power', value: 'Tab 3', content: 'Tab content #3' },
					{ label: 'THD', value: 'Tab 4', content: 'Tab content #4', isDisabled: true },
					{ label: 'Phasors', value: 'Tab 5', content: 'Tab content #5', isDisabled: true },
				  ]}
				/>*/