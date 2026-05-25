

document.addEventListener("DOMContentLoaded", async ()=>{
    
    let url_list = await getList();
    
    await displayList(url_list)


    
   
   
})

let masterList = []
let traversedList = []
let currentURL = ""

function masterLoader(masterList,data) {
    masterList.length = 0;
   
   
    console.log(data)
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

            div2.innerHTML = ""
            const json = await loadData(a)
            const normJSON = normalizeJSON(json)
            masterLoader(masterList, normJSON)
            masterListGetter()  
            if (traversedList.length !== 0) {
                traversedList.forEach((a) => {
                    a.forEach((b) => {
                        nodeDisplayer(b)
                    })
                })
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
        
        currentURL = url
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

function masterListGetter() {
    traversedList.length = 0
    if (masterList.length !== 0) {
        

        masterList.forEach( (a) => {
            
            if (!traversedList[a.layer]) {
                
                traversedList[a.layer] = []
            }
            traversedList[a.layer].push(a)
        })
    }
    
    
}

function masterListSetter() {
    if (traversedList.length !== 0) {
        //need to create a design, that creates a div for layer 0
        //it displays relevent data for layer zero, including full length
        //when clicked, it shows all of the layer 1 nodes, you will need relevent information for each node
        
        traversedList.forEach((a) => {

        })
    }
}

function nodeDisplayer(node) {
    const div2 = document.getElementById("div2")
    const nodeDiv = document.createElement("div")

    const p1 = document.createElement("p")
    const p2 = document.createElement("p")

    div2.appendChild(nodeDiv)

    nodeDiv.appendChild(p1)
    nodeDiv.appendChild(p2)

    p1.innerHTML = node.key
    p2.innerHTML = node.value

    nodeDiv.className = "nodeDiv"

    nodeDiv.id = `node${node.layer}`

    if (p2.innerHTML)


    if (node.layer !== 0) {
        
        nodeDiv.hidden = true
    }
    
    
    
}

function normalizeJSON(response) {
    const objres = Object.keys(response)
    const objnum = Object.keys(response).length
    if (objnum === 1) {
        console.log("one parameter")
        if (["payload", "result", "data"].includes(objres[0])) {
            return response[key]
        } 
    }

    if (objnum > 1) {
        console.log("multiple parameters")
        
        
        for (let x in objres) {
            if (["payload", "result", "data"].includes(objres[x])) {
                console.log("should be normalized")
                return response[objres[x]]
            }
        }
    }

    return response

}