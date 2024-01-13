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
	
  const [showTables, setShowTables] = useState(false);
  
  const [validIds, setIds] = useState([]);

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
		const apiData = await API.graphql({ query: listSamples }, {limit: 1000});
		const samplesFromAPI = apiData.data.listSamples.items;
		const sampleMap = new Map();
		parseSample(samplesFromAPI, sampleMap);
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
		  let myArr = [];
		  let match = false;
		  ids.map(id => {
			  if (samples.get(id) !== undefined) {
				match = true;
				setShowTables(true); // check to see if we have a match first, so we can make container for tables
				myArr.push(id);
			  }
			  else {
				alert('Failed to find the id you entered. Please check your entry and try again.')
			  }
			  if (match) {
				  setIds(myArr); // store the valid ids in state
			  }
		  });
	  } catch (error) {
		  console.log('Error on validating id(s): ', error);
	  }
  }
  
	function makeTables(id) {
		return (
			<div>
				<p>Status: TBD</p>
				<p>Location: TBD</p>
				<p>Total number of samples: {samples.get(id).length}</p>
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
						samples.get(id).map((sample, i) => {
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
						validIds.map((id, i) => {
							return (
								<Tabs.Item value={'Tab ' + i} key={i}>
									{id}
								</Tabs.Item>
							)
						})
					}
				  </Tabs.List>
					{
						validIds.map((id, i) => {
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
  
  return (
	<ThemeProvider theme={theme}>
		<div className="margin-page">
			<Heading level={4}>PowerSight: Remote Monitoring</Heading>
		</div>
		<Card className="margin-page" variation="outlined">
			<div className="margin-small">
				<Heading className="heading-blue" level={4}>Search:</Heading>
				<p className="margin-small">Please enter your meter id(s). Separate by commas for multiple inputs:</p>
				<Flex>
					<TextField
						placeholder="00000, 00001, 00002"
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
							    validateId(e.currentTarget.value);
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
		    {
				showTables && validIds.length && makeTabs()
			}
		</Card>
		<div className="margin-med center">
			<Button onClick={signOut}>Sign Out</Button>
		</div>
	</ThemeProvider>
  );
};

export default withAuthenticator(App);

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