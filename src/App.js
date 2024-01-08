import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
	React,
	useState,
	useEffect
} from "react";
import { generateClient } from "aws-amplify/api";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
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
} from "@aws-amplify/ui-react";
import { listSamples } from "./graphql/queries";

const theme = {
  name: 'custom-theme',
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
	},
  },
};

const API = generateClient();

const App = ({ signOut }) => {
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    fetchSamples();
  }, []);

  async function fetchSamples() {
	try {
		const apiData = await API.graphql({ query: listSamples });
		const samplesFromAPI = apiData.data.listSamples.items;
		console.log('sample list', samplesFromAPI);
		setSamples(samplesFromAPI);
	} catch (error) {
		console.log('error on fetching samples', error);
	}
  }

  return (
    /*<View className="App">
      <Heading level={1}>My App</Heading>
      <Heading level={2}>Data</Heading>
      <View margin="3rem 0">
        {samples.map((sample) => (
          <Flex
            key={sample.device_id}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {sample.device_id}
            </Text>
            <Text as="span">{sample.sample_time}</Text>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>*/
	<ThemeProvider theme={theme}>
		<Card variation="outlined">
			<div className="margin-small">
				<Heading level={4}>PowerSight: Remote Monitoring</Heading>
				<Heading className="heading-blue" level={4}>Measurements</Heading>
			</div>
			<div>
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
				/>
			</div>
		</Card>
		<div>
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