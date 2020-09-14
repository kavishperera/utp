import React, { Component } from 'react';
import Web3 from 'web3';
import UTPContract from '../abis/Utp.json';

class Utp extends Component {

  state = { users: [] }

  componentDidMount = async => {
    this.metaMask();
    this.blockchain();
  }

  metaMask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  blockchain = async () => {
    const web3 = new Web3(window.ethereum);
    const account = await web3.eth.getAccounts();
    this.setState({ account });
    const getNetworkId = await web3.eth.net.getId();
    const getNetworkData = UTPContract.networks[getNetworkId];
    const utpContract = web3.eth.Contract(UTPContract.abi, getNetworkData.address)
    this.setState({ utpContract });
  }

  addUser = async (username, password) => {
    const account = this.state.account.toString();
    password = new Web3(window.ethereum).utils.toHex(password);
    this.state.utpContract.methods.setUser(username, password).send({ from: account });
  }

  getUsers = async () => {
    const count = await this.state.utpContract.methods.userCount().call();

    for (var i = 1; i <= count; i++) {
      const user = await this.state.utpContract.methods.users(i).call();
      this.setState({ users: [...this.state.users, user] })
    }
  }

  updatePassword = async (id, pass) => {
    const account = this.state.account.toString();
    pass = new Web3(window.ethereum).utils.toHex(pass);
    this.state.utpContract.methods.updatePassword(id, pass).send({ from: account });
  }


  render() {
    return (
      <>
        <table>
          <tbody>
            <tr>
              <td>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const txtUser = this.username.value.toString();
                  const txtPass = this.password.value.toString();
                  this.addUser(txtUser, txtPass);
                }}>

                  <input type="text" placeholder="username" ref={(input) => { this.username = input }} />
                  <input type="password" placeholder="password" ref={(input) => { this.password = input }} />
                  <input type="submit" />
                </form>
              </td>
              <td>
                <button onClick={(e) => { this.getUsers() }}>Show Users</button>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <br/>
                  {this.state.users.map((val, key) => (
                    <form key={key} onSubmit={(e)=>{
                      e.preventDefault();
                      const user = this.id.value.toString();
                      const pass = this.pass.value.toString();
                      this.updatePassword(user,pass);
                    }}>
                      <input type="text" disabled={true} value={val.id.toString()}  ref={(input)=>{this.id = input}}/>
                      <input type="text" disabled={true} value={val.username.toString()} ref={(input)=>{this.user = input}} />
                      <input type="text" ref={(input)=>{this.pass = input}}/>
                      <input type="submit" />
                    </form>
                  ))}              
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                    {JSON.stringify(this.state.users)}
              </td>
            </tr>
          </tbody>
        </table>





      </>
    );
  }
}

export default Utp;