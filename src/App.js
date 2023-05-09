import { useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tape, setTape] = useState([1, 1, 1, 0, 1, 0, 1, 0, 0, 1]);
  // const [tape, setTape] = useState(Array(100).fill(0));
  const [instructions, setInstructions] = useState([]);
  const [cust, setCust] = useState("");

  const [state, setState] = useState("q0");
  const [read, setRead] = useState("0");
  const [action, setAction] = useState("0");
  const [next, setNext] = useState("q0");

  const [mach, setMach] = useState("q0");
  const [head, setHead] = useState(0);

  const MAX_STEPS = 999;

  let temp_state = mach;
  let temp;
  let temp_tape = tape;
  let temp_head = head;
  let counter = 0;

  const turing = () => {
    // counter = counter + 1;
    console.log(counter);
    if (counter > MAX_STEPS) {
      alert("Machine has run more than 999 steps without halting !");
    } else {
      temp = instructions.filter(function (quad) {
        return quad.state === temp_state;
      });
      temp.map((quad) => {
        if (quad.state === temp_state) {
          let curr = temp_tape[temp_head];
          if (curr !== 0 && curr !== 1) {
            temp_tape = [...temp_tape, 0];
            curr = temp_tape[temp_head];
            console.log(curr);
          }
          // console.log(curr);
          // console.log(temp_tape[12]);
          if (curr == quad.read) {
            counter = counter + 1;
            // console.log(curr);
            switch (quad.action) {
              case "0":
                temp_tape[temp_head] = 0;
                // console.log(temp_tape);
                break;
              case "1":
                temp_tape[temp_head] = 1;
                // console.log(temp_tape);
                break;
              case "R":
                temp_head = temp_head + 1;
                break;
              case "L":
                if (temp_head > 0) {
                  temp_head = temp_head - 1;
                }
                break;
              default:
                break;
            }
            if (temp_state === quad.next) {
              turing();
            } else {
              temp_state = quad.next;
              turing();
            }
          }
        }
      });
      setTape(temp_tape);
      setHead(temp_head);
      setMach(temp_state);
    }
  };

  const handleSubmit = (e) => {
    let check = false;
    e.preventDefault();
    instructions.map((item) => {
      if (item.state === state && item.read === read) {
        check = true;
      }
    });

    if (check) {
      alert("Cannot input contradictory instructions");
    } else {
      setInstructions((prev) => [
        ...prev,
        { state: state, read: read, action: action, next: next },
      ]);
    }
  };

  const handleTapeSubmit = (e) => {
    e.preventDefault();
    // console.log(cust.length);
    setTape([]);
    setMach("q0");
    setHead(0);
    setInstructions([]);
    let custTape = [];
    cust.split("").forEach((character) => {
      if (parseInt(character) === 0 || parseInt(character) === 1) {
        custTape.push(parseInt(character));
      } else {
        alert("Only 1 and 0 as input");
        return;
      }
    });
    setTape(custTape);
  };

  // console.log(instructions);
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
