var processList = [];
var queue1List = [];
var queue2List = [];
var queue3List = [];
const formProcess = document.getElementById('process-form');
const btnCalculate = document.getElementById('btnCal');
const btnClear = document.getElementById('btnClear');

formProcess.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();

    var processId = document.getElementById('process-id').value;
    var arrivalTime = document.getElementById('arrival-time').value;
    var burstTime = document.getElementById('burst-time').value;
    var priority  = document.getElementById('priority').value;

    if(processId === '' || arrivalTime === '' || burstTime === '' || priority === ''){
        return;
    }

    var process = {
        processId: processId,
        arrivalTime: arrivalTime,
        burstTime: burstTime,
        priority: priority
    }

    processList.push(process);
    console.log(process);

    formProcess.reset();

    window.localStorage.setItem('processList', JSON.stringify(processList));

    renderData(processList);
});

function renderDataFromLocalStorage() {
    let processListFromStorage = JSON.parse(window.localStorage.getItem('processList'));  
    renderData(processListFromStorage);
}

btnClear.addEventListener('click', (e) => {
    localStorage.clear();
})

btnCalculate.addEventListener('click', event => {
    if (processList.length == 0) {
        alert('Please insert some processes');
        return;
    }

    processList.forEach(process => {
        if (process.priority > 6) {
            queue3List.push(process);
        }

        if (process.priority > 3 && process.priority < 6) {
            queue2List.push(process);
        }

        if (process.priority >= 0 && process.priority <= 3) {
            queue1List.push(process);
        }
    })

    firstComeFirstServed(queue1List);
    // shortestJobFirst(queue2List);
    // roundRobin(queue3List);
});

function renderData(processList) {
    var htmls = "";

    processList.forEach(process => {
        htmls +=
        `<tr>
            <td id="tdprocessId">${process.processId}</td>
            <td id="tdArrivalTime">${process.arrivalTime}</td>
            <td id="tdBurstTime">${process.burstTime}</td>
            <td id="tdPriority">${process.priority}</td>
        </tr>`
    });


    document.getElementById('tblProcessList').getElementsByTagName('tbody')[0].innerHTML = htmls;
}

function renderQueue1Data(completedList) {
    var htmls = `
    <br>
    <br>

    <hr>
    <h3>Queue 1: First Come First Served</h3>
    <br>

    <table class="table table-bordered" id="tblResults">
      <thead>
        <tr>
          <th scope="col">Process ID</th>
          <th scope="col">Arrival Time</th>
          <th scope="col">Burst Time</th>
          <th scope="col">Compvared Time</th>
          <th scope="col">Waiting Time</th>
          <th scope="col">Turnaround Time</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    `;

    document.getElementById('result1').innerHTML = htmls;

    htmls = "";

    completedList.forEach(process => {
        htmls +=
            `<tr>
                <td id="tdprocessId">${process.processId}</td>
                <td id="tdArrivalTime">${process.arrivalTime}</td>
                <td id="tdBurstTime">${process.burstTime}</td>
                <td id="tdBurstTime">${process.compvaredTime}</td>
                <td id="tdBurstTime">${process.waitingTime}</td>
                <td id="tdBurstTime">${process.turnAroundTime}</td>
            </tr>`
    });

    document.getElementById('tblResults').getElementsByTagName('tbody')[0].innerHTML = htmls;

}

function renderQueue2Data(completedList) {
    var htmls = `
    <br>
    <br>

    <hr>
    <h3>Queue 2: Shortest Job First</h3>
    <br>

    <table class="table table-bordered" id="tblResults2">
      <thead>
        <tr>
          <th scope="col">Process ID</th>
          <th scope="col">Arrival Time</th>
          <th scope="col">Burst Time</th>
          <th scope="col">Compvared Time</th>
          <th scope="col">Waiting Time</th>
          <th scope="col">Turnaround Time</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    `;

    document.getElementById('result2').innerHTML = htmls;

    htmls = "";

    // Bind table data
    completedList.forEach((process) => {
        htmls +=
                `<tr>
                    <td id="tdprocessId">${process.processId}</td>
                    <td id="tdArrivalTime">${process.arrivalTime}</td>
                    <td id="tdBurstTime">${process.burstTime}</td>
                    <td id="tdBurstTime">${process.compvaredTime}</td>
                    <td id="tdBurstTime">${process.waitingTime}</td>
                    <td id="tdBurstTime">${process.turnAroundTime}</td>
                </tr>`; 
        });
    
        document.getElementById('tblResults2').getElementsByTagName('tbody')[0].innerHTML = htmls;
}

