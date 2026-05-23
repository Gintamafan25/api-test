document.addEventListener("DOMContentLoaded", async ()=>{
    
    let url_list = await getList();
    
    await displayList(url_list)


    
   
   
})

let masterList = []

function masterLoader(masterList,data) {
    masterList.length = 0;
   
   
   
    const layer = 0
    masterList.push({dataType:typeof data, layer: layer, value : data, parent: null})
    let index = masterList.findIndex(item => item.value === data)
    
    for (let x in data) {
        treeWalker(masterList,data[x], layer, masterList[index])
    }
    
}

function treeWalker(masterList,node, layer, parent) {
    

    if (typeof node !== "object" ) {
        
        masterList.push({dataType : typeof node, layer : layer + 1, value : node, parent : parent})
        return
    } else {
        try {
            
            masterList.push({dataType: typeof node, layer : layer + 1, value: node, parent : parent})
            let index = masterList.findIndex(item => item.value === node)
            for (let y in node) {
                treeWalker(masterList, node[y], layer + 1, masterList[index])
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
            
            const json = await loadData(a)
            masterLoader(masterList, json)
            masterListGetter()
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

function masterListGetter() {
    const traversedList = []
    if (masterList.length !== 0) {
        

        masterList.forEach( (a) => {
            
            if (!traversedList[a.layer]) {
                
                traversedList[a.layer] = []
            }
            traversedList[a.layer].push(a)
        })
    }
    
    console.log(traversedList)
}