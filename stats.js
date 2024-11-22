const tableBody = document.querySelector('tbody');
const table = document.querySelector('table');
const loading = document.getElementById("loading");
const nameElement = document.getElementById("name");
const swimmerInfo = document.getElementById("swimmerInfo");

window.onload = async function () {
  const swimmer = JSON.parse(sessionStorage.getItem("swimmer"));
  document.title = swimmer[0].data;
  nameElement.textContent = swimmer[0].data;
  swimmerInfo.innerHTML = `
    <p><strong>Age:</strong> ${swimmer[1].data}</p>
    <p><strong>LSC:</strong> ${swimmer[2].data}</p>
    <p><strong>Club:</strong> ${swimmer[3].data}</p>
  `;

  loading.style.display = "block";
  nameElement.style.display = "none";
  swimmerInfo.style.display = "none";
  table.style.display = "none";
  var json = await statsPull();
  console.log(json.values);
  json.values.forEach(row => {
      const tableRow = document.createElement("tr");
      row.forEach((cell, index) => {
          var data = cell.text;
          if (index === 4) {
              if (data.startsWith('"')) {
                  data = data.slice(1);
              }
              if (data.endsWith('"')) {
                  data = data.slice(0, -1);
              }
          } else if (index === 8) {
            data = data.split(" ")[0];
            data = data.split("/");
            var temp = data[0];
            data[0] = data[1];
            data[1] = temp;
            data = data.join("/");
          }
          else if (index >= 9 && index <= 12) {
              return;
          }
          const tableCell = document.createElement("td");
          tableCell.innerText = data;
          tableRow.appendChild(tableCell);
      })
      tableBody.appendChild(tableRow);
  })
  loading.style.display = "none";
  nameElement.style.display = "block";
  swimmerInfo.style.display = "block";
  table.style.display = "table";
}
// Fetch swimmer's basic data on load and display
// Once table data is populated fetch and display, otherwise show no results
// Fetch data every second (???)

async function statsPull() {
    const statsPayload = {
        "metadata": [
          {
            "jaql": {
              "title": "Event",
              "dim": "[SwimEvent.EventCode]",
              "datatype": "text"
            }
          },
          {
            "jaql": {
              "title": "SwimTime",
              "dim": "[UsasSwimTime.SwimTimeFormatted]",
              "datatype": "text"
            }
          },
          {
            "jaql": {
              "title": "Age",
              "dim": "[UsasSwimTime.AgeAtMeetKey]",
              "datatype": "numeric"
            }
          },
          {
            "jaql": {
              "title": "Points",
              "dim": "[UsasSwimTime.PowerPoints]",
              "datatype": "numeric"
            }
          },
          {
            "jaql": {
              "title": "TimeStandard",
              "dim": "[TimeStandard.TimeStandardName]",
              "datatype": "text"
            }
          },
          {
            "jaql": {
              "title": "Meet",
              "dim": "[Meet.MeetName]",
              "datatype": "text"
            }
          },
          {
            "jaql": {
              "title": "LSC",
              "dim": "[OrgUnit.Level3Code]",
              "datatype": "text"
            }
          },
          {
            "jaql": {
              "title": "Team",
              "dim": "[OrgUnit.Level4Name]",
              "datatype": "text"
            }
          },
          {
            "jaql": {
              "title": "SwimDate",
              "dim": "[SeasonCalendar.CalendarDate]",
              "datatype": "datetime"
            },
            "format": {
              "mask": {
                "days": "MM/dd/yyyy"
              }
            }
          },
          {
            "jaql": {
              "title": "PersonKey",
              "dim": "[UsasSwimTime.PersonKey]",
              "datatype": "numeric"
            }
          },
          {
            "jaql": {
              "title": "SwimEventKey",
              "dim": "[UsasSwimTime.SwimEventKey]",
              "datatype": "numeric"
            }
          },
          {
            "jaql": {
              "title": "MeetKey",
              "dim": "[UsasSwimTime.MeetKey]",
              "datatype": "numeric"
            }
          },
          {
            "jaql": {
              "title": "SortKey",
              "dim": "[UsasSwimTime.SortKey]",
              "datatype": "text",
              "sort": "asc"
            }
          },
          {
            "jaql": {
              "title": "PersonKey",
              "dim": "[UsasSwimTime.PersonKey]",
              "datatype": "numeric",
              "filter": {
                "equals": 2605341
              }
            },
            "panel": "scope"
          }
        ],
        "by": "ComposeSDK",
        "count": 500,
        "datasource": "USA Swimming Times Elasticube",
        "queryGuid": "68cbc09b-f851-4774-a32d-393011e9a053"
    }
    
    statsPayload.metadata.forEach(row => {
        if (row.jaql.filter && row.jaql.filter.equals !== undefined) {
            row.jaql.filter.equals = sessionStorage.getItem("swimmerId");
        }
    })
    
    const url2 = "https://usaswimming.sisense.com/api/datasources/USA%20Swimming%20Times%20Elasticube/jaql?trc=sdk-ui-1.11.0";
    console.log("Made it past url2");
    try {
        const response = await fetch(url2, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjRhZjE4MGY5Nzg1MmIwMDJkZTU1ZDhkIiwiYXBpU2VjcmV0IjoiNzFjMjkyMGMtYmFkYy05YjYwLTM0YjMtMTViZTVmZmI0NmU0IiwiYWxsb3dlZFRlbmFudHMiOlsiNjRhYzE5ZTEwZTkxNzgwMDFiYzM5YmVhIl0sInRlbmFudElkIjoiNjRhYzE5ZTEwZTkxNzgwMDFiYzM5YmVhIn0.1NUT0_fmdUVZi7eOBe-EM_Tu2gArLDGPvHUYuLJzfeg"
            },
            body: JSON.stringify(statsPayload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response as JSON
        return data; // Return the parsed JSON
    } catch (error) {
        console.error("Error fetching swim data:", error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}