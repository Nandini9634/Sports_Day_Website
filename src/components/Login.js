import React, { useState } from "react";
import { Endpoints } from "../constant/model";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.jpg";
import "../css/Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    userName: "",
    userEmailId: "",
    userId: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    userName: false,
    userEmailId: false,
    userId: false,
  });

  const [boxColor, setBoxColor] = useState("lightblue");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setFieldErrors({
      ...fieldErrors,
      [name]: false,
    });
  };

  const navigate = useNavigate();

  const handleUserLogin = async () => {
    if (!formData.userName || !formData.userEmailId || !formData.userId) {
      alert("Please enter all values.");

      setFieldErrors({
        userName: !formData.userName,
        userEmailId: !formData.userEmailId,
        userId: !formData.userId,
      });
      return;
    }
    setBoxColor("white");

    try {
      const apiUrl =
        Endpoints.SPORTS_DAY_API +
        Endpoints.API +
        Endpoints.VERSION_1 +
        Endpoints.LOGIN;
      const requestBody = {
        id: formData.userId,
        name: formData.userName,
        email: formData.userEmailId,
        password: " ",
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        navigate(`/playerAccount/${formData.userId}`);
      } else {
        alert("Login failed. Please try again after some time.");
        window.location.reload();
      }
    } catch (error) {
      alert("Login failed. Please try again after some time.");
      window.location.reload();
      console.error("Network error: ", error);
    }
  };

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div
        className="login-box"
        style={{
          backgroundColor: boxColor,
        }}
      >
        <h1>Welcome! Please login to your player account.</h1>
        <div
          style={{
            backgroundColor: fieldErrors.userName ? "red" : "transparent",
          }}
        >
          <label htmlFor="userName" className="login-input-label">
            User Name
          </label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div
          style={{
            backgroundColor: fieldErrors.userEmailId ? "red" : "transparent",
          }}
        >
          <label htmlFor="userEmailId" className="login-input-label">
            Email Id
          </label>
          <input
            type="email"
            name="userEmailId"
            id="userEmailId"
            value={formData.userEmailId}
            onChange={handleChange}
            required
          />
        </div>
        <div
          style={{
            backgroundColor: fieldErrors.userId ? "red" : "transparent",
          }}
        >
          <label htmlFor="userId" className="login-input-label">
            User Id
          </label>
          <input
            type="text"
            name="userId"
            id="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button onClick={handleUserLogin} className="login-submit-button">
            Submit
          </button>
        </div>
        <div style={{ color: "blue" }}>
          <br></br>Don't worry if you are not registered, We will set up for
          you!!
        </div>
      </div>
    </div>
  );
}
