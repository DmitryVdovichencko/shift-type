
//Адаптируем дни недели месяца к российскому формату когда первый день недели - понедельник
const convertRuMonthDays = (month,year) => {
    let monthData={},
    firstDateDay=new Date(year,month).getDay(),
    lastDateDay=new Date(year,(month+1),0).getDay(),
    countDays=new Date(year,(month+1),0).getDate();
    firstDateDay =(firstDateDay===0) ? firstDateDay=6 : firstDateDay-=1;
    lastDateDay =(lastDateDay===0) ? lastDateDay=6 : lastDateDay-=1;

    monthData.firstDateDay=firstDateDay, monthData.lastDateDay=lastDateDay; monthData.countDays=countDays;
    return monthData;
}
const monthArr = (month, year) => {
if(month>12){
  month=0;
  year+=1;
}
if(month<0){
  month=12;
  year-=1;
}

  let date = new Date(year,month),
  
    options = {
      month: 'long',
      year: 'numeric'
    },
  prev=convertRuMonthDays((month-1),year),
  act=convertRuMonthDays(month,year),
  next=convertRuMonthDays((month+1),year)
    monthObj={
      date: date,
      prevMonth:[],
      actMonth:[],
      nextMonth:[],
      prevDate:prev.toLocaleString("ru", options),
      actDate:date.toLocaleString("ru", options),
      nextDate:next.toLocaleString("ru", options)
  } ;

  if (act.firstDateDay>0){
    for (let i = prev.countDays-act.firstDateDay+1; i < prev.countDays+1; i++) {
        monthObj.prevMonth.push(i);
    }
  }

    for (let i = 0; i < act.countDays; i++) {
        monthObj.actMonth.push(i+1);
    }
    if (act.lastDateDay<6){
    for (let i = 0; i < 7-next.firstDateDay; i++) {
        monthObj.nextMonth.push(i+1);
    }
  }

    return monthObj;
}

// Вывод в html в виде таблицы
//Считаем число строк
const rowTableCalc = (monthObj) => Math.floor((monthObj.prevMonth.length + monthObj.actMonth.length + monthObj.nextMonth.length)/7);

//Функция построения таблицы с числом строк и столбцов
const createTable = (rowNum,colNum,parentNode)=>{
  let table=document.createElement('table');
  parentNode.appendChild(table);


  for (let i = 0; i <=(rowNum-1); i++) {
    let tr=table.insertRow(0);
  }

  for (let j = 0; j <=(colNum-1); j++) {
    for (let i = 0; i <=(rowNum-1); i++) {
        let td=table.rows[i].insertCell(0);
    }
  }
}
const removeTable = (parentNode) =>{
  parentNode.removeChild();
}
// createTable(rowTableCalc(monthArr(13,2018)),7,document.querySelectorAll('.calendar')[0])
//Заполняем таблицу и осуществляем контроль за действиями пользователя
const fillTable = (month,year,tableElement) => {
  let monthObj=monthArr(month,year);//определяем объект месяца
  let daysNum=monthObj.prevMonth.length + monthObj.actMonth.length + monthObj.nextMonth.length;// определяем общее количество дней
  if (tableElement.hasChildNodes()){
      while (tableElement.firstChild) {
        tableElement.removeChild(tableElement.firstChild);
      }
    }
  createTable(rowTableCalc(monthObj),7,tableElement);//создаем таблицу для заполнения
   
   // let days=0; //общее количество дней

    //заполняем первую неделю
      for (let week = 0; week <= rowTableCalc(monthObj); week++) {
        if(week===0){
          for (let i = 0; i < 7; i++) {
            if(i<monthObj.prevMonth.length){
              tableElement.childNodes[0].rows[0].cells[i].classList.add('prev');
              tableElement.childNodes[0].rows[0].cells[i].textContent=monthObj.prevMonth[i];
            }
            if(i>=monthObj.prevMonth.length){
              tableElement.childNodes[0].rows[0].cells[i].classList.add('act');
              tableElement.childNodes[0].rows[0].cells[i].textContent=monthObj.actMonth[i-monthObj.prevMonth.length];
            }
          }
        }
        if(week>0 && week < rowTableCalc(monthObj)){
          
             for (let i = 0; i < 7; i++) {
              let day=week*7-monthObj.prevMonth.length+1+i;
                if(day<= monthObj.actMonth.length){
                  tableElement.childNodes[0].rows[week].cells[i].classList.add('act');
                  tableElement.childNodes[0].rows[week].cells[i].textContent=day;
                                  
                }
                else{
                  
                  tableElement.childNodes[0].rows[week].cells[i].classList.add('next');
                  tableElement.childNodes[0].rows[week].cells[i].textContent=monthObj.nextMonth[i-(convertRuMonthDays(month,year).lastDateDay+1)];
                }


            }
          
        }
      }

  


  

}
const arrDateFind=(array,item)=>{
  for (let i = 0; i < array.length; i++) {
    if(+array[i]===+item){
      return i;
    }
  }
  return -1;
}

