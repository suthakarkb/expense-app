import React, {Component, forwardRef} from 'react';
import { GoogleLogin } from 'react-google-login';
import { Grid, Input, Button } from 'semantic-ui-react';
import logo from './images/emlogo2.jpg';
import config from './data/config'
import axios from "axios";

import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import './App.css';

const responseGoogle = (response) => {
  console.log(response);
}

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
const fieldName = ["email", "amount", "payee", "category", "paymethod", "description", "paymentdate"];
const columns = [
  { title: 'Amount Paid', field: 'amount', cellStyle: {
       width: 10,
       maxWidth: 10
     },
     headerStyle: {
       width:10,
       maxWidth: 10
     } },
  { title: 'Payee', field: 'payee' , cellStyle: {
       width: 20,
       maxWidth: 20
     },
     headerStyle: {
       width:20,
       maxWidth: 20
     } },
  { title: 'Category', field: 'category' , cellStyle: {
       width: 10,
       maxWidth: 10
     },
     headerStyle: {
       width:10,
       maxWidth: 10
     } },
  { title: 'Payment Metod', field: 'paymethod' , cellStyle: {
       width: 20,
       maxWidth: 20
     },
     headerStyle: {
       width:20,
       maxWidth: 20
     } },
  { title: 'Description', field: 'description' , cellStyle: {
          width: 30,
          maxWidth: 30
        },
        headerStyle: {
          width:30,
          maxWidth: 30
   } },
   { title: 'Payment Time', field: 'paymentdate' , cellStyle: {
           width: 30,
           maxWidth: 30
         },
         headerStyle: {
           width:30,
           maxWidth: 30
    } }
];

// const handleLogin = async googleData => {
//    console.log('tokenId', googleData.tokenId);
//    const res = await fetch("/api/v1/auth/google", {
//        method: "POST",
//        body: JSON.stringify({
//        token: googleData.tokenId
//      }),
//      headers: {
//        "Content-Type": "application/json"
//      }
//    })
//    const data = await res.json()
//  }

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
	  email: '',
    idToken: '',
	  amount: 0.0,
	  payee: '',
	  category: '',
	  paymethod: '',
	  status: '',
	  description: '',
	  paymentdate: '',
	  passcode: '',
	  error: '',
	  dataRows: [],
	  loggedIn: false
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleChange = (e) => {
   this.setState({
    [e.target.name]: e.target.value
   });
  }

authenticateUser = async () => {
   try {
    let data = {};
    data.name = 'suthakar bose';
    data.email = this.state.email;
    data.locale = 'en';
    console.log('authUrl:',config.userValidation);
    console.log('payload:',data);
    await axios.post(config.userValidation, data).then(
      res => {
        console.log('response2',res.data);
        this.setState({
         loggedIn: true,
         error: ''
       });
      })
      .catch(
        error => {
          console.log(error);
          this.setState({
           error: "Invalid User / Token"
         });
        })
      } catch (err) {
        console.log('Error Occured');
      }
}


listExpenses = async () => {
   try {
    console.log('listExpenses:',config.dbhost+config.listExpenses);
    let header = {
      headers: {
        authorization: 'value',
      }
    }
    await axios.get(config.dbhost+config.listExpenses, header).then(
      res => {
        console.log('response2',res.data);
        this.setState({
         loggedIn: true,
         dataRows: res.data.data,
         error: ''
       });
      })
      .catch(
        error => {
          console.log(error);
          this.setState({
           error: "Error while retrieving expenses"
         });
        })
      } catch (err) {
        console.log('Error Occured');
      }
}

addExpense = (expense) => {
  expense.status = 'Cleared';
  console.log('addExpense',config.dbhost+config.createExpense);
  console.log('expense',expense);
  delete expense.tableData;
  let header = {
    headers: {
      authorization: 'value',
    }
  };
  try {
      axios.post(config.dbhost+config.createExpense, expense, header).then(res => {
      console.log(res);
      this.listExpenses();
      })
    } catch (err) {
      console.log(err.message);
    }
}

