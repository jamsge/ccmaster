import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table'

import characterData from './components/data.json'
import weightData from './components/weights.json'
import DropdownSelect from './components/DropdownSelect'

class App extends React.Component{

  constructor(props){
    super(props);

    this.changeAttacker = this.changeAttacker.bind(this);
    this.changeDefender = this.changeDefender.bind(this);
    this.getMoveNames = this.getMoveNames.bind(this);
    this.onRoundingChange = this.onRoundingChange.bind(this);

    const characterNames = [];
    for (const characterName in characterData)
    {
      characterNames.push(characterName);
    }
    characterNames.sort();

    var path = window.location.pathname;
    path = path.substring(1);
    path = path.split("-")
    console.log(path);

    const moveNames = this.getMoveNames("Falco");

    this.state = {
      attacker: "Falco",
      defender: "Fox",
      knockdownPercent: -1,
      ccPercent: -1,
      asdiDownPercent:-1,
      characterOptions: characterNames,
      attackOptions: moveNames,
      tableData:[],
      rounding:"integer"
    }
  }

  componentDidMount(){
    this.calculate();
  }

  getMoveNames(character){
    const list = characterData[character];
    let names = [];
    for (const i in list){
      names.push(list[i]["name"]);
    }
    names.sort();
    return names;
  }

  changeAttacker(a){
    this.setState({attacker:a});
    const moveNames = this.getMoveNames(a);
    this.setState({attackOptions: moveNames}, ()=>{this.calculate()});
  }

  changeDefender(d){
    this.setState({defender:d}, () => {this.calculate()});
  }

