import "./App.css";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

function App() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Set up the captcha ref
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (first_name && last_name) {
      let token = captchaRef.current.getValue();
      if (token) {
        let valid_token = await verifyToken(token);

        console.log("valid_token : ", valid_token);

        if (valid_token.data.success) {
          setMessage("Hurray!! you have submitted the form");
        } else {
          setError("Sorry!! Token invalid");
        }
      } else {
        setError("You must confirm you are not a robot");
      }
    } else {
      setError("First name and Last name are required");
    }
  };

  const verifyToken = async (token) => {
    try {
      let response = await axios.post(`http://localhost:4000/verify-token`, {
        secret: process.env.REACT_APP_SECRET_KEY,
        token,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("error ", error);
    }
  };

  return (
    <div className="App">
      {error && <p className="textError">Error!! {error}</p>}
      {message && <p className="textSuccess">Success!! {message}</p>}
      <form onSubmit={handleSubmit} className="formContainer">
        <div className="formGroup">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="Enter your first name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            placeholder="Enter your last name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="formGroup">
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_SITE_KEY}
            ref={captchaRef}
          />
        </div>
        <div className="formGroup">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default App;
