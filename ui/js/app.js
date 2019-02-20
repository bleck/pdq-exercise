/**
 * Simple Javascript functionality for the page
 * I would normally use a library for a larger website (react, babel, css modules etc)
 * but it seems so hefty for a simple process
 */

const socket = io();
const apiPath = "/api"
const els = {}        // Storage for elements

let hasError = false  // Used to know if an error occured and we need to clear error text on next success
// Setting the error message
const setError = (msg) => {
  if(!msg) msg = "An unknown error occured, try again!"
  else msg = `PDQ API returned: ${msg}\nMaybe you should try again?`
  els.errorContainer.innerText = msg
  hasError = true
}

// Function to call when payload from WS comes through
const setEmployee = employee => {
  console.log("SET EMPLOYEE CALLED")
  if(hasError) {
    els.errorContainer.innerText = ""
    hasError = false
  }
  els.employeeImage.src = employee.imgSrc
  els.employeeName.innerText = employee.name
  els.employeeBeer.innerText = employee.drink
}

// Just updating the dom with payload from WS
socket.on('refresh', setEmployee)

document.addEventListener("DOMContentLoaded", () => {
  // Cache elements so we don't dig into the DOM every call
  els.employeeImage = document.getElementById('employeeImage')
  els.employeeName = document.getElementById('employeeName')
  els.employeeBeer = document.getElementById('employeeDrink')
  els.errorContainer = document.getElementById('errorContainer')

  // Event listener that triggers an update
  document.getElementById('refreshBtn').addEventListener('click', () => {
    fetch(`${apiPath}/employee`)
      .then(r => {
        if(!r.ok) return r.text()
      })
      .then(e => {
        if(e) throw e
      })
      .catch(setError)
  })
})