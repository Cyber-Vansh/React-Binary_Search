import React from "react";
import {useState} from "react"
import {useEffect} from "react"
import "./App.css";

const BinarySearchVisualizer = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState("");
  const [steps, setSteps] = useState([]);
  const [foundIndex, setFoundIndex] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    generateArray();
  }, []);

  useEffect(() => {
    if (autoPlay && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, autoPlay, steps]);

  const generateArray = () => {
    const sortedArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);
    setArray(sortedArray);
    setSteps([]);
    setFoundIndex(null);
    setCurrentStep(0);
    setAutoPlay(false);
  };

  const binarySearch = () => {
    let left = 0, right = array.length - 1;
    let searchSteps = [];

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      searchSteps.push({
        text: `Checking middle index ${mid} (value: ${array[mid]})`,
        highlightedIndex: mid,
        leftBound: left,
        rightBound: right
      });
      
      if (array[mid] === Number(target)) {
        searchSteps.push({
          text: `Target found at index ${mid}`,
          highlightedIndex: mid
        });
        setSteps(searchSteps);
        setFoundIndex(mid);
        setAutoPlay(true);
        return;
      } else if (array[mid] < Number(target)) {
        searchSteps.push({
          text: `Target is greater than ${array[mid]}, searching right part`,
          highlightedIndex: mid,
          leftBound: mid + 1,
          rightBound: right
        });
        left = mid + 1;
      } else {
        searchSteps.push({
          text: `Target is less than ${array[mid]}, searching left part`,
          highlightedIndex: mid,
          leftBound: left,
          rightBound: mid - 1
        });
        right = mid - 1;
      }
    }
    searchSteps.push({
      text: "Target not found",
      highlightedIndex: -1
    });
    setSteps(searchSteps);
    setFoundIndex(-1);
    setAutoPlay(true);
  };

  return (
    <div className="container">
      <h1>Binary Search Visualizer</h1>
      <div className="controls">
        <button onClick={generateArray} className="button generate-btn">
          Generate New Array
        </button>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ""))}
          className="input"
          placeholder="Enter target number"
        />
        <button onClick={binarySearch} className="button search-btn">
          Search
        </button>
      </div>
      
      {array.length > 0 && (
        <div className="array-section">
          <div className="array-container">
            {array.map((num, idx) => (
              <div key={idx} className="array-box">
                <div className="array-value">{num}</div>
                <div className="array-index">{idx}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {steps.length > 0 && currentStep < steps.length && (
        <div className="visualization">
          <div className="step-info">
            <div className="step-text">{steps[currentStep].text}</div>
            <div className="array-container">
              {array.map((num, i) => (
                <div
                  key={i}
                  className={`array-box ${
                    steps[currentStep].highlightedIndex === i ? "highlight" : ""
                  } ${
                    i >= steps[currentStep].leftBound && i <= steps[currentStep].rightBound
                      ? "active"
                      : "inactive"
                  }`}
                >
                  <div className="array-value">{num}</div>
                  <div className="array-index">{i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {foundIndex !== null && currentStep === steps.length && (
        <div className={`result ${foundIndex === -1 ? "error" : "success"}`}>
          {foundIndex === -1
            ? "Target not found in the array!"
            : `Target found at index ${foundIndex}`}
        </div>
      )}
    </div>
  );
};

export default BinarySearchVisualizer;
