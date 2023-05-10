//Required Imports
import { useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  //State to keep the array that holds the tape
  const [tape, setTape] = useState([1, 1, 1, 0, 1, 0, 1, 0, 0, 1]);

  //State to keep the set of instruction as an array of objects
  const [instructions, setInstructions] = useState([]);

  //A state to store the custom tape if any
  const [cust, setCust] = useState("");

  //States that store the input of the user
  const [state, setState] = useState("q0");
  const [read, setRead] = useState("0");
  const [action, setAction] = useState("0");
  const [next, setNext] = useState("q0");

  //State which stores the current state of the machine
  const [mach, setMach] = useState("q0");

  //State which stores the position of the head
  const [head, setHead] = useState(0);

  //Maximum number a machine can run before it halts
  const MAX_STEPS = 999;

  //Temperary variables
  let temp_state = mach;
  let temp;
  let temp_tape = tape;
  let temp_head = head;
  let counter = 0;

  //Function that runs the turing machine
  const turing = () => {
    console.log(counter);

    //To check if the machine has gone over the maximum number of steps allowed
    if (counter > MAX_STEPS) {
      alert("Machine has run more than 999 steps without halting !");
    } else {
      //A temperary set of instructions selected on the basis of the current state of the machine, if the machine is at
      //the final state, there will be no instructions in this variable and the machine will stop.
      temp = instructions.filter(function (quad) {
        return quad.state === temp_state;
      });

      //Mapping through the set of instructions
      temp.map((quad) => {
        //checking again if the machine is in the state of the instruction
        if (quad.state === temp_state) {
          //Setting temperary variable that stores the current value on the tape
          let curr = temp_tape[temp_head];

          //If the Value does not exist yet, add a 0 to the end of the tape
          if (curr !== 0 && curr !== 1) {
            temp_tape = [...temp_tape, 0];
            curr = temp_tape[temp_head];
            console.log(curr);
          }

          //If the read variable matches the instruction go ahead with the action
          if (curr == quad.read) {
            //updating the counter
            counter = counter + 1;

            //Switch case to determine what action to do
            switch (quad.action) {
              case "0":
                //Write 0 on the tape
                temp_tape[temp_head] = 0;
                break;
              case "1":
                //Write 1 on the tape
                temp_tape[temp_head] = 1;
                break;
              case "R":
                //Move to the Right
                temp_head = temp_head + 1;
                break;
              case "L":
                //If the head is not at the leftmost position then move to the left
                if (temp_head > 0) {
                  temp_head = temp_head - 1;
                }
                break;
              default:
                break;
            }

            //To change to the next state according to the instruction
            temp_state = quad.next;

            //Reccursively calling the turing function again to continue with the next set of instructions
            turing();
          }
        }
      });

      //Setting the temperary variables to the actual state
      setTape(temp_tape);
      setHead(temp_head);
      setMach(temp_state);
    }
  };

  //Function to handle the submitting of new instructions
  const handleSubmit = (e) => {
    let check = false;
    e.preventDefault();

    //To check if there are contradictory instructions
    instructions.map((item) => {
      if (item.state === state && item.read === read) {
        check = true;
      }
    });

    if (check) {
      alert("Cannot input contradictory instructions");
    } else {
      //Adding new instruction object to the array
      setInstructions((prev) => [
        ...prev,
        { state: state, read: read, action: action, next: next },
      ]);
    }
  };

  //Function to handle submitting a custom tape
  const handleTapeSubmit = (e) => {
    e.preventDefault();

    //Resetting all the state
    setTape([]);
    setMach("q0");
    setHead(0);
    setInstructions([]);
    let custTape = [];

    //Reading the input, splitting it converting it to an integer and creating the custom input tape
    cust.split("").forEach((character) => {
      //To check that the input tape can only contain 1's and 0's
      if (parseInt(character) === 0 || parseInt(character) === 1) {
        custTape.push(parseInt(character));
      } else {
        alert("Only 1 and 0 as input");
        return;
      }
    });
    setTape(custTape);
  };

  //Rendering the required HTML File
  return (
    <div className="App">
      <h1 className="heading">Turing Machine Simulator</h1>
      <h1 className="heading_name">by Omkar Mishra</h1>
      <div className="tape_label">Tape: </div>
      <div className="tape">| {tape.join(" | ")} |</div>
      <div className="detail">
        <div className="details">State: {mach}</div>
        <div className="details">Head: {head}</div>
      </div>
      <div>
        <Form className="tape_input">
          <Form.Label>Input a custom tape: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Ex - 10101010010111"
            onChange={(e) => setCust(e.target.value)}
          />
          <Button
            className="tape_submit"
            variant="primary"
            onClick={(e) => handleTapeSubmit(e)}
          >
            Submit
          </Button>
        </Form>
      </div>
      <div>
        <Form className="input">
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>In State</Form.Label>
              <Form.Control
                value={state}
                type="text"
                placeholder="q0"
                onChange={(e) => setState(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Read</Form.Label>
              <Form.Select
                defaultValue={read}
                onChange={(e) => setRead(e.target.value)}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Action</Form.Label>
              <Form.Select
                defaultValue={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value={0}>Write 0</option>
                <option value={1}>Write 1</option>
                <option value={"R"}>Move Right</option>
                <option value={"L"}>Move Left</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Change to State</Form.Label>
              <Form.Control
                value={next}
                type="text"
                placeholder="q0"
                onChange={(e) => setNext(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            Submit
          </Button>
        </Form>
      </div>
      {instructions.length > 0 && (
        <>
          <div className="instruc_label">
            Current Instructions are -
            <div className="instructions">
              {instructions.map((item, index) => (
                <div key={index}>
                  <div className="inst_detail">
                    &#123;{item.state}, {item.read}, {item.action}, {item.next}
                    &#125;
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Button variant="primary" onClick={turing}>
              Run
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