updatedExpense = (expense) => {
  expense.status = 'Cleared';
  console.log('updateExpense',config.dbhost+config.updateExpense);
  console.log('expense',expense);
  delete expense.tableData;
  delete expense.paymentdate;
  let header = {
    headers: {
      authorization: 'value',
    }
  };
  try {
        axios.put(config.dbhost+config.updateExpense, expense, header).then(res => {
        console.log(res);
        this.listExpenses();
      })
    } catch (err) {
      console.log(err.message);
    }
}

deleteExpense = (expense) => {
  console.log('deleteExpense',config.dbhost+config.deleteExpense+expense.id);
  console.log('expense',expense);
  let header = {
    headers: {
      authorization: 'value',
    }
  };
  try {
        axios.delete(config.dbhost+config.deleteExpense+expense.id, header).then(res => {
        console.log(res);
        this.listExpenses();
      })
    } catch (err) {
      console.log(err.message);
    }
}

renderHeader() {
  console.log('renderHeader');
  let thead = [];
  for (let i = 0; i < fieldName.length; i++) {
    thead.push(<th> { fieldName[i] } </th>)
  }
  return thead;
}

renderRows() {
  console.log('renderRows', this.state.dataRows);
  let rows = [];
  for (let i = 0; i < this.state.dataRows.length; i++) {
	  let columns = [];
	  for (let j = 0; j < fieldName.length; j++) {
		  //console.log(this.state.dataRows[i][[this.state.fieldNames[j].name]]);
		  columns.push(<td>{this.state.dataRows[i][fieldName[j]]}</td>);
	  }
	  rows.push(<tr class='left aligned'>{columns}</tr>);
  }
  return rows;
}

  render() {
    return (
      <div className="App">
		<header className="App-header">
		 <img src={logo} className="App-logo" alt="logo"  />
		 {!this.state.loggedIn &&
			  <div>
				  <p>
					<Input type="text" placeholder="Email..." name='email' value={this.state.email} onChange={this.handleChange.bind(this)} />
				  </p>
				  <p>
					<Input type="password" placeholder="Password..." name='passcode' value={this.state.passcode} onChange={this.handleChange.bind(this)} />
				  </p>
				  <p>
							     (OR)
				  </p>
				  <p>

								  <GoogleLogin
									         clientId="997832158711-ujmuftojk6hm1qin07478mbce64bkolh.apps.googleusercontent.com"
									         buttonText="Google Signin"
									         onSuccess={responseGoogle}
									         onFailure={responseGoogle}
									         cookiePolicy={'single_host_origin'}
						      />
				  </p>
				  <p>
					<Button class="ui button" onClick={this.listExpenses} > <b> Submit </b> </Button>
				  </p>
			  </div>
		   }

       {this.state.loggedIn && this.state.dataRows && this.state.dataRows.length > 0 &&
          <div class="Result-Table">
            <p> </p> <p> <div class="App-Label"> List of my expenses </div></p> <p> </p>
            <p> </p> <p> <div class="App-Label"> </div></p> <p> </p>
            <Grid>
                <Grid.Row style={{ padding: '10px 0px 0px 0px'}} width={16}>
                <Grid.Column width={16}>
                <MaterialTable
        //options={{ paging: false }}
                icons={tableIcons}
                title="Expense List"
                columns={columns}
                data={this.state.dataRows}
                editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                        let data1 = [];
                        if(this.state.dataRows && this.state.dataRows.length > 0) {
                          for(let i=0; i< this.state.dataRows.length; i++)
                            data1.push(this.state.dataRows[i]);
                        }
                        data1.push(newData);
                        //setData([...data, newData]);
                        this.setState({ dataRows: data1 });
                        this.addExpense(newData);
                        resolve();
                    }, 1000);
                }),
            onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const dataUpdate = [...this.state.dataRows];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        this.updatedExpense(newData);
                        resolve();
                        this.setState({ dataRows: dataUpdate });
                    }, 1000);
                }),
            onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const dataDelete = [...this.state.dataRows];
                        const index = oldData.tableData.id;
                        this.deleteExpense(dataDelete[index]);
                        dataDelete.splice(index, 1);
                        this.setState({ dataRows: dataDelete });
                        resolve();
                    }, 1000);
                })
              }}
          />
          </Grid.Column>
          </Grid.Row>
          </Grid>

        </div>
      }


		</header>
	  </div>
	 );
  }
}

export default App;
