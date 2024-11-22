const loading = document.getElementById("loading");
const table = document.querySelector("table");
const tbody = document.querySelector("tbody");

document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();
    loading.style.display = "block";
    table.style.display = "none";

    const fNameElement = document.getElementById("fName");
    const lNameElement = document.getElementById("lName");

    if (!fNameElement.checkValidity()) {
        fNameElement.reportValidity();
        return;
    } else if (!lNameElement.checkValidity()) {
        lNameElement.reportValidity();
        return;
    }
    var json = await possiblePull(fName.value, lName.value);
    json = json.values;
    console.log(json);
    var completed = false;

    tbody.innerHTML = "";
    if (json.length === 0) {
        const tableRow = document.createElement("tr");
        const tableCell = document.createElement("td");
        tableCell.textContent = "No results found";
        tableCell.colspan = "4";
        tableRow.appendChild(tableCell);
        tbody.appendChild(tableRow);
        completed = true;
    }
    if (!completed) {
        json.forEach(row => {
            const tableRow = document.createElement("tr");
            row.forEach((cell, index) => {
                if (index == 0) {
                    const tableCell = document.createElement("td");
                    const link = document.createElement("a");
                    link.textContent = cell.data;
                    link.href = "#";
                    link.addEventListener("click", async (event) => {
                        event.preventDefault();
                        sessionStorage.setItem("swimmerId", row[4].text);
                        sessionStorage.setItem("swimmer", JSON.stringify(row));
                        window.location.href = "stats.html";
                    })
                    tableCell.appendChild(link);
                    tableRow.appendChild(tableCell);
                    return;
                }
                else if (index == 4) {
                    return;
                }
                console.log(cell.data);
                const tableCell = document.createElement("td");
                tableCell.textContent = cell.data;
                tableRow.appendChild(tableCell);
            })
            tbody.appendChild(tableRow);
        })
    }
    loading.style.display = "none";
    table.style.display = "table";
})
async function possiblePull(firstName, lastName) {
    const possiblePayload = {
        metadata: [
            {
                jaql: {
                    title: "Name",
                    dim: "[Persons.FullName]",
                    datatype: "text"
                }
            },
            {
                jaql: {
                    title: "Club",
                    dim: "[Persons.ClubName]",
                    datatype: "text",
                    sort: "asc"
                }
            },
            {
                jaql: {
                    title: "LSC",
                    dim: "[Persons.LscCode]",
                    datatype: "text"
                }
            },
            {
                jaql: {
                    title: "Age",
                    dim: "[Persons.Age]",
                    datatype: "numeric"
                }
            },
            {
                jaql: {
                    title: "PersonKey",
                    dim: "[Persons.PersonKey]",
                    datatype: "numeric"
                }
            },
            {
                jaql: {
                    title: "FirstAndPreferredName",
                    dim: "[Persons.FirstAndPreferredName]",
                    datatype: "text",
                    filter: {
                        contains: "Yangyue"
                    }
                },
                panel: "scope"
            },
            {
                jaql: {
                    title: "LastName",
                    dim: "[Persons.LastName]",
                    datatype: "text",
                    filter: {
                        contains: "Zhu"
                    }
                },
                panel: "scope"
            }
        ],
        by: "ComposeSDK",
        count: 500,
        datasource: "Public Person Search",
        queryGuid: "b9691986-b328-458d-8cef-7bdc80483f27"
    };
    
    possiblePayload.metadata.forEach(row => {
        if (row.jaql.title === "FirstAndPreferredName") {
            row.jaql.filter.contains = firstName;
        } else if (row.jaql.title === "LastName") {
            row.jaql.filter.contains = lastName;
        }
    })
    
    const url1 = "https://usaswimming.sisense.com/api/datasources/Public%20Person%20Search/jaql?trc=sdk-ui-1.11.0";
    
    const response = await fetch(url1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjRhZjE4MGY5Nzg1MmIwMDJkZTU1ZDhkIiwiYXBpU2VjcmV0IjoiNzFjMjkyMGMtYmFkYy05YjYwLTM0YjMtMTViZTVmZmI0NmU0IiwiYWxsb3dlZFRlbmFudHMiOlsiNjRhYzE5ZTEwZTkxNzgwMDFiYzM5YmVhIl0sInRlbmFudElkIjoiNjRhYzE5ZTEwZTkxNzgwMDFiYzM5YmVhIn0.1NUT0_fmdUVZi7eOBe-EM_Tu2gArLDGPvHUYuLJzfeg"
      },
      body: JSON.stringify(possiblePayload),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}