const calendarControl=(monthElement, yearElement, prevElement, nextElement,resultElement) =>{
  let today=new Date();
  today=new Date(today.getFullYear(),today.getMonth(), today.getDate(),-today.getTimezoneOffset()/60);
  let month=today.getMonth(), year=today.getFullYear();
  let selectedDate = [];
  let options = {
  month: 'long'
  };
  monthElement.textContent=today.toLocaleString("ru", options);
  yearElement.textContent=today.getFullYear();

  const changeMonth=(factor)=>{
      today=new Date(today.getFullYear(),today.getMonth()+factor, today.getDate(),-today.getTimezoneOffset()/60);
      monthElement.textContent=today.toLocaleString("ru", options);
      yearElement.textContent=today.getFullYear();
      month=today.getMonth(), year=today.getFullYear();
      fillTable(month,year,document.querySelectorAll('.calendar')[0]);
  }
  const control = (event) =>{
    // console.log(event.target);
    if (event.target.classList.contains("next")){
      changeMonth(1);
    }
    else if (event.target.classList.contains("prev")){
      changeMonth(-1);
    }
    else if (event.target.classList.contains("act")){
      
      let date_select=new Date(today.getFullYear(),today.getMonth(), event.target.textContent,-today.getTimezoneOffset()/60);
      if(!event.target.classList.contains("selected")){

        event.target.classList.toggle("selected");
        selectedDate.push(date_select);
        
        shiftControl(document.querySelector("#teams"), document.querySelector("#shift_type"),document.querySelectorAll('.result-wrapper')[0],selectedDate,false);
      }
      else {
        event.target.classList.toggle("selected");
        let index = arrDateFind(selectedDate,date_select);
        console.log("el is" + date_select);
        
        if (index > -1) {
          
          selectedDate.splice(index, 1);
          console.log("arr is" + selectedDate);

          shiftControl(document.querySelector("#teams"), document.querySelector("#shift_type"),document.querySelectorAll('.result-wrapper')[0],selectedDate,true);
        }
        
      }
      
      
    }
  }
  document.addEventListener("click", control, false);
  let update = shiftControl.bind(this, document.querySelector("#teams"), document.querySelector("#shift_type"),document.querySelectorAll('.result-wrapper')[0],selectedDate,true);
  document.querySelector("#teams").addEventListener("change", update);
  document.querySelector("#shift_type").addEventListener("change", update);
  fillTable(month,year,document.querySelectorAll('.calendar')[0]);

}
const outputResult = (outputEl, selectedDate, teamNum, typeNum,update) => {
  if(typeof(selectedDate)!=="undefined"){
    let options = { day: 'numeric', month: 'long',  year: 'numeric', weekday: 'long' },
    div = document.createElement("div"),
    resultEl = outputEl.appendChild(div);
    resultEl.classList.add("result");
    resultEl.innerHTML="<p>"+ selectedDate.toLocaleString("ru", options) + "</p>" + "<p>Наша бригада " + shiftType(selectedDate,teamNum,typeNum) +"</p>";
  }
  
  
  
  

}
const shiftControl = (teamNumEl, typeNumEl, outputEl, selectedDate,update) => {
  let shiftControl = {
    teamNum:+teamNumEl.value,
    typeNum:+typeNumEl.value
  };
  if(update&&selectedDate.length>0){
    outputEl.innerHTML="";
    for (let i = 0; i < selectedDate.length; i++) {
      outputResult(outputEl, selectedDate[i],shiftControl.teamNum ,shiftControl.typeNum);
    }
  }
  else if(!update&&selectedDate.length>0){
     outputResult(outputEl, selectedDate[selectedDate.length-1],shiftControl.teamNum ,shiftControl.typeNum);
  }
  else if(update&&selectedDate.length===0){
    outputEl.innerHTML="";
  }
 
  
  
  // teamNumEl.addEventListener("change", outputResult)

}

calendarControl(document.querySelectorAll('.month')[0],document.querySelectorAll('.year')[0]);
