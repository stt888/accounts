import React, { Component } from 'react';
import Record from './record'
//import {getJSON} from 'jquery'
import * as RecordsAPI from '../utils/RecordsAPI'
import RecordForm from './RecordForm'
import AmountBox from './AmountBox'

// this component is parent component, included child components: Record, RecordForm, AmountBox
export default class Records extends Component {
  constructor(props){
    super(props)
      this.state = {
        error:null,
        isLoaded: false,
        records: []
      }
  }

  // use axios request API data
    componentDidMount(){
        RecordsAPI.getAll()
          .then(
              response => this.setState({
                  records: response.data,
                  isLoaded: true
              })
          ).catch(
              error => this.setState({
                  isLoaded: true,
                  error
              })

          )
    }
    // use jQuery request API data
    /*
      componentDidMount(){
        getJSON('https://5bef17c05b9d1a0013244587.mockapi.io/api/v1/records')
            .then(
                response=>this.setState({
                    records: response,
                    isLoaded: true
                }),
                error=> this.setState({
                    isLoaded: true,
                    error
                })
            )
      }
    */

    addRecord=(record)=>{
      this.setState({
          error:null,
          isLoaded: true,
          records: [
              ...this.state.records,
            record
          ]
      })
    }

    // use redux to update one new record
    updateRecord=(record, data)=>{
        const recordIndex = this.state.records.indexOf(record)
        const newRecords = this.state.records.map((item, index)=>{
            if(index !== recordIndex){
                return item
            }
            return {
                ...item,
                ...data
            }
        })
        this.setState({
            records: newRecords
        })
    }

    deleteRecord=(record)=>{
        const recordIndex = this.state.records.indexOf(record)
        const newRecords = this.state.records.filter((item, index)=>index !== recordIndex)
        this.setState({
            records: newRecords
        })
    }

    credit =() => {
        let credits = this.state.records.filter(record => record.amount >= 0)

        return credits.reduce((prev, curr)=>{
            return prev + Number.parseInt(curr.amount, 0)
        },0)
    }

    debit =() => {
        let debits = this.state.records.filter(record => record.amount < 0)

        return debits.reduce((prev, curr)=>{
            return prev + Number.parseInt(curr.amount, 0)
        },0)
    }

    balance =() => {
        return this.credit() + this.debit()
    }



  render() {
      const {error, isLoaded, records} = this.state
      let recordsComponent;

      if(error){
          recordsComponent = <div>Error: {error.responseText}</div>
      }else if(!isLoaded){
          recordsComponent = <div>Loading...</div>
      }else{
          recordsComponent = (
              <table className="table table-bordered">
                  <thead>
                  <tr>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {records.map((record,i)=>
                      <Record
                      key={i} record={record}
                      handleEditRecord={this.updateRecord}
                      handleDeleteRecord={this.deleteRecord}
                  />)}
                  </tbody>
              </table>
          )
      }

      return (
          <div >
              <h2>Records</h2>
              <div className="row mb-3">
                  <AmountBox text='Credit' type='success' amount={this.credit()}/>
                  <AmountBox text='Debit' type='danger' amount={this.debit()}/>
                  <AmountBox text='Balance' type='info' amount={this.balance()}/>
              </div>
              <RecordForm handleNewRecord={this.addRecord}/>
              {recordsComponent}
          </div>
      )
  }
}