function firstComeFirstServed(queue1List){
    var time = 0;
    var queue = [];
    var completedList = [];

    while (queue1List.length > 0 || queue.length > 0) {
        while (queue.length == 0) {
            time++;
            addToQueue();
        }

        // Dequeue from queue and run the process.
        process = queue.shift();
        for(var i = 0; i < process.burstTime; i++){
            time++
            addToQueue();
        }   
        process.compvaredTime = time;
        process.turnAroundTime = process.compvaredTime - process.arrivalTime;
        process.waitingTime = process.turnAroundTime - process.burstTime;
        completedList.push(process);
    }

    function addToQueue() {
        for(var i = 0; i < queue1List.length; i++) {
            if(time >= queue1List[i].arrivalTime) {
                var process = {
                    processId: queue1List[i].processId, 
                    arrivalTime: queue1List[i].arrivalTime, 
                    burstTime: queue1List[i].burstTime
                }
                queue1List.splice(i, 1);
                queue.push(process);
            }
        }
    }

    // Bind table data
    renderQueue1Data(completedList);

    // Get average
    var avgTurnaroundTime = 0;
    var avgWaitingTime = 0;
    var maxCompvaredTime = 0;

    completedList.forEach(function(process){
        if (process.compvaredTime > maxCompvaredTime) {
            maxCompvaredTime = process.compvaredTime;
        }
        avgTurnaroundTime = avgTurnaroundTime + process.turnAroundTime;
        avgWaitingTime = avgWaitingTime + process.waitingTime;
    });

    console.log( avgTurnaroundTime / completedList.length );
    console.log( avgWaitingTime / completedList.length );
    console.log(completedList.length / maxCompvaredTime);
}

function shortestJobFirst(queue2List){
    var completedList = [];
    var time = 0;
    var queue = [];

    while (processList.length>0 || queue.length>0) {
        addToQueue();
        while (queue.length==0) {                
            time++;
            addToQueue();
        }
        processToRun = queue.shift();
        for (var i = 0; i < processToRun.burstTime; i++) {
            time++;
            addToQueue();
        }
        processToRun.processId = processToRun.processId;
        processToRun.arrivalTime = processToRun.arrivalTime;
        processToRun.burstTime = processToRun.burstTime;
        processToRun.completedTime = time;
        processToRun.turnAroundTime = processToRun.completedTime - processToRun.arrivalTime;
        processToRun.waitingTime = processToRun.turnAroundTime - processToRun.burstTime;
        completedList.push(processToRun);
    }
    function addToQueue() {
        for(var i = 0; i < processList.length; i++) {
            if(processList[i].arrivalTime === time) {
                var process = {
                    processId: processList[i].processId, 
                    arrivalTime: processList[i].arrivalTime, 
                    burstTime: processList[i].burstTime
                }
                processList.splice(i, 1);
                queue.push(process);
            }
        }
    }
    function selectProcess() {
        if (queue.length!=0) {
            queue.sort(function(a, b){
                if (a.burstTime > b.burstTime) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        var process = queue.shift();
        return process;
    }

    // Get average
    var avgTurnaroundTime = 0;
    var avgWaitingTime = 0;
    var maxCompvaredTime = 0;
    var throughput = 0;

    renderQueue2Data(completedList);

    // completedList.forEach((process) => {
    //     if (process.compvaredTime > maxCompvaredTime) {
    //         maxCompvaredTime = process.compvaredTime;
    //     }
    //     avgTurnaroundTime = avgTurnaroundTime + process.turnAroundTime;
    //     avgWaitingTime = avgWaitingTime + process.waitingTime;
    // });

    // console.log( avgTurnaroundTime / completedList.length );
    // console.log( avgWaitingTime / completedList.length );
    // console.log(completedList.length / maxCompvaredTime);
}

// function roundRobin(queue3List) {
//     var timeQuantum = $('#timeQuantum');
//     var timeQuantumVal= parseInt(timeQuantum.val(), 10);
//     if(timeQuantum.val() ==''){
//         alert('Please enter time quantum');
//         timeQuantum.addClass('is-invalid');
//         return;
//     }
//     var completedList = [];
//     var time = 0;
//     var queue = [];
            
//     while (processList.length > 0 || queue.length > 0) {
//         addToQueue();
//             while (queue.length == 0) {               
//                 time++;
//                 addToQueue();
//             }
//             selectProcessForRR();
//             }

//             function addToQueue() {
//                 for(var i = 0; i < processList.length; i++) {
//                     if(processList[i].arrivalTime === time) {
//                         var process = {
//                             processID: processList[i].processID, 
//                             arrivalTime: processList[i].arrivalTime, 
//                             burstTime: processList[i].burstTime
//                         }
//                         processList.splice(i, 1);
//                         queue.push(process);
//                     }
//                 }
//             }
//             function selectProcessForRR() {
//                 if (queue.length!=0) {
//                     queue.sort(function(a, b){
//                         if (a.burstTime > b.burstTime) {
//                             return 1;
//                         } else {
//                             return -1;
//                         }
//                     });
                                                
//                     if (queue[0].burstTime < timeQuantumVal) {
//                         process = queue.shift();
//                         process.completedTime = time + process.burstTime;
                            
//                         for (var index = 0; index < process.burstTime; index++) {
//                             time++;
//                             addToQueue(); 
//                         }
//                         completedList.push(process);

//                     }
//                     else if(queue[0].burstTime == timeQuantumVal){
//                         process = queue.shift();
//                         process.completedTime = time + timeQuantumVal;
//                         completedList.push(process);

//                         for (var index = 0; index < timeQuantumVal; index++) {
//                             time++;
//                             addToQueue();   
//                         }
//                     }  
//                     else if(queue[0].burstTime > timeQuantumVal){
//                         process = queue[0];
//                         queue[0].burstTime = process.burstTime - timeQuantumVal;

//                         for (var index = 0; index < timeQuantumVal; index++) {
//                             time++;
//                             addToQueue();
//                         }
//                     }   
//                 }
//             }
    
            
// } 

 