  calculate(){
    const data = characterData[this.state.attacker];
    const list = [];

    // p = base percent before attack (stale) damage
    // a = attack damage, includes stale
    // d = attack damange, no stale exlcuding projectiles
    // w = defender weight
    // s = knockback scaling
    // b = base knockback
    // r = ratio
    var ccpercent, asdipercent, ccfspercent, asdifspercent; 
    var a, d, w, s, b, r, cckb = 120, asdikb = 80;

    for (var i in data){
      // a = data[i]["DMG"];
      d = data[i]["DMG"];
      w = weightData[this.state.defender];
      s = data[i]["KBG"];
      b = data[i]["BKB"];
      // r = 0.666667;
      ccpercent = (((((cckb-b)/(0.01*s))-18)/(1.4*(200/(100+w))*(0.1+(d/20))))-d)
      asdipercent = (((((asdikb-b)/(0.01*s))-18)/(1.4*(200/(100+w))*(0.1+(d/20))))-d)
      ccfspercent = (((((cckb-b)/(0.01*s))-18)/(1.4*(200/(100+w))*(0.1+(d/20))))-d*.55)
      asdifspercent = (((((asdikb-b)/(0.01*s))-18)/(1.4*(200/(100+w))*(0.1+(d/20))))-d*.55)
      // console.log(this.state.attacker, data[i]["name"], ccpercent);
      
      list.push({
        name: data[i]["name"],
        cc: ccpercent,
        asdi: asdipercent,
        ccfs: ccfspercent,
        asdifs: asdifspercent
      })
    }
    if (this.state.rounding === "integer"){
      for (const i in list){
        for (const key in list[i]){
          if (typeof list[i][key] === "number"){
            if (Number.isInteger(list[i][key])){
              list[i][key]--;
            } else {
              list[i][key] = Math.floor(list[i][key]);
            }
          }
        }
      }
    }
    else if (this.state.rounding === "twoDecimal"){
      for (const i in list){
        for (const key in list[i]){
          if (typeof list[i][key] === "number"){
            list[i][key] = list[i][key].toFixed(2);
          }
        }
      }
    }
    list.sort(function(a,b){
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    this.setState({tableData:list});
    console.log(this.state);
  }
  
  onRoundingChange(event) {
    this.setState({
      rounding:event.target.value
    }, ()=> {this.calculate()})
  }


  render(){
    return (
      <div>
        <h1 style={{paddingTop:50, paddingBottom:30}} className="Title">
          "You don't CC enough!"
        </h1>
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col xl={5} lg={6} md = {12}>
              <Card>
                <Container fluid>
                  <Row>
                    <Col>
                      <h2 style={{paddingTop:25, paddingBottom:15}} className="Title">Attacker</h2>
                    </Col>
                  </Row>
                  <Form.Group as={Row} className="justify-content-md-center">
                    <Form.Label column="lg" lg={3} fluid>Character</Form.Label>
                    <Col fluid>
                      <DropdownSelect options={this.state.characterOptions} select={this.changeAttacker} default={this.state.attacker}/>
                    </Col>
                  </Form.Group>
                </Container>
              </Card>
            </Col>

            <Col xl={5} lg={6} md = {12}>
              <Card>
                <Container fluid>
                  <Row>
                    <Col>
                      <h2 style={{paddingTop:25, paddingBottom:15}} className="Title">Defender</h2>
                    </Col>
                  </Row>
                  <Form.Group as={Row} className="justify-content-md-center">
                    <Form.Label column="lg" lg={3} fluid>Character</Form.Label>
                    <Col fluid>
                      <DropdownSelect options={this.state.characterOptions} select={this.changeDefender} default={this.state.defender}/>
                    </Col>
                  </Form.Group>
                </Container>
              </Card>
            </Col>
          </Row>
          <Row className="justify-content-md-center" style={{paddingTop:10}}>
            <Col xl = {10} lg= {12}>
              <Card>
                <Container fluid style={{paddingTop:10, paddingBottom:10}}>
                  <Row>
                    <Col>
                      <div onChange={this.onChangeValue}>
                      <h5>Rounding</h5>
                      {/*
                      <Form.Check value="integer" type="radio" label="Nearest working integer" defaultChecked/>
                      <Form.Check value="twoDecimal" type="radio" label="Two decimals"/>
                      <Form.Check value="raw" type="radio" label="Raw"/>
                      */}
                      <div onChange={this.onRoundingChange}>
                        <div>
                          <input defaultChecked type="radio" value="integer" name="rounding" /> Nearest working integer
                        </div>
                        <div>
                          <input type="radio" value="twoDecimal" name="rounding" /> Two decimals
                        </div>
                        <div>
                          <input type="radio" value="Raw" name="rounding" /> Raw
                        </div>
                      </div>

                      </div>
                    </Col>
                  </Row>
                </Container>
              </Card>
            </Col>
          </Row>
          <Row className="justify-content-md-center" style={{paddingTop:20}}>
            <Col xl = {10} lg = {12}>
                <Table responsive striped bordered hover size="sm">
                  <thead>
                    <tr> 
                      <th>Attack</th>
                      <th>Max CC %</th>
                      <th>Max ASDI down %</th>
                      <th>Max CC % (fully stale)</th>
                      <th>Max ASDI down % (fully stale)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.tableData.map((el, i) => {
                        return(
                          <tr key = {i}>
                            <td>{el.name}</td>
                            <td>{el.cc}</td>
                            <td>{el.asdi}</td>
                            <td>{el.ccfs}</td>
                            <td>{el.asdifs}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
            </Col>
          </Row>
          <Row className="justify-content-md-center" style={{paddingTop:20, paddingBottom:20}}>
            <Col md={10}>
            <Card>
              <Card.Body>
                <Card.Title>
                  Other information
                </Card.Title>
                <Card.Text>
                  Hi! I'm jams, and this is my crouch-cancel tool :) made with ReactJS and React-Bootstrap! 
                  <br />
                  I don't crouch cancel enough in neutral, so making this tool will give leave me no excuse to learn how to do it better and more often.
                  <br />
                  Negative percentages means that a move can't be crouch canceled.
                  <br />
                  Huge credit to cagliostro9 for creating <a href="https://docs.google.com/spreadsheets/d/1Z0RT4gCmgK6Cn3-2GSSWSMbLySD5-UsaagDaNF9EZqk/htmlview#">this huge spreadsheet</a> which I yoinked lots of information from.
                  <br />
                  This site is still under construction, so expect broken stuff as well as new features to come.
                  <br />
                  If you have any questions, feel free to shoot me something on discord (jams#1008)!
                </Card.Text>
              </Card.Body>
            </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
  

export default App;
