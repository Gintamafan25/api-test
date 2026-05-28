

document.addEventListener("DOMContentLoaded", async ()=>{
    currentURL = "/financial_data"
    
    let data1 =  await loadData(currentURL)
   
    await renderChart(data1)

})

let masterList = []
let traversedList = []
let currentURL = ""
let chart;

async function renderChart(data) {  
    let row = Object.values(data)[0].slice(-1000)
    
    const labels = row.map(d => d.date)
    const prices = row.map(d => d.close)

    const ctx = document.getElementById("myChart")

    if (chart) {
        chart.destroy()
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{label: "price",
                data: prices
            }]
        }
    })



}

function masterLoader(masterList,data) {
    masterList.length = 0;
   
   
    
    const layer = 0
    const key = 0
    masterList.push({dataType:typeof data, layer: layer, value : data, parent: null, key: currentURL})
    let index = masterList.findIndex(item => item.value === data)
    
    for (let x in data) {
        treeWalker(masterList,data[x], layer, masterList[index], x)
    }
    
}

function treeWalker(masterList,node, layer, parent, key) {
    

    if (typeof node !== "object" ) {
        
        masterList.push({dataType : typeof node, layer : layer + 1, value : node, parent : parent, key: key})
        return
    } else {
        try {
            
            masterList.push({dataType: typeof node, layer : layer + 1, value: node, parent : parent, key : key})
            let index = masterList.findIndex(item => item.value === node)
            for (let y in node) {
                treeWalker(masterList, node[y], layer + 1, masterList[index], y)
            }
            
        } catch (e) {
            console.log(e, "error")
        }
    }
    return;
}

function displayList(list) {
    const mainDiv = document.getElementById("div1")
    const table = document.createElement("table");
    const tableHeaderRow = document.createElement("tr")
    const tableHeader = document.createElement("th")

   
    table.id = "tb1"
    table.className = "table1"
    tableHeaderRow.className = "th1"

    mainDiv.appendChild(table)
    table.appendChild(tableHeaderRow)
    tableHeaderRow.appendChild(tableHeader)
    tableHeader.innerHTML = "Available URLs"

    list.forEach( (a) => {
        let dataRow = document.createElement("tr")
        let data = document.createElement("td")
        
        table.appendChild(dataRow)

        dataRow.className = "tr1"
        dataRow.appendChild(data)
        data.innerHTML = a
        data.addEventListener("click", async ()=> {
            const div2 = document.getElementById("div2")
            div2.style.visibility = "hidden"
            const elements = document.querySelectorAll(".nodeDiv")
            
            if (elements.length > 0) {
                elements.forEach((a) => {
                a.remove()
            })
            }
            

            

            const json = await loadData(a)
            div2.innerHTML = ""
            div2.style.visibility = "visible"

            const normJSON = normalizeJSON(json)
            masterLoader(masterList, normJSON)
            let counter = 0
            masterList.forEach((item) => {
                item.id = counter++
            })
            
            if (traversedList.length !== 0) {
                nodeDisplayer(traversedList[0][0], div2)
            }
            
        })
    })
}


async function loadData(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            console.log("HTTP Error:", response.status);
            return [];
        }
        
        return await response.json();
    } catch (e) {
        console.log("network error", e)
        return [];
    }
}

async function getList() {
    try {
        let response = await fetch("/api/list");
        if (!response.ok) {
            console.log("HTTP Error:", response.status);
            return []
        }
        return await response.json();
    } catch (e) {
        console.log("failed to load url lists", e)
        return [];
    }
}





function nodeDisplayer(node, parentNode) {
    
    let parentDiv = ""
    parentDiv = parentNode
    

    const nodeDiv = document.createElement("div")
    const childContainer = document.createElement("div")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")

   
    
    parentDiv.appendChild(nodeDiv)
    
    
    
    nodeDiv.id = "node-" + node.id

    
    nodeDiv.appendChild(p1)
    nodeDiv.appendChild(p2)

    nodeDiv.displayingChildren = false
    
    nodeDiv.appendChild(childContainer)

    
    if (!["boolean", "string", "number"].includes(node.dataType)){

    
        nodeDiv.addEventListener("click", (e) => {
            e.stopPropagation()
            let allChildren = masterList.filter(item => item.parent === node)
            
            if (nodeDiv.displayingChildren === false) {
                nodeDiv.displayingChildren = true
                nodeDiv.className = "nodeDiv"
                allChildren.forEach((a) => {
                    nodeDisplayer(a, childContainer)
                    
                })

            } else {
                nodeDiv.displayingChildren = false
                nodeDiv.className = "nodeDiv0"
                allChildren.forEach((a) => {
                    
                    const childDiv = document.getElementById("node-" + a.id)
                    childDiv.remove()
                })
                

            }
        })
        if (nodeDiv.displayingChildren === false) {
            nodeDiv.className = "nodeDiv0"
        } else {
            nodeDiv.className = "nodeDiv"
        }
    } else {
        nodeDiv.addEventListener("click", (e) => {
            e.stopPropagation()
        })
        nodeDiv.classList = "endDiv"
    }
    

    p1.innerHTML = node.key
    p2.innerHTML = node.value

    if (typeof node.value === "object" && node.value !== null) {
        if (Array.isArray(node.value)) {
            let size = node.value.length
            p2.innerHTML = `Array of Size: ${size}`
        } else {
            let size = Object.keys(node.value).length
            p2.innerHTML = `JSON with ${size} keys`
        } 
    }
}




function normalizeJSON(response) {
    const objres = Object.keys(response)
    const objnum = Object.keys(response).length
    if (objnum === 1) {
        
        if (["payload", "result", "data"].includes(objres[0])) {
            return response[key]
        } 
    }
    if (objnum > 1) {
        
        for (let x in objres) {
            if (["payload", "result", "data"].includes(objres[x])) {
                
                return response[objres[x]]
            }
        }
    }
    return response
}